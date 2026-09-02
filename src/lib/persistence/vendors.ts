import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { OfficialApplicationType } from "@/lib/vendor-application";
import type { VendorSpaceId } from "@/lib/vendors";
import {
  VENDOR_APPLICATION_STATUS_LABELS,
  type VendorApplicationStatus,
  type VendorInvoiceStatus,
  type VendorReviewFilterId,
  statusesForReviewFilter,
} from "@/lib/vendor-ops/status";
import type {
  VendorApplicationRecord,
  VendorInternalNote,
  VendorOffer,
} from "@/lib/vendor-ops/types";
import { emptyDirectoryProfile } from "@/lib/vendor-ops/directory";
import { emptyInvoiceRecord } from "@/lib/vendor-ops/workflow";

export { VENDOR_APPLICATION_STATUS_LABELS };

export type VendorInterestRow = {
  id: string;
  reference: string;
  contact_name: string;
  business_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  social_media: string | null;
  applicant_type: string;
  primary_category: string;
  description: string;
  city: string | null;
  state: string | null;
  notify_when_open: boolean;
  source_page: string | null;
  status: "new" | "contacted" | "converted" | "closed";
  created_at: string;
};

export type VendorApplicationListRow = {
  id: string;
  reference: string;
  application_type: string;
  contact_name: string;
  business_name: string;
  email: string;
  primary_category: string;
  requested_space: string;
  status: VendorApplicationStatus;
  submitted_at: string;
  vendor_offers: {
    invoice_status: VendorInvoiceStatus;
    offered_space: string;
    total: number | string;
    payment_due_at: string;
  } | null;
};

export type VendorApplicationDetail = {
  application: Record<string, unknown>;
  offer: Record<string, unknown> | null;
  history: Array<{
    id: string;
    from_status: string | null;
    to_status: string;
    note: string | null;
    created_at: string;
  }>;
  notes: VendorInternalNote[];
};

function searchOr<T>(query: T, q: string): T {
  const term = q.replaceAll(/[,().]/g, " ").trim();
  if (!term) return query;
  const like = `%${term}%`;
  return (query as { or: (filters: string) => T }).or(
    `business_name.ilike.${like},contact_name.ilike.${like},reference.ilike.${like},email.ilike.${like}`,
  );
}

export async function listVendorInterests(
  supabase: SupabaseClient,
  q = "",
): Promise<VendorInterestRow[]> {
  let query = supabase
    .from("vendor_interests")
    .select(
      "id, reference, contact_name, business_name, email, phone, website, social_media, applicant_type, primary_category, description, city, state, notify_when_open, source_page, status, created_at",
    )
    .order("created_at", { ascending: false });
  query = searchOr(query, q);
  const { data, error } = await query;
  if (error) throw new Error("unavailable");
  return (data ?? []) as VendorInterestRow[];
}

export async function listVendorApplications(
  supabase: SupabaseClient,
  input: { filter: VendorReviewFilterId; q?: string },
): Promise<VendorApplicationListRow[]> {
  let query = supabase
    .from("vendor_applications")
    .select(
      "id, reference, application_type, contact_name, business_name, email, primary_category, requested_space, status, submitted_at, vendor_offers(invoice_status, offered_space, total, payment_due_at)",
    )
    .order("submitted_at", { ascending: false });

  const statuses = statusesForReviewFilter(input.filter);
  if (statuses) query = query.in("status", [...statuses]);
  query = searchOr(query, input.q ?? "");

  const { data, error } = await query;
  if (error) throw new Error("unavailable");
  return (data ?? []).map((row) => ({
    ...row,
    vendor_offers: Array.isArray(row.vendor_offers)
      ? row.vendor_offers[0] ?? null
      : row.vendor_offers,
  })) as VendorApplicationListRow[];
}

export async function getVendorApplicationByReference(
  supabase: SupabaseClient,
  reference: string,
): Promise<VendorApplicationDetail | null> {
  const { data: application, error } = await supabase
    .from("vendor_applications")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error("unavailable");
  if (!application) return null;

  const [{ data: offer }, { data: history }, { data: notes }] = await Promise.all([
    supabase.from("vendor_offers").select("*").eq("application_id", application.id).maybeSingle(),
    supabase
      .from("vendor_status_history")
      .select("id, from_status, to_status, note, created_at")
      .eq("application_id", application.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("vendor_internal_notes")
      .select("id, note, created_at, created_by")
      .eq("application_id", application.id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    application,
    offer: offer ?? null,
    history: history ?? [],
    notes: (notes ?? []).map((note) => ({
      id: note.id,
      createdAt: note.created_at,
      actor: note.created_by ?? "organizer",
      body: note.note,
    })),
  };
}

export function applicationToRecord(
  application: Record<string, unknown>,
  offer: Record<string, unknown> | null,
  history: VendorApplicationDetail["history"],
): VendorApplicationRecord {
  const snapshot = (offer?.snapshot as VendorOffer["snapshot"] | undefined) ?? null;
  const mappedOffer: VendorOffer | null =
    offer && snapshot
      ? {
          applicationReference: String(application.reference),
          applicationType: application.application_type as OfficialApplicationType,
          businessName: String(application.business_name),
          requestedSpace: String(offer.requested_space) as VendorSpaceId,
          offeredSpace: String(offer.offered_space) as VendorSpaceId,
          decisionDate: String(snapshot.offerIssuedOn ?? offer.offer_issued_at),
          snapshot,
          offerIssuedAt: String(offer.offer_issued_at),
          paymentDueOn: String(offer.original_payment_due_at),
          paymentDeadlineOverride: (offer.deadline_override as VendorOffer["paymentDeadlineOverride"]) ?? null,
          invoice: {
            ...emptyInvoiceRecord(),
            status: (offer.invoice_status as VendorInvoiceStatus) ?? "not_created",
            squareInvoiceId: (offer.square_invoice_id as string | null) ?? null,
            squareInvoiceUrl: (offer.square_invoice_url as string | null) ?? null,
            dueOn: (offer.payment_due_at as string | null) ?? null,
            amountInvoiced: offer.amount_invoiced != null ? Number(offer.amount_invoiced) : null,
            paidAt: (offer.paid_at as string | null) ?? null,
            amountPaid: offer.amount_paid != null ? Number(offer.amount_paid) : null,
          },
          paymentStatus: offer.confirmed_at ? "received" : "due",
          confirmedAt: (offer.confirmed_at as string | null) ?? null,
          vendorAgreementVersion: String(offer.agreement_version ?? "2027-v1"),
          acceptanceAcknowledgment: {
            acknowledgedAt: null,
            acknowledgedSpace: false,
            acknowledgedPrice: false,
            acknowledgedDeadline: false,
            acknowledgedCancellationPolicy: false,
            acknowledgedVendorRules: false,
            acknowledgedEventPolicies: false,
            agreementVersion: String(offer.agreement_version ?? "2027-v1"),
          },
          customPricingInternalNote: (offer.custom_pricing_internal_note as string | null) ?? null,
          spaceReleased: false,
        }
      : null;

  return {
    reference: String(application.reference),
    status: application.status as VendorApplicationStatus,
    submittedAt: String(application.submitted_at),
    applicationType: application.application_type as OfficialApplicationType,
    requestedSpace: String(application.requested_space) as VendorSpaceId,
    primaryCategory: String(application.primary_category),
    extraBadgesRequested: Number(application.extra_badges ?? 0),
    extraTablesRequested: Number(application.extra_tables ?? 0),
    electricityRequested: Boolean(application.electricity_requested),
    offer: mappedOffer,
    waitlistPosition: (application.waitlist_position as number | null) ?? null,
    directory: (application.directory as VendorApplicationRecord["directory"]) ??
      emptyDirectoryProfile(String(application.business_name)),
    history: history.map((entry) => ({
      status: entry.to_status as VendorApplicationStatus,
      timestamp: entry.created_at,
      note: entry.note ?? undefined,
      actor: "organizer",
    })),
    cancellationRequest: null,
    vendorAgreementVersion: String(application.vendor_agreement_version ?? "2027-v1"),
  };
}

export async function persistVendorRecord(
  supabase: SupabaseClient,
  applicationId: string,
  previousStatus: VendorApplicationStatus,
  record: VendorApplicationRecord,
  actorUserId: string,
): Promise<void> {
  const { error: appError } = await supabase
    .from("vendor_applications")
    .update({
      status: record.status,
      waitlist_position: record.waitlistPosition,
      directory: record.directory,
      extra_badges: record.extraBadgesRequested,
      extra_tables: record.extraTablesRequested,
      electricity_requested: record.electricityRequested,
    })
    .eq("id", applicationId);
  if (appError) throw new Error("unavailable");

  if (record.offer) {
    const offer = record.offer;
    const { error: offerError } = await supabase.from("vendor_offers").upsert(
      {
        application_id: applicationId,
        requested_space: offer.requestedSpace,
        offered_space: offer.offeredSpace,
        pricing_tier: offer.snapshot.pricingTier,
        base_price: offer.snapshot.basePrice,
        add_ons: offer.snapshot.addOns,
        total: offer.snapshot.total,
        offer_issued_at: offer.offerIssuedAt,
        original_payment_due_at: offer.paymentDueOn,
        payment_due_at: offer.paymentDeadlineOverride?.newDueOn ?? offer.paymentDueOn,
        deadline_override: offer.paymentDeadlineOverride,
        invoice_status: offer.invoice.status,
        square_invoice_id: offer.invoice.squareInvoiceId,
        square_invoice_url: offer.invoice.squareInvoiceUrl,
        amount_invoiced: offer.invoice.amountInvoiced,
        amount_paid: offer.invoice.amountPaid,
        paid_at: offer.invoice.paidAt,
        confirmed_at: offer.confirmedAt,
        agreement_version: offer.vendorAgreementVersion,
        custom_pricing_internal_note: offer.customPricingInternalNote,
        snapshot: offer.snapshot,
      },
      { onConflict: "application_id" },
    );
    if (offerError) throw new Error("unavailable");
  }

  if (previousStatus !== record.status) {
    await supabase.from("vendor_status_history").insert({
      application_id: applicationId,
      from_status: previousStatus,
      to_status: record.status,
      changed_by: actorUserId,
    });
  }
}

export async function addVendorNote(
  supabase: SupabaseClient,
  applicationId: string,
  note: string,
  actorUserId: string,
): Promise<void> {
  const { error } = await supabase.from("vendor_internal_notes").insert({
    application_id: applicationId,
    note,
    created_by: actorUserId,
  });
  if (error) throw new Error("unavailable");
}

export async function updateVendorInterestStatus(
  supabase: SupabaseClient,
  id: string,
  status: VendorInterestRow["status"],
): Promise<void> {
  const { error } = await supabase.from("vendor_interests").update({ status }).eq("id", id);
  if (error) throw new Error("unavailable");
}

export async function countVendorStatuses(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("vendor_applications").select("status");
  if (error) throw new Error("unavailable");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}

export async function countVendorInterests(supabase: SupabaseClient) {
  const { count, error } = await supabase
    .from("vendor_interests")
    .select("id", { count: "exact", head: true });
  if (error) throw new Error("unavailable");
  return count ?? 0;
}
