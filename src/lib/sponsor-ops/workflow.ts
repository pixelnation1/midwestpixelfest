import { getPackageById } from "@/lib/sponsorships";
import { emptyAssetCollection, requiredAssetsArePresent } from "@/lib/sponsor-ops/assets";
import { emptyDirectoryProfile } from "@/lib/sponsor-ops/directory";
import { createFulfillmentChecklist } from "@/lib/sponsor-ops/fulfillment";
import { createSponsorReference } from "@/lib/sponsor-ops/reference";
import {
  createCommitmentSnapshot,
  type CreateCommitmentSnapshotInput,
} from "@/lib/sponsor-ops/snapshot";
import {
  type SponsorshipStatus,
} from "@/lib/sponsor-ops/status";
import type {
  SponsorAssetCollection,
  SponsorCommitmentAcknowledgment,
  SponsorInvoiceRecord,
  SponsorStatusHistoryEntry,
  SponsorshipRecord,
  StatusHistoryActor,
} from "@/lib/sponsor-ops/types";

const ALLOWED_TRANSITIONS: Record<SponsorshipStatus, readonly SponsorshipStatus[]> = {
  inquiry_received: ["contacted", "declined", "withdrawn"],
  contacted: ["negotiating", "declined", "withdrawn"],
  negotiating: ["committed", "declined", "withdrawn"],
  committed: ["invoice_created", "withdrawn", "declined"],
  invoice_created: ["invoice_sent", "cancelled", "withdrawn"],
  invoice_sent: ["paid", "cancelled", "withdrawn"],
  paid: ["assets_needed", "assets_received", "active", "cancelled"],
  assets_needed: ["assets_received", "cancelled"],
  assets_received: ["active", "assets_needed", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [],
  declined: ["inquiry_received", "contacted"],
  withdrawn: [],
  cancelled: [],
};

export function emptyInvoiceRecord(): SponsorInvoiceRecord {
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

export function emptyAcknowledgment(): SponsorCommitmentAcknowledgment {
  return {
    acknowledgedAt: null,
    acknowledgedPaymentTerms: false,
    acknowledgedMarketingAssets: false,
    acknowledgedAgreement: false,
    representativeName: null,
    representativeTitle: null,
    signature: null,
    signatureDate: null,
  };
}

export function canTransition(from: SponsorshipStatus, to: SponsorshipStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function allowedNextStatuses(from: SponsorshipStatus): readonly SponsorshipStatus[] {
  return ALLOWED_TRANSITIONS[from];
}

export function allowedOrganizerStatusChoices(
  from: SponsorshipStatus,
  hasCommitment: boolean,
): readonly SponsorshipStatus[] {
  return ALLOWED_TRANSITIONS[from].filter((status) => {
    if (status === "committed") return hasCommitment && from !== "committed";
    if (status === "paid") return false;
    return true;
  });
}

export function statusMismatchMessage(
  record: Pick<SponsorshipRecord, "status" | "commitment">,
  action: "invoice" | "invoice_sent" | "payment",
): string {
  const current = record.status.replaceAll("_", " ");
  if (action === "invoice") {
    if (record.commitment && record.status !== "committed") {
      return `Commitment exists but sponsorship status is ${current}.`;
    }
    return `Current sponsorship status is ${current}. Create the commitment before creating an invoice.`;
  }
  if (action === "invoice_sent") {
    return `Current sponsorship status is ${current}. Mark the invoice created before recording it as sent.`;
  }
  if (!record.commitment) {
    return `Current sponsorship status is ${current}. Create the commitment before recording payment.`;
  }
  return `Current sponsorship status is ${current}. Record the invoice as sent before recording full payment.`;
}

export function appendHistory(
  history: readonly SponsorStatusHistoryEntry[],
  status: SponsorshipStatus,
  actor: StatusHistoryActor,
  note?: string,
  timestamp: string = new Date().toISOString(),
): SponsorStatusHistoryEntry[] {
  return [...history, { status, timestamp, actor, ...(note ? { note } : {}) }];
}

export function createInquiryRecord(input: {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  businessAddress?: string | null;
  website?: string | null;
  selectedLevel?: string | null;
  customAmountProposed?: string | null;
  areasOfInterest?: readonly string[];
  inquiryReceivedAt?: Date | string;
  reference?: string;
}): SponsorshipRecord {
  const inquiryReceivedAt =
    typeof input.inquiryReceivedAt === "string"
      ? input.inquiryReceivedAt
      : (input.inquiryReceivedAt ?? new Date()).toISOString();
  const reference = input.reference ?? createSponsorReference();
  return {
    reference,
    status: "inquiry_received",
    businessName: input.businessName,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone ?? null,
    businessAddress: input.businessAddress ?? null,
    website: input.website ?? null,
    socialUrls: [],
    selectedLevel: input.selectedLevel ?? null,
    customAmountProposed: input.customAmountProposed ?? null,
    areasOfInterest: input.areasOfInterest ?? [],
    inquiryReceivedAt,
    contactedAt: null,
    committedAt: null,
    invoiceCreatedAt: null,
    invoiceSentAt: null,
    paymentDueAt: null,
    paidAt: null,
    amountCommitted: null,
    amountInvoiced: null,
    amountPaid: null,
    assetsNeeded: false,
    assetsReceivedAt: null,
    activatedAt: null,
    activationOverride: false,
    activationOverrideReason: null,
    commitment: null,
    invoice: emptyInvoiceRecord(),
    assets: emptyAssetCollection(),
    fulfillment: [],
    acknowledgment: emptyAcknowledgment(),
    directory: emptyDirectoryProfile(input.businessName),
    publicDirectoryEnabled: false,
    history: appendHistory([], "inquiry_received", "system", undefined, inquiryReceivedAt),
  };
}

function applyStatus(
  record: SponsorshipRecord,
  status: SponsorshipStatus,
  actor: StatusHistoryActor,
  note?: string,
  timestamp: string = new Date().toISOString(),
): SponsorshipRecord {
  if (status === "active") {
    throw new Error("Use activateSponsor after payment and assets, or with an organizer override.");
  }
  if (status === "committed") {
    throw new Error("Use commitSponsorship to create a locked commitment snapshot.");
  }
  if (status === "paid") {
    throw new Error("Use recordSponsorshipPayment to record payment.");
  }
  if (!canTransition(record.status, status)) {
    throw new Error(`Cannot change sponsorship status from ${record.status} to ${status}.`);
  }
  return {
    ...record,
    status,
    contactedAt: status === "contacted" ? timestamp : record.contactedAt,
    history: appendHistory(record.history, status, actor, note, timestamp),
  };
}

export function markSponsorContacted(
  record: SponsorshipRecord,
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  return applyStatus(record, "contacted", actor);
}

export function markSponsorNegotiating(
  record: SponsorshipRecord,
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  return applyStatus(record, "negotiating", actor);
}

function applyCommittedSnapshot(
  record: SponsorshipRecord,
  snapshot: NonNullable<SponsorshipRecord["commitment"]>,
  actor: StatusHistoryActor,
  acknowledgment: Partial<SponsorCommitmentAcknowledgment> | undefined,
  historyAt: string,
): SponsorshipRecord {
  const pkg = getPackageById(snapshot.packageId);
  const levelLabel = pkg?.name ?? snapshot.packageName;
  return {
    ...record,
    status: "committed",
    committedAt: record.committedAt ?? snapshot.committedAt,
    paymentDueAt: snapshot.paymentDueAt,
    amountCommitted: record.amountCommitted ?? snapshot.agreedAmount,
    selectedLevel: record.selectedLevel ?? levelLabel,
    commitment: snapshot,
    fulfillment:
      record.fulfillment.length > 0 ? record.fulfillment : createFulfillmentChecklist(snapshot),
    acknowledgment: {
      ...record.acknowledgment,
      ...acknowledgment,
    },
    directory: {
      ...record.directory,
      displayName: snapshot.businessName,
      packageId: snapshot.packageId,
      levelLabel: record.directory.levelLabel || levelLabel,
      sponsoredArea: snapshot.areasSponsored[0] ?? record.directory.sponsoredArea,
    },
    history: appendHistory(record.history, "committed", actor, undefined, historyAt),
  };
}

export function commitSponsorship(
  record: SponsorshipRecord,
  input: Omit<CreateCommitmentSnapshotInput, "sponsorReference" | "businessName" | "committedAt"> & {
    committedAt?: Date | string;
    acknowledgment?: Partial<SponsorCommitmentAcknowledgment>;
  },
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  if (record.commitment) {
    if (record.status === "committed") {
      return record;
    }
    if (!canTransition(record.status, "committed")) {
      throw new Error(
        `Commitment exists but sponsorship status is ${record.status.replaceAll("_", " ")}.`,
      );
    }
    return applyCommittedSnapshot(
      record,
      record.commitment,
      actor,
      input.acknowledgment,
      new Date().toISOString(),
    );
  }

  if (!canTransition(record.status, "committed")) {
    throw new Error(
      `Current sponsorship status is ${record.status.replaceAll("_", " ")}. Move the sponsor to negotiating before creating a commitment.`,
    );
  }
  const committedAt = input.committedAt ?? new Date();
  const snapshot = createCommitmentSnapshot({
    ...input,
    sponsorReference: record.reference,
    businessName: record.businessName,
    committedAt,
  });
  return applyCommittedSnapshot(
    record,
    snapshot,
    actor,
    input.acknowledgment,
    snapshot.committedAt,
  );
}

export function createSponsorInvoice(
  record: SponsorshipRecord,
  details: {
    amountInvoiced?: number;
    dueOn?: string | null;
    squareInvoiceId?: string | null;
    createdAt?: Date | string;
  } = {},
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  if (!record.commitment) {
    throw new Error(statusMismatchMessage(record, "invoice"));
  }
  if (!canTransition(record.status, "invoice_created")) {
    throw new Error(statusMismatchMessage(record, "invoice"));
  }
  const createdAt =
    typeof details.createdAt === "string"
      ? details.createdAt
      : (details.createdAt ?? new Date()).toISOString();
  const amountInvoiced = details.amountInvoiced ?? record.commitment.agreedAmount;
  const dueOn = details.dueOn ?? record.commitment.paymentDueAt;
  return {
    ...record,
    status: "invoice_created",
    invoiceCreatedAt: createdAt,
    amountInvoiced,
    paymentDueAt: dueOn,
    invoice: {
      ...record.invoice,
      status: "created",
      createdAt,
      dueOn,
      amountInvoiced,
      squareInvoiceId: details.squareInvoiceId ?? record.invoice.squareInvoiceId,
    },
    history: appendHistory(record.history, "invoice_created", actor, undefined, createdAt),
  };
}

export function markSponsorInvoiceSent(
  record: SponsorshipRecord,
  details: {
    sentAt?: Date | string;
    squareInvoiceUrl?: string | null;
    squareInvoiceId?: string | null;
  } = {},
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  if (!canTransition(record.status, "invoice_sent")) {
    throw new Error(statusMismatchMessage(record, "invoice_sent"));
  }
  const sentAt =
    typeof details.sentAt === "string" ? details.sentAt : (details.sentAt ?? new Date()).toISOString();
  return {
    ...record,
    status: "invoice_sent",
    invoiceSentAt: sentAt,
    invoice: {
      ...record.invoice,
      status: "sent",
      sentAt,
      squareInvoiceUrl: details.squareInvoiceUrl ?? record.invoice.squareInvoiceUrl,
      squareInvoiceId: details.squareInvoiceId ?? record.invoice.squareInvoiceId,
    },
    history: appendHistory(record.history, "invoice_sent", actor, undefined, sentAt),
  };
}

export function recordSponsorshipPayment(
  record: SponsorshipRecord,
  details: {
    amountPaid: number;
    paidAt?: Date | string;
    paymentMethodOrReference?: string | null;
    markFullyPaid?: boolean;
  },
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  if (!record.commitment) {
    throw new Error(statusMismatchMessage(record, "payment"));
  }
  if (record.status !== "paid" && !canTransition(record.status, "paid")) {
    throw new Error(statusMismatchMessage(record, "payment"));
  }
  const paidAt =
    typeof details.paidAt === "string" ? details.paidAt : (details.paidAt ?? new Date()).toISOString();
  const previousPaid = record.amountPaid ?? 0;
  const amountPaid = previousPaid + details.amountPaid;
  const due = record.amountInvoiced ?? record.commitment.agreedAmount;
  const fullyPaid = details.markFullyPaid === true || amountPaid >= due;

  if (!fullyPaid) {
    return {
      ...record,
      amountPaid,
      invoice: {
        ...record.invoice,
        amountPaid,
        paymentMethodOrReference:
          details.paymentMethodOrReference ?? record.invoice.paymentMethodOrReference,
      },
    };
  }

  const assetsReady = requiredAssetsArePresent(record.assets);
  return {
    ...record,
    status: "paid",
    paidAt,
    amountPaid,
    assetsNeeded: !assetsReady,
    assetsReceivedAt: assetsReady ? (record.assetsReceivedAt ?? paidAt) : record.assetsReceivedAt,
    invoice: {
      ...record.invoice,
      status: "paid",
      paidAt,
      amountPaid,
      paymentMethodOrReference:
        details.paymentMethodOrReference ?? record.invoice.paymentMethodOrReference,
    },
    history: appendHistory(record.history, "paid", actor, undefined, paidAt),
  };
}

export function requestSponsorAssets(
  record: SponsorshipRecord,
  actor: StatusHistoryActor = "organizer",
  requestedAt: Date | string = new Date(),
): SponsorshipRecord {
  const timestamp = typeof requestedAt === "string" ? requestedAt : requestedAt.toISOString();
  const nextStatus =
    record.status === "paid" && canTransition(record.status, "assets_needed")
      ? "assets_needed"
      : record.status;
  return {
    ...record,
    status: nextStatus,
    assetsNeeded: true,
    assets: {
      ...record.assets,
      status:
        record.assets.status === "received" || record.assets.status === "approved"
          ? record.assets.status
          : "requested",
      requestedAt: record.assets.requestedAt ?? timestamp,
    },
    history:
      nextStatus === record.status
        ? appendHistory(record.history, record.status, actor, "Asset request recorded.", timestamp)
        : appendHistory(record.history, nextStatus, actor, "Asset request recorded.", timestamp),
  };
}

export function recordSponsorAssetsReceived(
  record: SponsorshipRecord,
  assets: Partial<SponsorAssetCollection>,
  actor: StatusHistoryActor = "organizer",
  receivedAt: Date | string = new Date(),
): SponsorshipRecord {
  if (record.status !== "assets_needed" && record.status !== "paid" && record.status !== "assets_received") {
    throw new Error("Assets can be recorded after payment.");
  }
  const timestamp = typeof receivedAt === "string" ? receivedAt : receivedAt.toISOString();
  const nextAssets: SponsorAssetCollection = {
    ...record.assets,
    ...assets,
    status: "received",
    receivedAt: timestamp,
  };
  const nextStatus: SponsorshipStatus =
    record.status === "paid" || record.status === "assets_needed" ? "assets_received" : record.status;
  return {
    ...record,
    status: nextStatus,
    assetsNeeded: false,
    assetsReceivedAt: timestamp,
    assets: nextAssets,
    history:
      nextStatus === record.status
        ? record.history
        : appendHistory(record.history, nextStatus, actor, undefined, timestamp),
  };
}

export function meetsStandardActivationRequirements(record: SponsorshipRecord): boolean {
  const paid = Boolean(record.paidAt);
  const assetsOk =
    record.assets.status === "received" || record.assets.status === "approved";
  return paid && assetsOk;
}

export function activateSponsor(
  record: SponsorshipRecord,
  options: {
    override?: boolean;
    overrideReason?: string;
    publishInDirectory?: boolean;
    activatedAt?: Date | string;
  } = {},
  actor: StatusHistoryActor = "organizer",
): SponsorshipRecord {
  const allowedFrom = record.status === "assets_received" || record.status === "paid" || record.status === "assets_needed";
  if (!allowedFrom && !options.override) {
    throw new Error("Activate only after payment and assets, or with an organizer override.");
  }
  if (!options.override && !meetsStandardActivationRequirements(record)) {
    throw new Error("Standard activation requires payment and received assets.");
  }
  if (options.override && !options.overrideReason?.trim()) {
    throw new Error("Activation override requires an internal reason.");
  }
  const activatedAt =
    typeof options.activatedAt === "string"
      ? options.activatedAt
      : (options.activatedAt ?? new Date()).toISOString();
  return {
    ...record,
    status: "active",
    activatedAt,
    activationOverride: Boolean(options.override),
    activationOverrideReason: options.overrideReason?.trim() ?? null,
    publicDirectoryEnabled: options.publishInDirectory ?? record.publicDirectoryEnabled,
    directory: {
      ...record.directory,
      publishInDirectory: options.publishInDirectory ?? record.directory.publishInDirectory,
    },
    history: appendHistory(
      record.history,
      "active",
      actor,
      options.override ? options.overrideReason : undefined,
      activatedAt,
    ),
  };
}

export function withdrawSponsorship(
  record: SponsorshipRecord,
  actor: StatusHistoryActor = "organizer",
  note?: string,
): SponsorshipRecord {
  if (record.paidAt) {
    throw new Error("Use cancelled for a paid sponsorship. Withdrawn is for unpaid inquiries or commitments.");
  }
  if (!canTransition(record.status, "withdrawn")) {
    throw new Error("This sponsorship cannot be withdrawn from its current status.");
  }
  return applyStatus(record, "withdrawn", actor, note);
}

export function declineSponsorship(
  record: SponsorshipRecord,
  actor: StatusHistoryActor = "organizer",
  note?: string,
): SponsorshipRecord {
  if (record.paidAt) {
    throw new Error("Use cancelled for a paid sponsorship.");
  }
  if (!canTransition(record.status, "declined")) {
    throw new Error("This sponsorship cannot be declined from its current status.");
  }
  return applyStatus(record, "declined", actor, note);
}

export function cancelSponsorship(
  record: SponsorshipRecord,
  actor: StatusHistoryActor = "organizer",
  note?: string,
): SponsorshipRecord {
  if (!canTransition(record.status, "cancelled")) {
    throw new Error("Cancelled is for committed or paid sponsorships.");
  }
  const nextInvoiceStatus: SponsorInvoiceRecord["status"] =
    record.invoice.status === "paid" || record.invoice.status === "refunded"
      ? record.invoice.status
      : "cancelled";
  return {
    ...record,
    status: "cancelled",
    invoice: {
      ...record.invoice,
      status: nextInvoiceStatus,
    },
    history: appendHistory(record.history, "cancelled", actor, note),
  };
}

export { applyStatus as applySponsorshipStatus };
