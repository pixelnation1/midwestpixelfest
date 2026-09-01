import { vendorAgreementVersion, type VendorSpaceId } from "@/lib/vendors";
import type { OfficialApplicationType } from "@/lib/vendor-application";
import {
  chicagoCalendarDateFromInstant,
  compareCalendarDates,
  isCalendarDate,
} from "@/lib/vendor-ops/dates";
import { createPriceSnapshot } from "@/lib/vendor-ops/pricing";
import {
  VENDOR_APPLICATION_STATUSES,
  type VendorApplicationStatus,
  type VendorInvoiceStatus,
  type VendorPricingTier,
} from "@/lib/vendor-ops/status";
import type {
  StatusHistoryActor,
  StatusHistoryEntry,
  VendorAcceptanceAcknowledgment,
  VendorApplicationRecord,
  VendorInvoiceRecord,
  VendorOffer,
  VendorPaymentDeadlineOverride,
} from "@/lib/vendor-ops/types";

const ALLOWED_TRANSITIONS: Record<
  VendorApplicationStatus,
  readonly VendorApplicationStatus[]
> = {
  submitted: ["under_review", "withdrawn", "declined", "waitlisted"],
  under_review: ["approved", "waitlisted", "declined", "withdrawn"],
  approved: ["invoice_sent", "waitlisted", "declined", "withdrawn"],
  invoice_sent: ["payment_overdue", "confirmed", "withdrawn", "declined", "waitlisted"],
  payment_overdue: ["invoice_sent", "confirmed", "withdrawn", "declined", "waitlisted"],
  confirmed: ["cancelled"],
  waitlisted: ["approved", "declined", "withdrawn"],
  declined: ["under_review", "waitlisted"],
  withdrawn: [],
  cancelled: [],
};

export function emptyInvoiceRecord(): VendorInvoiceRecord {
  return {
    status: "not_created",
    squareInvoiceId: null,
    squareInvoiceUrl: null,
    createdAt: null,
    sentAt: null,
    dueOn: null,
    amountInvoiced: null,
    paidAt: null,
    amountPaid: null,
    paymentMethodOrReference: null,
  };
}

export function emptyAcceptanceAcknowledgment(
  agreementVersion: string = vendorAgreementVersion,
): VendorAcceptanceAcknowledgment {
  return {
    acknowledgedAt: null,
    acknowledgedSpace: false,
    acknowledgedPrice: false,
    acknowledgedDeadline: false,
    acknowledgedCancellationPolicy: false,
    acknowledgedVendorRules: false,
    acknowledgedEventPolicies: false,
    agreementVersion,
  };
}

export function canTransition(
  from: VendorApplicationStatus,
  to: VendorApplicationStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function appendHistory(
  history: readonly StatusHistoryEntry[],
  status: VendorApplicationStatus,
  actor: StatusHistoryActor,
  note?: string,
  timestamp: string = new Date().toISOString(),
): StatusHistoryEntry[] {
  return [...history, { status, timestamp, actor, ...(note ? { note } : {}) }];
}

export function effectivePaymentDueOn(offer: VendorOffer): string {
  return offer.paymentDeadlineOverride?.newDueOn ?? offer.paymentDueOn;
}

export function isPaymentPastDue(
  offer: VendorOffer,
  now: Date | string = new Date(),
): boolean {
  if (offer.confirmedAt) return false;
  const today = chicagoCalendarDateFromInstant(now);
  return compareCalendarDates(today, effectivePaymentDueOn(offer)) > 0;
}

export type CreateOfferInput = {
  applicationReference: string;
  applicationType: OfficialApplicationType;
  businessName: string;
  requestedSpace: VendorSpaceId;
  offeredSpace: VendorSpaceId;
  extraBadges: number;
  extraTables: number;
  electricityRequested: boolean;
  offerIssuedAt: Date | string;
  pricingTier?: VendorPricingTier;
  customBasePrice?: number;
  customPricingInternalNote?: string;
};

export function createVendorOffer(input: CreateOfferInput): VendorOffer {
  if (input.pricingTier === "custom" && !input.customPricingInternalNote?.trim()) {
    throw new Error("Custom pricing requires an internal reason/note.");
  }

  const snapshot = createPriceSnapshot({
    offeredSpace: input.offeredSpace,
    extraBadges: input.extraBadges,
    extraTables: input.extraTables,
    electricityRequested: input.electricityRequested,
    offerIssuedAt: input.offerIssuedAt,
    pricingTier: input.pricingTier,
    customBasePrice: input.customBasePrice,
  });

  const offerIssuedAt =
    typeof input.offerIssuedAt === "string"
      ? input.offerIssuedAt
      : input.offerIssuedAt.toISOString();

  return {
    applicationReference: input.applicationReference,
    applicationType: input.applicationType,
    businessName: input.businessName,
    requestedSpace: input.requestedSpace,
    offeredSpace: input.offeredSpace,
    decisionDate: snapshot.offerIssuedOn,
    snapshot,
    offerIssuedAt,
    paymentDueOn: snapshot.paymentDueOn,
    paymentDeadlineOverride: null,
    invoice: {
      ...emptyInvoiceRecord(),
      dueOn: snapshot.paymentDueOn,
      amountInvoiced: snapshot.total,
    },
    paymentStatus: "due",
    confirmedAt: null,
    vendorAgreementVersion: vendorAgreementVersion,
    acceptanceAcknowledgment: emptyAcceptanceAcknowledgment(),
    customPricingInternalNote: input.customPricingInternalNote?.trim() ?? null,
    spaceReleased: false,
  };
}

export function applyStatus(
  record: VendorApplicationRecord,
  next: VendorApplicationStatus,
  actor: StatusHistoryActor,
  note?: string,
): VendorApplicationRecord {
  if (!canTransition(record.status, next)) {
    throw new Error(`Cannot change status from ${record.status} to ${next}.`);
  }
  if (next === "confirmed") {
    throw new Error("Use recordPaymentReceived to confirm a vendor after payment.");
  }
  return {
    ...record,
    status: next,
    history: appendHistory(record.history, next, actor, note),
  };
}

export function approveApplication(
  record: VendorApplicationRecord,
  input: Omit<CreateOfferInput, "applicationReference" | "applicationType"> & {
    applicationType?: OfficialApplicationType;
  },
  actor: StatusHistoryActor = "organizer",
): VendorApplicationRecord {
  const from = record.status;
  if (from !== "under_review" && from !== "waitlisted") {
    throw new Error("Approve applications from Under Review or Waitlisted.");
  }

  const offer = createVendorOffer({
    ...input,
    applicationReference: record.reference,
    applicationType: input.applicationType ?? record.applicationType,
  });

  const history = appendHistory(
    record.history,
    "approved",
    actor,
    offer.requestedSpace === offer.offeredSpace
      ? undefined
      : `Offered ${offer.offeredSpace}; applicant requested ${offer.requestedSpace}.`,
  );

  return {
    ...record,
    status: "approved",
    offer,
    waitlistPosition: from === "waitlisted" ? null : record.waitlistPosition,
    history,
  };
}

export function markInvoiceCreated(
  record: VendorApplicationRecord,
  details: {
    squareInvoiceId?: string | null;
    squareInvoiceUrl?: string | null;
    createdAt?: string;
  } = {},
  actor: StatusHistoryActor = "organizer",
): VendorApplicationRecord {
  if (!record.offer) throw new Error("Approve the application before creating an invoice.");
  const invoice: VendorInvoiceRecord = {
    ...record.offer.invoice,
    status: record.offer.invoice.status === "sent" ? "sent" : "created",
    squareInvoiceId: details.squareInvoiceId ?? record.offer.invoice.squareInvoiceId,
    squareInvoiceUrl: details.squareInvoiceUrl ?? record.offer.invoice.squareInvoiceUrl,
    createdAt: details.createdAt ?? new Date().toISOString(),
    amountInvoiced: record.offer.snapshot.total,
    dueOn: effectivePaymentDueOn(record.offer),
  };
  return {
    ...record,
    offer: { ...record.offer, invoice },
    history: appendHistory(record.history, record.status, actor, "Square invoice recorded as created."),
  };
}

export function markInvoiceSent(
  record: VendorApplicationRecord,
  details: {
    sentAt?: string;
    squareInvoiceId?: string | null;
    squareInvoiceUrl?: string | null;
  } = {},
  actor: StatusHistoryActor = "organizer",
): VendorApplicationRecord {
  if (!record.offer) throw new Error("Approve the application before sending an invoice.");
  const nextStatus: VendorApplicationStatus =
    record.status === "approved" || record.status === "payment_overdue"
      ? "invoice_sent"
      : record.status;
  if (nextStatus !== record.status && !canTransition(record.status, nextStatus)) {
    throw new Error("Cannot mark invoice sent from the current status.");
  }

  const offer: VendorOffer = {
    ...record.offer,
    invoice: {
      ...record.offer.invoice,
      status: "sent",
      sentAt: details.sentAt ?? new Date().toISOString(),
      squareInvoiceId: details.squareInvoiceId ?? record.offer.invoice.squareInvoiceId,
      squareInvoiceUrl: details.squareInvoiceUrl ?? record.offer.invoice.squareInvoiceUrl,
      amountInvoiced: record.offer.snapshot.total,
      dueOn: effectivePaymentDueOn(record.offer),
    },
    paymentStatus: "due",
  };

  return {
    ...record,
    status: nextStatus,
    offer,
    history: appendHistory(
      record.history,
      nextStatus,
      actor,
      "Invoice marked sent. Space is not confirmed until payment is received.",
    ),
  };
}

export function extendPaymentDeadline(
  record: VendorApplicationRecord,
  newDueOn: string,
  internalReason: string,
  actor: StatusHistoryActor = "organizer",
  setAt: string = new Date().toISOString(),
): VendorApplicationRecord {
  if (!record.offer) throw new Error("No offer exists to extend.");
  if (!isCalendarDate(newDueOn)) throw new Error("Enter a valid payment due date.");
  if (!internalReason.trim()) throw new Error("Deadline overrides require an internal reason.");
  if (record.status === "confirmed") {
    throw new Error("Confirmed vendors do not need a payment deadline extension.");
  }

  const originalDueOn =
    record.offer.paymentDeadlineOverride?.originalDueOn ?? record.offer.paymentDueOn;
  const override: VendorPaymentDeadlineOverride = {
    originalDueOn,
    newDueOn,
    internalReason: internalReason.trim(),
    setAt,
    actor,
  };

  let nextStatus = record.status;
  if (record.status === "payment_overdue" && compareCalendarDates(chicagoCalendarDateFromInstant(setAt), newDueOn) <= 0) {
    nextStatus = "invoice_sent";
  }

  const offer: VendorOffer = {
    ...record.offer,
    paymentDeadlineOverride: override,
    invoice: {
      ...record.offer.invoice,
      dueOn: newDueOn,
      status:
        record.offer.invoice.status === "overdue" && nextStatus === "invoice_sent"
          ? "sent"
          : record.offer.invoice.status,
    },
    paymentStatus: "due",
  };

  return {
    ...record,
    status: nextStatus,
    offer,
    history: appendHistory(
      record.history,
      nextStatus,
      actor,
      "Payment deadline extended. Internal reason is not included in vendor email.",
    ),
  };
}

export function markPaymentOverdue(
  record: VendorApplicationRecord,
  now: Date | string = new Date(),
  actor: StatusHistoryActor = "organizer",
): VendorApplicationRecord {
  if (!record.offer) throw new Error("No offer exists.");
  if (record.status === "confirmed") {
    throw new Error("A confirmed vendor is not overdue.");
  }
  if (!isPaymentPastDue(record.offer, now)) {
    throw new Error("The payment deadline has not passed. Overdue is an organizer action, not automatic.");
  }
  if (!canTransition(record.status, "payment_overdue") && record.status !== "payment_overdue") {
    throw new Error("Cannot mark this application overdue from its current status.");
  }

  const offer: VendorOffer = {
    ...record.offer,
    invoice: {
      ...record.offer.invoice,
      status: record.offer.invoice.status === "paid" ? "paid" : "overdue",
    },
    paymentStatus: "overdue",
  };

  return {
    ...record,
    status: "payment_overdue",
    offer,
    history: appendHistory(
      record.history,
      "payment_overdue",
      actor,
      "Payment deadline passed. Space is not automatically cancelled or released.",
    ),
  };
}

export function recordPaymentReceived(
  record: VendorApplicationRecord,
  details: {
    paidAt: string;
    amountPaid: number;
    paymentMethodOrReference?: string | null;
  },
  actor: StatusHistoryActor = "organizer",
): VendorApplicationRecord {
  if (!record.offer) throw new Error("No offer exists to record payment against.");
  if (details.amountPaid < 0) throw new Error("Amount paid cannot be negative.");
  if (!canTransition(record.status, "confirmed") && record.status !== "approved" && record.status !== "invoice_sent" && record.status !== "payment_overdue") {
    throw new Error("Payment can only confirm an offered, unpaid application.");
  }
  if (record.status !== "approved" && record.status !== "invoice_sent" && record.status !== "payment_overdue") {
    throw new Error("Payment can only confirm an offered, unpaid application.");
  }

  const offer: VendorOffer = {
    ...record.offer,
    confirmedAt: details.paidAt,
    paymentStatus: "received",
    spaceReleased: false,
    invoice: {
      ...record.offer.invoice,
      status: "paid",
      paidAt: details.paidAt,
      amountPaid: details.amountPaid,
      paymentMethodOrReference: details.paymentMethodOrReference ?? record.offer.invoice.paymentMethodOrReference,
    },
  };

  return {
    ...record,
    status: "confirmed",
    offer,
    history: appendHistory(record.history, "confirmed", actor, "Payment recorded. Vendor is confirmed."),
  };
}

export function withdrawApplication(
  record: VendorApplicationRecord,
  actor: StatusHistoryActor = "organizer",
  note?: string,
): VendorApplicationRecord {
  if (record.status === "confirmed") {
    throw new Error("Use cancelConfirmedVendor for a paid vendor. Withdrawn is for unpaid applicants.");
  }
  if (!canTransition(record.status, "withdrawn")) {
    throw new Error("This application cannot be withdrawn from its current status.");
  }
  const offer = record.offer
    ? { ...record.offer, spaceReleased: true, paymentStatus: record.offer.paymentStatus }
    : record.offer;
  return {
    ...record,
    status: "withdrawn",
    offer,
    history: appendHistory(record.history, "withdrawn", actor, note),
  };
}

export function cancelConfirmedVendor(
  record: VendorApplicationRecord,
  actor: StatusHistoryActor = "organizer",
  note?: string,
): VendorApplicationRecord {
  if (record.status !== "confirmed") {
    throw new Error("Cancelled is for confirmed/paid vendors. Use withdrawn for unpaid applicants.");
  }
  const nextInvoiceStatus: VendorInvoiceStatus =
    record.offer?.invoice.status === "paid" ? "paid" : "cancelled";
  const offer: VendorOffer | null = record.offer
    ? {
        ...record.offer,
        spaceReleased: true,
        invoice: {
          ...record.offer.invoice,
          status: nextInvoiceStatus,
        },
      }
    : null;
  return {
    ...record,
    status: "cancelled",
    offer,
    history: appendHistory(record.history, "cancelled", actor, note),
  };
}

export function releaseOfferedSpace(
  record: VendorApplicationRecord,
  actor: StatusHistoryActor = "organizer",
): VendorApplicationRecord {
  if (!record.offer) throw new Error("No offered space to release.");
  return {
    ...record,
    offer: { ...record.offer, spaceReleased: true },
    history: appendHistory(
      record.history,
      record.status,
      actor,
      "Offered space marked available. Waitlist promotion is manual.",
    ),
  };
}

export function recordAcceptanceAcknowledgment(
  record: VendorApplicationRecord,
  acknowledgedAt: string = new Date().toISOString(),
): VendorApplicationRecord {
  if (!record.offer) throw new Error("No offer exists to acknowledge.");
  return {
    ...record,
    offer: {
      ...record.offer,
      acceptanceAcknowledgment: {
        acknowledgedAt,
        acknowledgedSpace: true,
        acknowledgedPrice: true,
        acknowledgedDeadline: true,
        acknowledgedCancellationPolicy: true,
        acknowledgedVendorRules: true,
        acknowledgedEventPolicies: true,
        agreementVersion: record.offer.vendorAgreementVersion,
      },
    },
  };
}

export function isValidApplicationStatus(
  value: string,
): value is VendorApplicationStatus {
  return (VENDOR_APPLICATION_STATUSES as readonly string[]).includes(value);
}

export function createSubmittedRecord(input: {
  reference: string;
  applicationType: OfficialApplicationType;
  requestedSpace: VendorSpaceId;
  primaryCategory?: string;
  extraBadgesRequested?: number;
  extraTablesRequested?: number;
  electricityRequested?: boolean;
  submittedAt?: string;
  displayName?: string;
}): VendorApplicationRecord {
  const submittedAt = input.submittedAt ?? new Date().toISOString();
  return {
    reference: input.reference,
    status: "submitted",
    submittedAt,
    applicationType: input.applicationType,
    requestedSpace: input.requestedSpace,
    primaryCategory: input.primaryCategory ?? "",
    extraBadgesRequested: input.extraBadgesRequested ?? 0,
    extraTablesRequested: input.extraTablesRequested ?? 0,
    electricityRequested: input.electricityRequested ?? false,
    offer: null,
    waitlistPosition: null,
    directory: {
      publishInDirectory: false,
      displayName: input.displayName ?? "",
      category: "",
      shortDescription: "",
      logo: null,
      website: null,
      socialUrl: null,
    },
    history: [{ status: "submitted", timestamp: submittedAt, actor: "applicant" }],
    cancellationRequest: null,
    vendorAgreementVersion: vendorAgreementVersion,
  };
}
