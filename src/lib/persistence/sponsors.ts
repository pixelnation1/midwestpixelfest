import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  emptyAssetCollection,
  requiredAssetsArePresent,
} from "@/lib/sponsor-ops/assets";
import { emptyDirectoryProfile } from "@/lib/sponsor-ops/directory";
import { createFulfillmentChecklist } from "@/lib/sponsor-ops/fulfillment";
import type { SponsorReviewFilterId, SponsorshipStatus } from "@/lib/sponsor-ops/status";
import { statusesForReviewFilter } from "@/lib/sponsor-ops/status";
import type {
  SponsorAssetCollection,
  SponsorFulfillmentItem,
  SponsorshipCommitmentSnapshot,
  SponsorshipRecord,
} from "@/lib/sponsor-ops/types";
import { emptyAcknowledgment, emptyInvoiceRecord } from "@/lib/sponsor-ops/workflow";

export type SponsorshipListRow = {
  id: string;
  reference: string;
  business_name: string;
  contact_name: string;
  selected_level: string | null;
  status: SponsorshipStatus;
  amount_committed: number | string | null;
  invoice_status: string;
  inquiry_received_at: string;
  areas_of_interest: string[] | null;
  sponsor_assets: { status: string } | null;
};

export type SponsorshipDetail = {
  sponsorship: Record<string, unknown>;
  commitment: Record<string, unknown> | null;
  assets: Record<string, unknown> | null;
  fulfillment: Array<{ item_id: string; label: string; status: string }>;
  history: Array<{
    id: string;
    from_status: string | null;
    to_status: string;
    note: string | null;
    created_at: string;
  }>;
  notes: Array<{ id: string; note: string; created_at: string; created_by: string | null }>;
};

export async function listSponsorships(
  supabase: SupabaseClient,
  input: { filter: SponsorReviewFilterId | "inquiry"; q?: string },
): Promise<SponsorshipListRow[]> {
  let query = supabase
    .from("sponsorships")
    .select(
      "id, reference, business_name, contact_name, selected_level, status, amount_committed, invoice_status, inquiry_received_at, areas_of_interest, sponsor_assets(status)",
    )
    .order("inquiry_received_at", { ascending: false });

  if (input.filter === "inquiry") {
    query = query.in("status", ["inquiry_received", "contacted", "negotiating"]);
  } else {
    const statuses = statusesForReviewFilter(input.filter);
    if (statuses) query = query.in("status", [...statuses]);
  }

  const term = (input.q ?? "").replaceAll(",", " ").trim();
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `business_name.ilike.${like},contact_name.ilike.${like},reference.ilike.${like},contact_email.ilike.${like}`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error("unavailable");
  return (data ?? []).map((row) => ({
    ...row,
    sponsor_assets: Array.isArray(row.sponsor_assets)
      ? row.sponsor_assets[0] ?? null
      : row.sponsor_assets,
  })) as SponsorshipListRow[];
}

export async function getSponsorshipByReference(
  supabase: SupabaseClient,
  reference: string,
): Promise<SponsorshipDetail | null> {
  const { data: sponsorship, error } = await supabase
    .from("sponsorships")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error("unavailable");
  if (!sponsorship) return null;

  const [{ data: commitment }, { data: assets }, { data: fulfillment }, { data: history }, { data: notes }] =
    await Promise.all([
      supabase.from("sponsorship_commitments").select("*").eq("sponsorship_id", sponsorship.id).maybeSingle(),
      supabase.from("sponsor_assets").select("*").eq("sponsorship_id", sponsorship.id).maybeSingle(),
      supabase.from("sponsor_fulfillment").select("item_id, label, status").eq("sponsorship_id", sponsorship.id),
      supabase
        .from("sponsor_status_history")
        .select("id, from_status, to_status, note, created_at")
        .eq("sponsorship_id", sponsorship.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("sponsor_internal_notes")
        .select("id, note, created_at, created_by")
        .eq("sponsorship_id", sponsorship.id)
        .order("created_at", { ascending: false }),
    ]);

  return {
    sponsorship,
    commitment: commitment ?? null,
    assets: assets ?? null,
    fulfillment: fulfillment ?? [],
    history: history ?? [],
    notes: notes ?? [],
  };
}

export function sponsorshipToRecord(detail: SponsorshipDetail): SponsorshipRecord {
  const s = detail.sponsorship;
  const snapshot = (detail.commitment?.snapshot as SponsorshipCommitmentSnapshot | undefined) ?? null;
  const assetsRow = detail.assets;
  const assets: SponsorAssetCollection = assetsRow
    ? {
        ...emptyAssetCollection(),
        status: (assetsRow.status as SponsorAssetCollection["status"]) ?? "not_requested",
        requestedAt: (assetsRow.requested_at as string | null) ?? null,
        receivedAt: (assetsRow.received_at as string | null) ?? null,
        approvedAt: (assetsRow.approved_at as string | null) ?? null,
        publicBusinessName: (assetsRow.public_business_name as string | null) ?? null,
        website: (assetsRow.website as string | null) ?? null,
        primarySocialUrl: (assetsRow.primary_social_url as string | null) ?? null,
        additionalSocialUrl: (assetsRow.additional_social_url as string | null) ?? null,
        publicDescription: (assetsRow.public_description as string | null) ?? null,
        marketingContactName: (assetsRow.marketing_contact_name as string | null) ?? null,
        marketingContactEmail: (assetsRow.marketing_contact_email as string | null) ?? null,
        marketingContactPhone: (assetsRow.marketing_contact_phone as string | null) ?? null,
        preferredPublicUrl: (assetsRow.preferred_public_url as string | null) ?? null,
        brandGuidelinesUrl: (assetsRow.brand_guidelines_url as string | null) ?? null,
        logos: Array.isArray(assetsRow.logos) ? assetsRow.logos : [],
        organizerEditedDescription: (assetsRow.organizer_edited_description as string | null) ?? null,
      }
    : emptyAssetCollection();

  const fulfillment: readonly SponsorFulfillmentItem[] =
    detail.fulfillment.length > 0
      ? detail.fulfillment.map((item) => ({
          id: item.item_id as SponsorFulfillmentItem["id"],
          label: item.label,
          status: item.status as SponsorFulfillmentItem["status"],
        }))
      : snapshot
        ? createFulfillmentChecklist(snapshot)
        : [];

  return {
    reference: String(s.reference),
    status: s.status as SponsorshipStatus,
    businessName: String(s.business_name),
    contactName: String(s.contact_name),
    contactEmail: String(s.contact_email),
    contactPhone: (s.contact_phone as string | null) ?? null,
    businessAddress: (s.business_address as string | null) ?? null,
    website: (s.website as string | null) ?? null,
    socialUrls: Array.isArray(s.social_urls) ? (s.social_urls as string[]) : [],
    selectedLevel: (s.selected_level as string | null) ?? null,
    customAmountProposed: (s.custom_amount_proposed as string | null) ?? null,
    areasOfInterest: Array.isArray(s.areas_of_interest) ? (s.areas_of_interest as string[]) : [],
    inquiryReceivedAt: String(s.inquiry_received_at),
    contactedAt: (s.contacted_at as string | null) ?? null,
    committedAt: (s.committed_at as string | null) ?? null,
    invoiceCreatedAt: (s.invoice_created_at as string | null) ?? null,
    invoiceSentAt: (s.invoice_sent_at as string | null) ?? null,
    paymentDueAt: (s.payment_due_at as string | null) ?? null,
    paidAt: (s.paid_at as string | null) ?? null,
    amountCommitted: s.amount_committed != null ? Number(s.amount_committed) : null,
    amountInvoiced: s.amount_invoiced != null ? Number(s.amount_invoiced) : null,
    amountPaid: s.amount_paid != null ? Number(s.amount_paid) : null,
    assetsNeeded: Boolean(s.assets_needed),
    assetsReceivedAt: (s.assets_received_at as string | null) ?? null,
    activatedAt: (s.activated_at as string | null) ?? null,
    activationOverride: Boolean(s.activation_override),
    activationOverrideReason: (s.activation_override_reason as string | null) ?? null,
    commitment: snapshot,
    invoice: {
      ...emptyInvoiceRecord(),
      status: (s.invoice_status as SponsorshipRecord["invoice"]["status"]) ?? "not_created",
      squareInvoiceId: (s.square_invoice_id as string | null) ?? null,
      squareInvoiceUrl: (s.square_invoice_url as string | null) ?? null,
      createdAt: (s.invoice_created_at as string | null) ?? null,
      sentAt: (s.invoice_sent_at as string | null) ?? null,
      dueOn: (s.payment_due_at as string | null) ?? null,
      amountInvoiced: s.amount_invoiced != null ? Number(s.amount_invoiced) : null,
      paidAt: (s.paid_at as string | null) ?? null,
      amountPaid: s.amount_paid != null ? Number(s.amount_paid) : null,
    },
    assets,
    fulfillment,
    acknowledgment: {
      ...emptyAcknowledgment(),
      ...(typeof s.acknowledgment === "object" && s.acknowledgment ? s.acknowledgment : {}),
    },
    directory:
      (s.directory as SponsorshipRecord["directory"]) ?? emptyDirectoryProfile(String(s.business_name)),
    publicDirectoryEnabled: Boolean(s.public_directory_enabled),
    history: detail.history.map((entry) => ({
      status: entry.to_status as SponsorshipStatus,
      timestamp: entry.created_at,
      note: entry.note ?? undefined,
      actor: "organizer" as const,
    })),
  };
}

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}

export async function persistSponsorshipRecord(
  supabase: SupabaseClient,
  sponsorshipId: string,
  previousStatus: SponsorshipStatus,
  record: SponsorshipRecord,
  actorUserId: string,
): Promise<void> {
  const { error, count } = await supabase
    .from("sponsorships")
    .update(
      {
        status: record.status,
        contacted_at: record.contactedAt,
        committed_at: record.committedAt,
        invoice_created_at: record.invoiceCreatedAt,
        invoice_sent_at: record.invoiceSentAt,
        payment_due_at: record.paymentDueAt,
        paid_at: record.paidAt,
        amount_committed: record.amountCommitted,
        amount_invoiced: record.amountInvoiced,
        amount_paid: record.amountPaid,
        invoice_status: record.invoice.status,
        square_invoice_id: record.invoice.squareInvoiceId,
        square_invoice_url: record.invoice.squareInvoiceUrl,
        assets_needed: record.assetsNeeded,
        assets_received_at: record.assetsReceivedAt,
        activated_at: record.activatedAt,
        activation_override: record.activationOverride,
        activation_override_reason: record.activationOverrideReason,
        public_directory_enabled: record.publicDirectoryEnabled,
        acknowledgment: record.acknowledgment,
        directory: record.directory,
        selected_level: record.selectedLevel,
      },
      { count: "exact" },
    )
    .eq("id", sponsorshipId)
    .eq("status", previousStatus);
  if (error) throw new Error("unavailable");

  const { data: saved, error: verifyError } = await supabase
    .from("sponsorships")
    .select("status")
    .eq("id", sponsorshipId)
    .maybeSingle();
  if (verifyError) throw new Error("unavailable");
  if (!saved || saved.status !== record.status) {
    throw new Error("This sponsorship was updated by another action. Refresh and try again.");
  }

  if (record.commitment) {
    const { data: existingCommitment, error: existingError } = await supabase
      .from("sponsorship_commitments")
      .select("id")
      .eq("sponsorship_id", sponsorshipId)
      .maybeSingle();
    if (existingError) throw new Error("unavailable");
    if (!existingCommitment) {
      const snap = record.commitment;
      const { error: commitError } = await supabase.from("sponsorship_commitments").insert({
        sponsorship_id: sponsorshipId,
        package_id: snap.packageId,
        package_name: snap.packageName,
        agreed_amount: snap.agreedAmount,
        amount_label: snap.amountLabel,
        included_benefits: snap.includedBenefits,
        custom_benefits: snap.customBenefits,
        excluded_benefits: snap.excludedOrNotApprovedBenefits,
        areas_sponsored: snap.areasSponsored,
        exclusivity: snap.exclusivity,
        committed_at: snap.committedAt,
        payment_due_at: snap.paymentDueAt,
        agreement_version: snap.agreementVersion,
        contracting_entity_status: snap.contractingEntityStatus,
        snapshot: snap,
      });
      if (commitError && !isUniqueViolation(commitError)) throw new Error("unavailable");
    }
  }

  const { error: assetError } = await supabase.from("sponsor_assets").upsert(
    {
      sponsorship_id: sponsorshipId,
      status: record.assets.status,
      requested_at: record.assets.requestedAt,
      received_at: record.assets.receivedAt,
      approved_at: record.assets.approvedAt,
      public_business_name: record.assets.publicBusinessName,
      website: record.assets.website,
      primary_social_url: record.assets.primarySocialUrl,
      additional_social_url: record.assets.additionalSocialUrl,
      public_description: record.assets.publicDescription,
      organizer_edited_description: record.assets.organizerEditedDescription,
      marketing_contact_name: record.assets.marketingContactName,
      marketing_contact_email: record.assets.marketingContactEmail,
      marketing_contact_phone: record.assets.marketingContactPhone,
      preferred_public_url: record.assets.preferredPublicUrl,
      brand_guidelines_url: record.assets.brandGuidelinesUrl,
      logos: record.assets.logos,
    },
    { onConflict: "sponsorship_id" },
  );
  if (assetError) throw new Error("unavailable");

  const { error: deleteFulfillmentError } = await supabase
    .from("sponsor_fulfillment")
    .delete()
    .eq("sponsorship_id", sponsorshipId);
  if (deleteFulfillmentError) throw new Error("unavailable");
  if (record.fulfillment.length > 0) {
    const { error: fulfillmentError } = await supabase.from("sponsor_fulfillment").insert(
      record.fulfillment.map((item) => ({
        sponsorship_id: sponsorshipId,
        item_id: item.id,
        label: item.label,
        status: item.status,
      })),
    );
    if (fulfillmentError) throw new Error("unavailable");
  }

  if (previousStatus !== record.status && count !== 0) {
    const { error: historyError } = await supabase.from("sponsor_status_history").insert({
      sponsorship_id: sponsorshipId,
      from_status: previousStatus,
      to_status: record.status,
      changed_by: actorUserId,
    });
    if (historyError) throw new Error("unavailable");
  }
}

export async function addSponsorNote(
  supabase: SupabaseClient,
  sponsorshipId: string,
  note: string,
  actorUserId: string,
): Promise<void> {
  const { error } = await supabase.from("sponsor_internal_notes").insert({
    sponsorship_id: sponsorshipId,
    note,
    created_by: actorUserId,
  });
  if (error) throw new Error("unavailable");
}

export async function countSponsorStatuses(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("sponsorships").select("status");
  if (error) throw new Error("unavailable");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export function meetsPaidAssetActivation(record: SponsorshipRecord): boolean {
  return (
    Boolean(record.paidAt) &&
    requiredAssetsArePresent(record.assets) &&
    (record.assets.status === "received" || record.assets.status === "approved")
  );
}
