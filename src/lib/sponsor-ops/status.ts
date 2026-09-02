/**
 * Central sponsorship workflow statuses and public labels.
 * Use these constants instead of raw status strings in UI or emails.
 */

export const SPONSORSHIP_STATUSES = [
  "inquiry_received",
  "contacted",
  "negotiating",
  "committed",
  "invoice_created",
  "invoice_sent",
  "paid",
  "assets_needed",
  "assets_received",
  "active",
  "completed",
  "declined",
  "withdrawn",
  "cancelled",
] as const;

export type SponsorshipStatus = (typeof SPONSORSHIP_STATUSES)[number];

export const SPONSORSHIP_STATUS_LABELS: Record<SponsorshipStatus, string> = {
  inquiry_received: "Inquiry Received",
  contacted: "Contacted",
  negotiating: "Negotiating",
  committed: "Committed",
  invoice_created: "Invoice Created",
  invoice_sent: "Invoice Sent",
  paid: "Paid",
  assets_needed: "Assets Needed",
  assets_received: "Assets Received",
  active: "Active",
  completed: "Completed",
  declined: "Declined",
  withdrawn: "Withdrawn",
  cancelled: "Cancelled",
};

export const SPONSOR_INVOICE_STATUSES = [
  "not_created",
  "created",
  "sent",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;

export type SponsorInvoiceStatus = (typeof SPONSOR_INVOICE_STATUSES)[number];

export const SPONSOR_INVOICE_STATUS_LABELS: Record<SponsorInvoiceStatus, string> = {
  not_created: "Not created",
  created: "Created",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

export const SPONSOR_ASSET_STATUSES = [
  "not_requested",
  "requested",
  "partial",
  "received",
  "approved",
] as const;

export type SponsorAssetStatus = (typeof SPONSOR_ASSET_STATUSES)[number];

export const SPONSOR_ASSET_STATUS_LABELS: Record<SponsorAssetStatus, string> = {
  not_requested: "Not requested",
  requested: "Requested",
  partial: "Partial",
  received: "Received",
  approved: "Approved",
};

export const SPONSOR_FULFILLMENT_STATUSES = [
  "not_started",
  "planned",
  "completed",
  "not_applicable",
] as const;

export type SponsorFulfillmentStatus = (typeof SPONSOR_FULFILLMENT_STATUSES)[number];

export const SPONSOR_FULFILLMENT_STATUS_LABELS: Record<
  SponsorFulfillmentStatus,
  string
> = {
  not_started: "Not started",
  planned: "Planned",
  completed: "Completed",
  not_applicable: "Not applicable",
};

export const SPONSOR_REVIEW_FILTERS = [
  { id: "all", label: "All", statuses: null },
  { id: "new", label: "New", statuses: ["inquiry_received"] },
  { id: "contacted", label: "Contacted", statuses: ["contacted"] },
  { id: "negotiating", label: "Negotiating", statuses: ["negotiating"] },
  { id: "committed", label: "Committed", statuses: ["committed"] },
  { id: "awaiting_payment", label: "Awaiting Payment", statuses: ["invoice_created", "invoice_sent"] },
  { id: "paid", label: "Paid", statuses: ["paid", "assets_needed", "assets_received"] },
  { id: "active", label: "Active", statuses: ["active"] },
  { id: "completed", label: "Completed", statuses: ["completed"] },
  { id: "declined", label: "Declined", statuses: ["declined"] },
  { id: "withdrawn", label: "Withdrawn", statuses: ["withdrawn"] },
  { id: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  statuses: readonly SponsorshipStatus[] | null;
}>;

export type SponsorReviewFilterId = (typeof SPONSOR_REVIEW_FILTERS)[number]["id"];

export function isInquiryOnlyStatus(status: SponsorshipStatus): boolean {
  return (
    status === "inquiry_received" ||
    status === "contacted" ||
    status === "negotiating"
  );
}

export function isCommittedUnpaidStatus(status: SponsorshipStatus): boolean {
  return (
    status === "committed" ||
    status === "invoice_created" ||
    status === "invoice_sent"
  );
}

export function isPaidStatus(status: SponsorshipStatus): boolean {
  return (
    status === "paid" ||
    status === "assets_needed" ||
    status === "assets_received" ||
    status === "active" ||
    status === "completed"
  );
}

export function isActiveStatus(status: SponsorshipStatus): boolean {
  return status === "active";
}

export function statusesForReviewFilter(
  filterId: SponsorReviewFilterId,
): readonly SponsorshipStatus[] | null {
  const filter = SPONSOR_REVIEW_FILTERS.find((item) => item.id === filterId);
  return filter?.statuses ?? null;
}

export function matchesReviewFilter(
  status: SponsorshipStatus,
  filterId: SponsorReviewFilterId,
): boolean {
  const statuses = statusesForReviewFilter(filterId);
  if (statuses == null) return true;
  return statuses.includes(status);
}
