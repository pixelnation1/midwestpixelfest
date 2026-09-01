/**
 * Central vendor application workflow statuses and public labels.
 * Use these constants instead of raw status strings in UI or emails.
 */

export const VENDOR_APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "invoice_sent",
  "payment_overdue",
  "confirmed",
  "waitlisted",
  "declined",
  "withdrawn",
  "cancelled",
] as const;

export type VendorApplicationStatus =
  (typeof VENDOR_APPLICATION_STATUSES)[number];

export const VENDOR_APPLICATION_STATUS_LABELS: Record<
  VendorApplicationStatus,
  string
> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  invoice_sent: "Invoice Sent",
  payment_overdue: "Payment Overdue",
  confirmed: "Confirmed",
  waitlisted: "Waitlisted",
  declined: "Declined",
  withdrawn: "Withdrawn",
  cancelled: "Cancelled",
};

/** Applied = submitted for review. Not an offer. */
export function isAppliedStatus(status: VendorApplicationStatus): boolean {
  return status === "submitted" || status === "under_review";
}

/** Approved = a space was offered. Not confirmed until payment. */
export function isApprovedUnpaidStatus(status: VendorApplicationStatus): boolean {
  return (
    status === "approved" ||
    status === "invoice_sent" ||
    status === "payment_overdue"
  );
}

export function isConfirmedStatus(status: VendorApplicationStatus): boolean {
  return status === "confirmed";
}

export const VENDOR_INVOICE_STATUSES = [
  "not_created",
  "created",
  "sent",
  "paid",
  "overdue",
  "cancelled",
] as const;

export type VendorInvoiceStatus = (typeof VENDOR_INVOICE_STATUSES)[number];

export const VENDOR_INVOICE_STATUS_LABELS: Record<VendorInvoiceStatus, string> = {
  not_created: "Not created",
  created: "Created",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const VENDOR_PAYMENT_STATUSES = [
  "not_required",
  "not_due",
  "due",
  "overdue",
  "received",
  "refunded",
] as const;

export type VendorPaymentStatus = (typeof VENDOR_PAYMENT_STATUSES)[number];

export const VENDOR_PAYMENT_STATUS_LABELS: Record<VendorPaymentStatus, string> = {
  not_required: "Not required",
  not_due: "Not due",
  due: "Due",
  overdue: "Overdue",
  received: "Received",
  refunded: "Refunded",
};

export const VENDOR_PRICING_TIERS = ["founding", "regular", "custom"] as const;

export type VendorPricingTier = (typeof VENDOR_PRICING_TIERS)[number];

export const VENDOR_PRICING_TIER_LABELS: Record<VendorPricingTier, string> = {
  founding: "Founding Vendor Rate",
  regular: "Regular",
  custom: "Custom",
};

export const VENDOR_REVIEW_FILTERS = [
  { id: "all", label: "All", statuses: null },
  { id: "new", label: "New", statuses: ["submitted"] },
  { id: "under_review", label: "Under Review", statuses: ["under_review"] },
  { id: "approved", label: "Approved", statuses: ["approved"] },
  { id: "awaiting_payment", label: "Awaiting Payment", statuses: ["approved", "invoice_sent"] },
  { id: "confirmed", label: "Confirmed", statuses: ["confirmed"] },
  { id: "waitlisted", label: "Waitlisted", statuses: ["waitlisted"] },
  { id: "declined", label: "Declined", statuses: ["declined"] },
  { id: "overdue", label: "Overdue", statuses: ["payment_overdue"] },
  { id: "withdrawn", label: "Withdrawn", statuses: ["withdrawn"] },
  { id: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  statuses: readonly VendorApplicationStatus[] | null;
}>;

export type VendorReviewFilterId = (typeof VENDOR_REVIEW_FILTERS)[number]["id"];

export function statusesForReviewFilter(
  filterId: VendorReviewFilterId,
): readonly VendorApplicationStatus[] | null {
  const filter = VENDOR_REVIEW_FILTERS.find((item) => item.id === filterId);
  return filter?.statuses ?? null;
}

export function matchesReviewFilter(
  status: VendorApplicationStatus,
  filterId: VendorReviewFilterId,
): boolean {
  const statuses = statusesForReviewFilter(filterId);
  if (statuses == null) return true;
  return statuses.includes(status);
}
