import "server-only";

import { randomBytes } from "node:crypto";
import { createApplicationReference } from "@/lib/forms/vendor-application";
import { createSponsorReference } from "@/lib/sponsor-ops/reference";
import { createInquiryRecord } from "@/lib/sponsor-ops/workflow";
import { emptyDirectoryProfile } from "@/lib/vendor-ops/directory";
import { operationalSourcePath } from "@/lib/forms/notification-copy";
import type { DeliveryPayload } from "@/lib/forms/types";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { isSupabasePersistenceConfigured } from "@/lib/supabase/env";
import {
  fieldList,
  fieldString,
  fieldYes,
  isPersistedFormKind,
  parseIdempotencyKey,
} from "@/lib/persistence/fields";

export type PersistResult =
  | { ok: true; created: boolean; reference?: string }
  | { ok: false; code: "not_configured" | "persist_failed" };

export { isPersistedFormKind };

export function persistenceRequired(): boolean {
  return isSupabasePersistenceConfigured();
}

function interestReference(): string {
  return `MPF-VI-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function asObject(fields: DeliveryPayload["fields"]): Record<string, string | string[]> {
  return { ...fields };
}

export async function persistOperationalSubmission(
  payload: DeliveryPayload,
): Promise<PersistResult> {
  if (!isPersistedFormKind(payload.kind)) {
    return { ok: true, created: false };
  }
  if (!isSupabasePersistenceConfigured()) {
    return { ok: false, code: "not_configured" };
  }

  try {
    if (payload.kind === "vendor_interest") {
      return persistVendorInterest(payload);
    }
    if (payload.kind === "vendor_application") {
      return persistVendorApplication(payload);
    }
    if (payload.kind === "sponsor_inquiry") {
      return persistSponsorInquiry(payload);
    }
    if (payload.kind === "sponsor_commitment") {
      return persistSponsorCommitment(payload);
    }
    return persistSponsorAssets(payload);
  } catch {
    console.error("form_persist_failed", { kind: payload.kind });
    return { ok: false, code: "persist_failed" };
  }
}

async function persistVendorInterest(payload: DeliveryPayload): Promise<PersistResult> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ok: false, code: "not_configured" };
  const fields = payload.fields;
  const idempotencyKey = parseIdempotencyKey(fieldString(fields, "submissionId"));
  const reference =
    fieldString(fields, "interestReference") || interestReference();
  fields.interestReference = reference;

  const row = {
    reference,
    idempotency_key: idempotencyKey,
    contact_name: fieldString(fields, "contactName"),
    business_name: fieldString(fields, "businessName"),
    email: fieldString(fields, "email"),
    phone: fieldString(fields, "phone") || null,
    website: fieldString(fields, "website") || null,
    social_media: fieldString(fields, "socialMedia") || null,
    applicant_type: fieldString(fields, "vendorType"),
    primary_category: fieldString(fields, "vendorCategory"),
    description: fieldString(fields, "whatYouSell"),
    city: fieldString(fields, "city") || null,
    state: fieldString(fields, "state") || null,
    notify_when_open: fieldYes(fields, "notifyApplications"),
    source_page: operationalSourcePath("vendor_interest"),
    status: "new",
  };

  const { data, error } = await supabase
    .from("vendor_interests")
    .upsert(row, { onConflict: idempotencyKey ? "idempotency_key" : "reference", ignoreDuplicates: true })
    .select("reference")
    .maybeSingle();

  if (error) {
    console.error("form_persist_failed", { kind: "vendor_interest" });
    return { ok: false, code: "persist_failed" };
  }

  return { ok: true, created: Boolean(data), reference };
}

async function persistVendorApplication(payload: DeliveryPayload): Promise<PersistResult> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ok: false, code: "not_configured" };
  const fields = payload.fields;
  const idempotencyKey = parseIdempotencyKey(fieldString(fields, "submissionId"));
  const reference = fieldString(fields, "applicationReference") || createApplicationReference();
  fields.applicationReference = reference;
  fields.applicationStatus = "submitted";

  const row = {
    reference,
    idempotency_key: idempotencyKey,
    application_type: fieldString(fields, "applicationType"),
    contact_name: fieldString(fields, "contactName"),
    business_name: fieldString(fields, "businessName"),
    email: fieldString(fields, "email"),
    phone: fieldString(fields, "phone"),
    website: fieldString(fields, "website") || null,
    social_primary: fieldString(fields, "socialPrimary") || null,
    social_additional: fieldString(fields, "socialAdditional") || null,
    street: fieldString(fields, "street") || null,
    city: fieldString(fields, "city") || null,
    state: fieldString(fields, "state") || null,
    zip: fieldString(fields, "zip") || null,
    country: fieldString(fields, "country") || null,
    primary_category: fieldString(fields, "primaryCategory"),
    requested_space: fieldString(fields, "spaceRequest"),
    extra_badges: Number(fieldString(fields, "extraBadges") || 0),
    extra_tables: Number(fieldString(fields, "extraTables") || 0),
    electricity_requested: fieldString(fields, "electricityRequested") === "Yes",
    status: "submitted",
    vendor_agreement_version: fieldString(fields, "agreementVersion") || "2027-v1",
    source_page: operationalSourcePath("vendor_application"),
    merchandise: {
      whatYouSell: fieldString(fields, "whatYouSell"),
      secondaryCategories: fieldList(fields, "secondaryCategories"),
      mixOriginal: fieldString(fields, "mixOriginal"),
      mixLicensed: fieldString(fields, "mixLicensed"),
      mixSecondhand: fieldString(fields, "mixSecondhand"),
      mixOther: fieldString(fields, "mixOther"),
      ownWorkMajority: fieldString(fields, "ownWorkMajority"),
      ownWorkPercent: fieldString(fields, "ownWorkPercent"),
      offersCommissions: fieldString(fields, "offersCommissions"),
      productionMethod: fieldString(fields, "productionMethod"),
      inventoryTypes: fieldList(fields, "inventoryTypes"),
      mysteryMerchandise: fieldString(fields, "mysteryMerchandise"),
      mysteryDescription: fieldString(fields, "mysteryDescription"),
      businessDescription: fieldString(fields, "businessDescription"),
      yearsActive: fieldString(fields, "yearsActive"),
      vendedBefore: fieldString(fields, "vendedBefore"),
      priorEvents: fieldString(fields, "priorEvents"),
    },
    display_setup: {
      tallDisplays: fieldString(fields, "tallDisplays"),
      tallDisplayDescription: fieldString(fields, "tallDisplayDescription"),
      displayElements: fieldList(fields, "displayElements"),
      boothSetupNotes: fieldString(fields, "boothSetupNotes"),
      additionalSpace: fieldString(fields, "additionalSpace"),
      additionalSpaceDetails: fieldString(fields, "additionalSpaceDetails"),
      electricityRequested: fieldString(fields, "electricityRequested"),
    },
    compliance: {
      merchandisePolicy: fieldYes(fields, "merchandisePolicy"),
      aiGenerated: fieldString(fields, "aiGenerated"),
      aiDescription: fieldString(fields, "aiDescription"),
      sellsFood: fieldString(fields, "sellsFood"),
      taxAcknowledgment: fieldYes(fields, "taxAcknowledgment"),
      insuranceStatus: fieldString(fields, "insuranceStatus"),
      hoursCommitment: fieldString(fields, "hoursCommitment"),
      hoursExplanation: fieldString(fields, "hoursExplanation"),
    },
    staff: {
      primaryRepName: fieldString(fields, "primaryRepName"),
      additionalRepNames: fieldString(fields, "additionalRepNames"),
    },
    booth_sharing: {
      boothSharing: fieldString(fields, "boothSharing"),
      shareBusinessName: fieldString(fields, "shareBusinessName"),
      shareContactName: fieldString(fields, "shareContactName"),
      shareEmail: fieldString(fields, "shareEmail"),
      shareDescription: fieldString(fields, "shareDescription"),
    },
    acknowledgments: {
      cancellationAck: fieldYes(fields, "cancellationAck"),
      noPaymentAck: fieldYes(fields, "noPaymentAck"),
      paymentIfApprovedAck: fieldYes(fields, "paymentIfApprovedAck"),
      ackAccurate: fieldYes(fields, "ackAccurate"),
      ackNoGuarantee: fieldYes(fields, "ackNoGuarantee"),
      ackSpaceAssignment: fieldYes(fields, "ackSpaceAssignment"),
      ackEventRules: fieldYes(fields, "ackEventRules"),
      ackProhibitedRemoval: fieldYes(fields, "ackProhibitedRemoval"),
    },
    signature: {
      signature: fieldString(fields, "signature"),
      signatureDate: fieldString(fields, "signatureDate"),
      signatureBusinessName: fieldString(fields, "signatureBusinessName"),
    },
    directory: emptyDirectoryProfile(fieldString(fields, "businessName")),
    raw_fields: asObject(fields),
    submitted_at: payload.submittedAt,
  };

  const { data, error } = await supabase
    .from("vendor_applications")
    .upsert(row, {
      onConflict: idempotencyKey ? "idempotency_key" : "reference",
      ignoreDuplicates: true,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("form_persist_failed", { kind: "vendor_application" });
    return { ok: false, code: "persist_failed" };
  }

  if (data?.id) {
    await supabase.from("vendor_status_history").insert({
      application_id: data.id,
      from_status: null,
      to_status: "submitted",
      note: "Application received from website form.",
      changed_by: null,
    });
  }

  return { ok: true, created: Boolean(data), reference };
}

async function persistSponsorInquiry(payload: DeliveryPayload): Promise<PersistResult> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ok: false, code: "not_configured" };
  const fields = payload.fields;
  const idempotencyKey = parseIdempotencyKey(fieldString(fields, "submissionId"));
  const reference = fieldString(fields, "sponsorReference") || createSponsorReference();
  fields.sponsorReference = reference;
  fields.sponsorshipStatus = "inquiry_received";

  const address = [
    fieldString(fields, "address"),
    fieldString(fields, "city"),
    fieldString(fields, "state"),
    fieldString(fields, "zip"),
  ]
    .filter(Boolean)
    .join(", ");

  const record = createInquiryRecord({
    businessName: fieldString(fields, "company"),
    contactName: fieldString(fields, "contactName"),
    contactEmail: fieldString(fields, "email"),
    contactPhone: fieldString(fields, "phone") || null,
    businessAddress: address || null,
    website: fieldString(fields, "website") || null,
    selectedLevel: fieldString(fields, "partnership") || null,
    customAmountProposed: fieldString(fields, "proposedAmount") || null,
    areasOfInterest: fieldList(fields, "areas"),
    inquiryReceivedAt: payload.submittedAt,
    reference,
  });

  const { data, error } = await supabase.from("sponsorships").upsert(
    {
      reference,
      idempotency_key: idempotencyKey,
      business_name: record.businessName,
      contact_name: record.contactName,
      contact_email: record.contactEmail,
      contact_phone: record.contactPhone,
      contact_title: fieldString(fields, "title") || null,
      business_address: fieldString(fields, "address") || null,
      city: fieldString(fields, "city") || null,
      state: fieldString(fields, "state") || null,
      zip: fieldString(fields, "zip") || null,
      website: record.website,
      social_urls: fieldString(fields, "displayLink") ? [fieldString(fields, "displayLink")] : [],
      selected_level: record.selectedLevel,
      custom_amount_proposed: record.customAmountProposed,
      areas_of_interest: record.areasOfInterest,
      inquiry_comments: fieldString(fields, "notes") || null,
      inquiry_payload: asObject(fields),
      status: "inquiry_received",
      inquiry_received_at: payload.submittedAt,
      directory: record.directory,
      source_page: operationalSourcePath("sponsor_inquiry"),
    },
    {
      onConflict: idempotencyKey ? "idempotency_key" : "reference",
      ignoreDuplicates: true,
    },
  )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("form_persist_failed", { kind: "sponsor_inquiry" });
    return { ok: false, code: "persist_failed" };
  }

  if (data?.id) {
    await supabase.from("sponsor_status_history").insert({
      sponsorship_id: data.id,
      from_status: null,
      to_status: "inquiry_received",
      note: "Inquiry received from website form.",
    });
    await supabase.from("sponsor_assets").upsert(
      { sponsorship_id: data.id, status: "not_requested" },
      { onConflict: "sponsorship_id", ignoreDuplicates: true },
    );
  }

  return { ok: true, created: Boolean(data), reference };
}

async function persistSponsorCommitment(payload: DeliveryPayload): Promise<PersistResult> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ok: false, code: "not_configured" };
  const fields = payload.fields;
  const reference = fieldString(fields, "sponsorReference") || createSponsorReference();
  fields.sponsorReference = reference;

  const { data: existing } = await supabase
    .from("sponsorships")
    .select("id, status")
    .eq("reference", reference)
    .maybeSingle();

  const acknowledgment = {
    acknowledgedAt: payload.submittedAt,
    acknowledgedPaymentTerms: fieldYes(fields, "paymentTermsAck"),
    acknowledgedMarketingAssets: fieldYes(fields, "marketingAssetsAck"),
    acknowledgedAgreement: fieldYes(fields, "agreementAck"),
    representativeName: fieldString(fields, "representativeName"),
    representativeTitle: fieldString(fields, "representativeTitle"),
    signature: fieldString(fields, "electronicSignature"),
    signatureDate: fieldString(fields, "signatureDate"),
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("sponsorships")
      .update({
        acknowledgment,
        inquiry_payload: asObject(fields),
        updated_at: payload.submittedAt,
      })
      .eq("id", existing.id);
    if (error) {
      console.error("form_persist_failed", { kind: "sponsor_commitment" });
      return { ok: false, code: "persist_failed" };
    }
    return { ok: true, created: false, reference };
  }

  const { error } = await supabase.from("sponsorships").insert({
    reference,
    idempotency_key: parseIdempotencyKey(fieldString(fields, "submissionId")),
    business_name: fieldString(fields, "businessName"),
    contact_name: fieldString(fields, "representativeName"),
    contact_email: fieldString(fields, "email"),
    contact_phone: fieldString(fields, "phone") || null,
    contact_title: fieldString(fields, "representativeTitle") || null,
    business_address: fieldString(fields, "businessAddress") || null,
    selected_level: fieldString(fields, "agreedLevel") || null,
    custom_amount_proposed: fieldString(fields, "agreedAmount") || null,
    areas_of_interest: fieldString(fields, "approvedArea") ? [fieldString(fields, "approvedArea")] : [],
    inquiry_payload: asObject(fields),
    status: "inquiry_received",
    acknowledgment,
    source_page: operationalSourcePath("sponsor_commitment"),
  });
  if (error) {
    console.error("form_persist_failed", { kind: "sponsor_commitment" });
    return { ok: false, code: "persist_failed" };
  }
  return { ok: true, created: true, reference };
}

async function persistSponsorAssets(payload: DeliveryPayload): Promise<PersistResult> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ok: false, code: "not_configured" };
  const fields = payload.fields;
  const reference = fieldString(fields, "sponsorReference");
  if (!reference) return { ok: false, code: "persist_failed" };

  const { data: sponsor } = await supabase
    .from("sponsorships")
    .select("id")
    .eq("reference", reference)
    .maybeSingle();
  if (!sponsor?.id) return { ok: false, code: "persist_failed" };

  const { error } = await supabase.from("sponsor_assets").upsert(
    {
      sponsorship_id: sponsor.id,
      public_business_name: fieldString(fields, "publicBusinessName"),
      website: fieldString(fields, "website"),
      primary_social_url: fieldString(fields, "primarySocialUrl") || null,
      additional_social_url: fieldString(fields, "additionalSocialUrl") || null,
      public_description: fieldString(fields, "publicDescription"),
      marketing_contact_name: fieldString(fields, "marketingContact"),
      marketing_contact_email: fieldString(fields, "marketingEmail"),
      marketing_contact_phone: fieldString(fields, "marketingPhone") || null,
      preferred_public_url: fieldString(fields, "preferredPublicUrl"),
      brand_guidelines_url: fieldString(fields, "brandGuidelinesUrl") || null,
      status: "partial",
      received_at: payload.submittedAt,
    },
    { onConflict: "sponsorship_id" },
  );
  if (error) {
    console.error("form_persist_failed", { kind: "sponsor_assets" });
    return { ok: false, code: "persist_failed" };
  }
  return { ok: true, created: false, reference };
}
