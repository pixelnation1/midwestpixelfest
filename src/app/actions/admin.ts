"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizer } from "@/lib/admin/auth";
import { publicErrorMessage, organizerActionError } from "@/lib/admin/safe-error";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import { syncPublicSponsorListing, syncPublicVendorListing } from "@/lib/persistence/directory";
import {
  addSponsorNote,
  getSponsorshipByReference,
  persistSponsorshipRecord,
  sponsorshipToRecord,
} from "@/lib/persistence/sponsors";
import { uploadSponsorLogo } from "@/lib/persistence/storage";
import {
  addVendorNote,
  applicationToRecord,
  getVendorApplicationByReference,
  persistVendorRecord,
  updateVendorInterestStatus,
} from "@/lib/persistence/vendors";
import { sendSponsorLifecycleEmail, sendVendorLifecycleEmail } from "@/lib/forms/vendor-lifecycle-email";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { VendorSpaceId } from "@/lib/vendors";
import { formatSpaceLabel } from "@/lib/vendor-ops/pricing";
import type { VendorApplicationStatus, VendorPricingTier } from "@/lib/vendor-ops/status";
import {
  applyStatus,
  approveApplication,
  effectivePaymentDueOn,
  extendPaymentDeadline,
  markInvoiceSent,
  markPaymentOverdue,
  recordPaymentReceived,
} from "@/lib/vendor-ops/workflow";
import {
  buildApprovalEmail,
  buildDeclineEmail,
  buildPaymentConfirmationEmail,
  buildPaymentOverdueEmail,
  buildPaymentReminderEmail,
  buildWaitlistEmail,
} from "@/lib/vendor-ops/emails";
import { formatCalendarDateLong } from "@/lib/vendor-ops/dates";
import {
  activateSponsor,
  applySponsorshipStatus,
  commitSponsorship,
  createSponsorInvoice,
  markSponsorInvoiceSent,
  recordSponsorAssetsReceived,
  recordSponsorshipPayment,
  requestSponsorAssets,
} from "@/lib/sponsor-ops/workflow";
import {
  buildSponsorAssetReceivedEmail,
  buildSponsorAssetRequestEmail,
  buildSponsorCommitmentEmail,
  buildSponsorInvoiceSentEmail,
  buildSponsorNextStepsEmail,
  buildSponsorPaymentReceivedEmail,
} from "@/lib/sponsor-ops/emails";
import { setFulfillmentStatus } from "@/lib/sponsor-ops/fulfillment";
import type { SponsorFulfillmentItemId } from "@/lib/sponsor-ops/types";
import type { SponsorFulfillmentStatus, SponsorshipStatus } from "@/lib/sponsor-ops/status";

export type AdminActionState = { status: "idle" | "error" | "success"; message: string };

async function adminClient() {
  const organizer = await requireOrganizer();
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("unavailable");
  return { organizer, supabase };
}

function fail(message: string): AdminActionState {
  return { status: "error", message };
}

export async function updateInterestStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "") as
      | "new"
      | "contacted"
      | "converted"
      | "closed";
    if (!id) return fail("Missing interest record.");
    await updateVendorInterestStatus(supabase, id, status);
    await recordOrganizerAudit({
      action: `vendor_interest_${status}`,
      entityType: "vendor_interest",
      entityId: id,
      actor: organizer,
    });
    revalidatePath("/admin/vendor-interests");
    return { status: "success", message: "Interest status updated." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not update vendor interest."));
  }
}

export async function vendorStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const next = String(formData.get("nextStatus") ?? "") as VendorApplicationStatus;
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const previous = String(detail.application.status);
    let record = applicationToRecord(detail.application, detail.offer, detail.history);
    record = applyStatus(record, next, "organizer");
    await persistVendorRecord(supabase, String(detail.application.id), previous as VendorApplicationStatus, record, organizer.userId);
    await recordOrganizerAudit({
      action: `vendor_status_${next}`,
      entityType: "vendor_application",
      entityReference: reference,
      entityId: String(detail.application.id),
      actor: organizer,
    });
    revalidatePath(`/admin/vendors/${reference}`);
    revalidatePath("/admin/vendors");
    revalidatePath("/admin");
    return { status: "success", message: "Status updated. No email was sent." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not update status."));
  }
}

export async function approveVendorAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    if (String(formData.get("confirm")) !== "yes") {
      return fail("Confirm the offer before saving approval.");
    }
    const reference = String(formData.get("reference") ?? "");
    const offeredSpace = String(formData.get("offeredSpace") ?? "") as VendorSpaceId;
    const pricingTier = String(formData.get("pricingTier") ?? "regular") as VendorPricingTier;
    const extraBadges = Number(formData.get("extraBadges") ?? 0);
    const extraTables = Number(formData.get("extraTables") ?? 0);
    const customBasePriceRaw = String(formData.get("customBasePrice") ?? "").trim();
    const customNote = String(formData.get("customNote") ?? "").trim();
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const previous = String(detail.application.status) as VendorApplicationStatus;
    let record = applicationToRecord(detail.application, detail.offer, detail.history);
    record = approveApplication(record, {
      businessName: String(detail.application.business_name),
      requestedSpace: String(detail.application.requested_space) as VendorSpaceId,
      offeredSpace,
      extraBadges,
      extraTables,
      electricityRequested: Boolean(detail.application.electricity_requested),
      offerIssuedAt: new Date(),
      pricingTier,
      customBasePrice: customBasePriceRaw ? Number(customBasePriceRaw) : undefined,
      customPricingInternalNote: customNote || undefined,
    });
    const paymentDueOn = String(formData.get("paymentDueOn") ?? "").trim();
    if (paymentDueOn && record.offer && paymentDueOn !== record.offer.paymentDueOn) {
      record = extendPaymentDeadline(
        record,
        paymentDueOn,
        "Organizer-set payment due date at approval.",
      );
    }
    await persistVendorRecord(supabase, String(detail.application.id), previous, record, organizer.userId);
    await recordOrganizerAudit({
      action: "vendor_approved",
      entityType: "vendor_application",
      entityReference: reference,
      entityId: String(detail.application.id),
      actor: organizer,
    });
    revalidatePath(`/admin/vendors/${reference}`);
    revalidatePath("/admin/vendors");
    revalidatePath("/admin/payments");
    revalidatePath("/admin");
    return { status: "success", message: "Offer saved. Send the approval email separately." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not save approval."));
  }
}

export async function recordVendorInvoiceAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const previous = String(detail.application.status) as VendorApplicationStatus;
    let record = applicationToRecord(detail.application, detail.offer, detail.history);
    record = markInvoiceSent(record, {
      squareInvoiceId: String(formData.get("squareInvoiceId") ?? "").trim() || null,
      squareInvoiceUrl: String(formData.get("squareInvoiceUrl") ?? "").trim() || null,
    });
    await persistVendorRecord(supabase, String(detail.application.id), previous, record, organizer.userId);
    await recordOrganizerAudit({
      action: "vendor_invoice_sent",
      entityType: "vendor_application",
      entityReference: reference,
      actor: organizer,
    });
    revalidatePath(`/admin/vendors/${reference}`);
    revalidatePath("/admin/payments");
    return { status: "success", message: "Invoice recorded. Send the vendor email separately if needed." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not record invoice."));
  }
}

export async function confirmVendorPaymentAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    if (String(formData.get("confirm")) !== "yes") {
      return fail("Confirm the payment amount before recording it.");
    }
    const reference = String(formData.get("reference") ?? "");
    const amountPaid = Number(formData.get("amountPaid") ?? 0);
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const previous = String(detail.application.status) as VendorApplicationStatus;
    let record = applicationToRecord(detail.application, detail.offer, detail.history);
    record = recordPaymentReceived(record, {
      paidAt: new Date().toISOString(),
      amountPaid,
      paymentMethodOrReference: String(formData.get("paymentReference") ?? "").trim() || null,
    });
    await persistVendorRecord(supabase, String(detail.application.id), previous, record, organizer.userId);
    await syncPublicVendorListing(supabase, String(detail.application.id), {
      status: record.status,
      displayName: record.directory.displayName,
      category: record.directory.category,
      shortDescription: record.directory.shortDescription,
      logo: record.directory.logo,
      website: record.directory.website,
      socialUrl: record.directory.socialUrl,
      publishInDirectory: record.directory.publishInDirectory,
    });
    await recordOrganizerAudit({
      action: "vendor_payment_confirmed",
      entityType: "vendor_application",
      entityReference: reference,
      actor: organizer,
    });
    revalidatePath(`/admin/vendors/${reference}`);
    revalidatePath("/admin/payments");
    revalidatePath("/admin");
    return { status: "success", message: "Payment recorded. Vendor is confirmed." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not record payment."));
  }
}

export async function markVendorOverdueAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const previous = String(detail.application.status) as VendorApplicationStatus;
    let record = applicationToRecord(detail.application, detail.offer, detail.history);
    record = markPaymentOverdue(record);
    await persistVendorRecord(supabase, String(detail.application.id), previous, record, organizer.userId);
    revalidatePath(`/admin/vendors/${reference}`);
    return { status: "success", message: "Marked overdue. Space is not automatically released." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not mark overdue."));
  }
}

export async function addVendorNoteAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const note = String(formData.get("note") ?? "").trim();
    if (!note) return fail("Enter a note.");
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    await addVendorNote(supabase, String(detail.application.id), note, organizer.userId);
    revalidatePath(`/admin/vendors/${reference}`);
    return { status: "success", message: "Internal note saved. It is not included in emails." };
  } catch {
    return fail("Could not save note.");
  }
}

export async function sendVendorEmailAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const kind = String(formData.get("emailKind") ?? "");
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const record = applicationToRecord(detail.application, detail.offer, detail.history);
    const to = String(detail.application.email);
    const offer = record.offer;
    let email;
    if (kind === "approval") {
      if (!offer) return fail("Save an approval offer first.");
      email = buildApprovalEmail({
        applicationType: record.applicationType,
        businessName: String(detail.application.business_name),
        applicationReference: reference,
        offeredSpaceLabel: formatSpaceLabel(offer.offeredSpace),
        pricingTierLabel: offer.snapshot.pricingTier,
        basePrice: offer.snapshot.basePrice,
        addOns: offer.snapshot.addOns.map((item) => ({ label: item.name, amount: item.lineTotal })),
        total: offer.snapshot.total,
        paymentDueLabel: formatCalendarDateLong(effectivePaymentDueOn(offer)),
        invoiceState: offer.invoice.status === "sent" ? "sent" : "will_send",
      });
    } else if (kind === "waitlist") {
      email = buildWaitlistEmail({
        businessName: String(detail.application.business_name),
        applicationReference: reference,
      });
    } else if (kind === "decline") {
      email = buildDeclineEmail({
        businessName: String(detail.application.business_name),
        applicationReference: reference,
      });
    } else if (kind === "payment_reminder" && offer) {
      email = buildPaymentReminderEmail({
        businessName: String(detail.application.business_name),
        applicationReference: reference,
        spaceLabel: formatSpaceLabel(offer.offeredSpace),
        amountDue: offer.snapshot.total,
        paymentDueLabel: formatCalendarDateLong(effectivePaymentDueOn(offer)),
      });
    } else if (kind === "payment_overdue" && offer) {
      email = buildPaymentOverdueEmail({
        businessName: String(detail.application.business_name),
        applicationReference: reference,
        spaceLabel: formatSpaceLabel(offer.offeredSpace),
        amountDue: offer.snapshot.total,
        paymentDueLabel: formatCalendarDateLong(effectivePaymentDueOn(offer)),
      });
    } else if (kind === "payment_confirmation" && offer) {
      email = buildPaymentConfirmationEmail({
        businessName: String(detail.application.business_name),
        applicationReference: reference,
        spaceLabel: formatSpaceLabel(offer.offeredSpace),
        amountPaid: offer.invoice.amountPaid ?? offer.snapshot.total,
      });
    } else {
      return fail("Choose a valid email action.");
    }

    const result = await sendVendorLifecycleEmail({ to, email });
    if (!result.ok) {
      return fail(
        result.code === "not_configured"
          ? "Resend is not configured, so the email was not sent."
          : "The email could not be sent. The application record was not changed.",
      );
    }
    await recordOrganizerAudit({
      action: `vendor_email_${kind}`,
      entityType: "vendor_application",
      entityReference: reference,
      actor: organizer,
    });
    return { status: "success", message: "Email sent." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not send email."));
  }
}

export async function setVendorDirectoryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const publish = String(formData.get("publish")) === "yes";
    const detail = await getVendorApplicationByReference(supabase, reference);
    if (!detail) return fail("Application not found.");
    const previous = String(detail.application.status) as VendorApplicationStatus;
    const record = applicationToRecord(detail.application, detail.offer, detail.history);
    const next = {
      ...record,
      directory: {
        ...record.directory,
        displayName: String(formData.get("displayName") ?? record.directory.displayName).trim() || record.directory.displayName,
        category: String(formData.get("category") ?? record.directory.category).trim(),
        shortDescription: String(formData.get("shortDescription") ?? record.directory.shortDescription).trim(),
        website: String(formData.get("website") ?? record.directory.website ?? "").trim() || null,
        socialUrl: String(formData.get("socialUrl") ?? record.directory.socialUrl ?? "").trim() || null,
        publishInDirectory: publish,
      },
    };
    await persistVendorRecord(supabase, String(detail.application.id), previous, next, organizer.userId);
    await syncPublicVendorListing(supabase, String(detail.application.id), {
      status: next.status,
      displayName: next.directory.displayName,
      category: next.directory.category,
      shortDescription: next.directory.shortDescription,
      logo: next.directory.logo,
      website: next.directory.website,
      socialUrl: next.directory.socialUrl,
      publishInDirectory: publish,
    });
    await recordOrganizerAudit({
      action: publish ? "vendor_directory_published" : "vendor_directory_unpublished",
      entityType: "vendor_application",
      entityReference: reference,
      actor: organizer,
    });
    revalidatePath(`/admin/vendors/${reference}`);
    return { status: "success", message: publish ? "Vendor is eligible for the public directory." : "Vendor removed from the public directory." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not update directory settings."));
  }
}

export async function sponsorStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const next = String(formData.get("nextStatus") ?? "") as SponsorshipStatus;
    const detail = await getSponsorshipByReference(supabase, reference);
    if (!detail) return fail("Sponsorship not found.");
    const previous = String(detail.sponsorship.status) as SponsorshipStatus;
    let record = sponsorshipToRecord(detail);
    if (next === "committed") {
      const packageId = String(formData.get("packageId") ?? "");
      const agreedAmount = Number(formData.get("agreedAmount") ?? 0);
      const area = String(formData.get("approvedArea") ?? "").trim();
      const paymentDueAt = String(formData.get("paymentDueAt") ?? "").trim() || null;
      record = commitSponsorship(record, {
        packageId,
        agreedAmount,
        areasSponsored: area ? [area] : [],
        paymentDueAt,
      });
    } else if (next === "invoice_created") {
      record = createSponsorInvoice(record);
    } else if (next === "invoice_sent") {
      record = markSponsorInvoiceSent(record, {
        squareInvoiceId: String(formData.get("squareInvoiceId") ?? "").trim() || null,
        squareInvoiceUrl: String(formData.get("squareInvoiceUrl") ?? "").trim() || null,
      });
    } else if (next === "paid") {
      record = recordSponsorshipPayment(record, {
        amountPaid: Number(formData.get("amountPaid") ?? 0),
        paidAt: new Date(),
      });
    } else if (next === "assets_needed") {
      record = requestSponsorAssets(record);
    } else if (next === "assets_received") {
      record = recordSponsorAssetsReceived(record, record.assets);
    } else if (next === "active") {
      const override = String(formData.get("activationOverride") ?? "") === "yes";
      record = activateSponsor(record, {
        override,
        overrideReason: String(formData.get("overrideReason") ?? "").trim() || undefined,
      });
    } else {
      record = applySponsorshipStatus(record, next, "organizer");
    }
    await persistSponsorshipRecord(supabase, String(detail.sponsorship.id), previous, record, organizer.userId);
    await syncPublicSponsorListing(supabase, String(detail.sponsorship.id), record);
    await recordOrganizerAudit({
      action: `sponsor_status_${record.status}`,
      entityType: "sponsorship",
      entityReference: reference,
      actor: organizer,
    });
    revalidatePath(`/admin/sponsors/${reference}`);
    revalidatePath("/admin/sponsors");
    revalidatePath("/admin");
    return { status: "success", message: "Sponsorship updated. No email was sent." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not update sponsorship."));
  }
}

export async function addSponsorNoteAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const note = String(formData.get("note") ?? "").trim();
    if (!note) return fail("Enter a note.");
    const detail = await getSponsorshipByReference(supabase, reference);
    if (!detail) return fail("Sponsorship not found.");
    await addSponsorNote(supabase, String(detail.sponsorship.id), note, organizer.userId);
    revalidatePath(`/admin/sponsors/${reference}`);
    return { status: "success", message: "Internal note saved. It is not included in emails." };
  } catch {
    return fail("Could not save note.");
  }
}

export async function updateFulfillmentAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const itemId = String(formData.get("itemId") ?? "") as SponsorFulfillmentItemId;
    const status = String(formData.get("status") ?? "") as SponsorFulfillmentStatus;
    const detail = await getSponsorshipByReference(supabase, reference);
    if (!detail) return fail("Sponsorship not found.");
    const previous = String(detail.sponsorship.status) as SponsorshipStatus;
    const record = sponsorshipToRecord(detail);
    const next = {
      ...record,
      fulfillment: setFulfillmentStatus(record.fulfillment, itemId, status),
    };
    await persistSponsorshipRecord(supabase, String(detail.sponsorship.id), previous, next, organizer.userId);
    revalidatePath(`/admin/sponsors/${reference}`);
    return { status: "success", message: "Fulfillment updated." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not update fulfillment."));
  }
}

export async function setSponsorDirectoryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const publish = String(formData.get("publish")) === "yes";
    const detail = await getSponsorshipByReference(supabase, reference);
    if (!detail) return fail("Sponsorship not found.");
    const previous = String(detail.sponsorship.status) as SponsorshipStatus;
    const record = sponsorshipToRecord(detail);
    const next = {
      ...record,
      publicDirectoryEnabled: publish,
      directory: {
        ...record.directory,
        publishInDirectory: publish,
        displayName: String(formData.get("displayName") ?? record.directory.displayName).trim() || record.directory.displayName,
        website: String(formData.get("website") ?? record.directory.website ?? "").trim() || null,
        publicDescription: String(formData.get("publicDescription") ?? record.directory.publicDescription ?? "").trim() || null,
        publicSocialUrl: String(formData.get("publicSocialUrl") ?? record.directory.publicSocialUrl ?? "").trim() || null,
        sponsoredArea: String(formData.get("sponsoredArea") ?? record.directory.sponsoredArea ?? "").trim() || null,
      },
    };
    await persistSponsorshipRecord(supabase, String(detail.sponsorship.id), previous, next, organizer.userId);
    await syncPublicSponsorListing(supabase, String(detail.sponsorship.id), next);
    await recordOrganizerAudit({
      action: publish ? "sponsor_directory_published" : "sponsor_directory_unpublished",
      entityType: "sponsorship",
      entityReference: reference,
      actor: organizer,
    });
    revalidatePath(`/admin/sponsors/${reference}`);
    return { status: "success", message: publish ? "Sponsor may appear in the public directory after activation." : "Sponsor removed from the public directory." };
  } catch (error) {
    return fail(organizerActionError(error, "Could not update directory settings."));
  }
}

export async function uploadSponsorLogoAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const variant = String(formData.get("variant") ?? "primary");
    const file = formData.get("logo");
    if (!(file instanceof File) || file.size === 0) return fail("Choose a logo file.");
    const { storageKey } = await uploadSponsorLogo({ reference, variant, file });
    const detail = await getSponsorshipByReference(supabase, reference);
    if (!detail) return fail("Sponsorship not found.");
    const previous = String(detail.sponsorship.status) as SponsorshipStatus;
    const record = sponsorshipToRecord(detail);
    const logos = [
      ...record.assets.logos.filter((item) => item.variant !== variant),
      {
        variant: variant as "primary" | "light" | "dark" | "monochrome",
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey,
      },
    ];
    const next = {
      ...record,
      assets: { ...record.assets, logos },
    };
    await persistSponsorshipRecord(supabase, String(detail.sponsorship.id), previous, next, organizer.userId);
    await syncPublicSponsorListing(supabase, String(detail.sponsorship.id), next);
    await recordOrganizerAudit({
      action: "sponsor_logo_uploaded",
      entityType: "sponsorship",
      entityReference: reference,
      actor: organizer,
    });
    revalidatePath(`/admin/sponsors/${reference}`);
    return { status: "success", message: "Logo uploaded to private storage." };
  } catch (error) {
    const code = error instanceof Error ? error.message : "upload_failed";
    if (code === "invalid_type") return fail("Use PNG, JPG, SVG, or PDF.");
    if (code === "invalid_size") return fail("File must be 8 MB or smaller.");
    return fail("Logo upload failed.");
  }
}

export async function sendSponsorEmailAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    const { organizer, supabase } = await adminClient();
    const reference = String(formData.get("reference") ?? "");
    const kind = String(formData.get("emailKind") ?? "");
    const detail = await getSponsorshipByReference(supabase, reference);
    if (!detail) return fail("Sponsorship not found.");
    const record = sponsorshipToRecord(detail);
    const builders = {
      next_steps: buildSponsorNextStepsEmail,
      commitment_confirmation: buildSponsorCommitmentEmail,
      invoice_sent: buildSponsorInvoiceSentEmail,
      payment_received: buildSponsorPaymentReceivedEmail,
      asset_request: buildSponsorAssetRequestEmail,
      asset_received: buildSponsorAssetReceivedEmail,
    } as const;
    const builder = builders[kind as keyof typeof builders];
    if (!builder) return fail("Choose a valid email action.");
    const result = await sendSponsorLifecycleEmail({
      to: record.contactEmail,
      email: builder(record),
    });
    if (!result.ok) {
      return fail(
        result.code === "not_configured"
          ? "Resend is not configured, so the email was not sent."
          : "The email could not be sent. The sponsorship record was not changed.",
      );
    }
    await recordOrganizerAudit({
      action: `sponsor_email_${kind}`,
      entityType: "sponsorship",
      entityReference: reference,
      actor: organizer,
    });
    return { status: "success", message: "Email sent." };
  } catch {
    return fail(publicErrorMessage("Could not send email."));
  }
}
