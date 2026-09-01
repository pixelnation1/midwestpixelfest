import type { OfficialApplicationType } from "@/lib/vendor-application";
import type { VendorSpaceId } from "@/lib/vendors";
import type {
  VendorApplicationStatus,
  VendorInvoiceStatus,
  VendorPaymentStatus,
  VendorPricingTier,
} from "@/lib/vendor-ops/status";

export type StatusHistoryActor = "organizer" | "system" | "applicant";

export type StatusHistoryEntry = {
  status: VendorApplicationStatus;
  timestamp: string;
  note?: string;
  actor: StatusHistoryActor;
};

/** Internal-only. Never include in directory, vendor emails, analytics, or public APIs. */
export type VendorInternalNote = {
  id: string;
  createdAt: string;
  actor: string;
  body: string;
};

export type VendorOfferAddOn = {
  id: "extraBadge" | "extraTable";
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

/**
 * Frozen commercial terms for one acceptance offer.
 * Do not re-read live vendorConfig to change these after issue.
 */
export type VendorPriceSnapshot = {
  spaceId: VendorSpaceId;
  spaceName: string;
  dimensions: string | null;
  pricingTier: VendorPricingTier;
  basePrice: number;
  addOns: readonly VendorOfferAddOn[];
  electricityRequested: boolean;
  electricityPrice: null;
  total: number;
  offerIssuedOn: string;
  paymentDueOn: string;
  foundingDeadlineAtIssue: string;
  locked: true;
};

export type VendorPaymentDeadlineOverride = {
  originalDueOn: string;
  newDueOn: string;
  internalReason: string;
  setAt: string;
  actor: string;
};

export type VendorInvoiceRecord = {
  status: VendorInvoiceStatus;
  squareInvoiceId: string | null;
  squareInvoiceUrl: string | null;
  createdAt: string | null;
  sentAt: string | null;
  dueOn: string | null;
  amountInvoiced: number | null;
  paidAt: string | null;
  amountPaid: number | null;
  /** Internal payment method / Square reference. Do not expose publicly. */
  paymentMethodOrReference: string | null;
};

export type VendorAcceptanceAcknowledgment = {
  acknowledgedAt: string | null;
  acknowledgedSpace: boolean;
  acknowledgedPrice: boolean;
  acknowledgedDeadline: boolean;
  acknowledgedCancellationPolicy: boolean;
  acknowledgedVendorRules: boolean;
  acknowledgedEventPolicies: boolean;
  agreementVersion: string;
};

export type VendorDirectoryProfile = {
  publishInDirectory: boolean;
  displayName: string;
  category: string;
  shortDescription: string;
  logo: string | null;
  website: string | null;
  socialUrl: string | null;
};

export type VendorCancellationRequest = {
  requestedAt: string;
  /** Self-service is not enabled; organizer contact is the current channel. */
  channel: "organizer_contact";
  verifiedIdentity: boolean;
  status: "received" | "approved" | "denied";
};

export type VendorOffer = {
  applicationReference: string;
  applicationType: OfficialApplicationType;
  businessName: string;
  requestedSpace: VendorSpaceId;
  offeredSpace: VendorSpaceId;
  decisionDate: string;
  snapshot: VendorPriceSnapshot;
  offerIssuedAt: string;
  paymentDueOn: string;
  paymentDeadlineOverride: VendorPaymentDeadlineOverride | null;
  invoice: VendorInvoiceRecord;
  paymentStatus: VendorPaymentStatus;
  confirmedAt: string | null;
  vendorAgreementVersion: string;
  acceptanceAcknowledgment: VendorAcceptanceAcknowledgment;
  customPricingInternalNote: string | null;
  spaceReleased: boolean;
};

/**
 * Operational record for future persistence.
 * Do not ship this object to the browser or log it in production.
 */
export type VendorApplicationRecord = {
  reference: string;
  status: VendorApplicationStatus;
  submittedAt: string;
  applicationType: OfficialApplicationType;
  requestedSpace: VendorSpaceId;
  primaryCategory: string;
  extraBadgesRequested: number;
  extraTablesRequested: number;
  electricityRequested: boolean;
  offer: VendorOffer | null;
  waitlistPosition: number | null;
  directory: VendorDirectoryProfile;
  history: StatusHistoryEntry[];
  cancellationRequest: VendorCancellationRequest | null;
  vendorAgreementVersion: string;
};

/** Private contact fields. Keep off public routes and out of analytics. */
export type VendorApplicantPii = {
  contactName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  signature: string;
};

export type VendorApplicationPrivateRecord = VendorApplicationRecord & {
  pii: VendorApplicantPii;
  internalNotes: VendorInternalNote[];
};

/** Organizer review-table shape for a future authenticated admin UI. */
export type VendorReviewListItem = {
  applicationReference: string;
  applicantName: string;
  businessName: string;
  applicationType: OfficialApplicationType;
  category: string;
  requestedSpace: VendorSpaceId;
  status: VendorApplicationStatus;
  submittedAt: string;
  decision: VendorApplicationStatus | null;
  offeredSpace: VendorSpaceId | null;
  price: number | null;
  paymentDue: string | null;
  paymentStatus: VendorPaymentStatus;
};
