import type { BenefitId, BenefitStatus, SponsorshipCustomBenefitType } from "@/lib/sponsorships";
import type {
  SponsorAssetStatus,
  SponsorFulfillmentStatus,
  SponsorInvoiceStatus,
  SponsorshipStatus,
} from "@/lib/sponsor-ops/status";

export type StatusHistoryActor = "organizer" | "system" | "sponsor";

export type SponsorStatusHistoryEntry = {
  status: SponsorshipStatus;
  timestamp: string;
  note?: string;
  actor: StatusHistoryActor;
};

/** Internal-only. Never include in directory, sponsor emails, analytics, or public APIs. */
export type SponsorInternalNote = {
  id: string;
  createdAt: string;
  actor: string;
  body: string;
};

export type SnapshotBenefit = {
  benefitId: BenefitId;
  label: string;
  status: BenefitStatus;
  detail?: string;
};

export type ApprovedCustomBenefit = {
  id: string;
  type: SponsorshipCustomBenefitType;
  label: string;
  description: string;
  organizerApproved: true;
};

export type ExcludedBenefit = {
  benefitId?: BenefitId;
  label: string;
  note: string;
};

export type SponsorExclusivity =
  | { granted: false }
  | {
      granted: true;
      category: string;
      publicDescription: string | null;
      internalDescription: string;
    };

/**
 * Frozen commercial terms for one agreed sponsorship.
 * Do not re-read live sponsorshipPackages to change these after commit.
 */
export type SponsorshipCommitmentSnapshot = {
  sponsorReference: string;
  businessName: string;
  packageId: string;
  packageName: string;
  agreedAmount: number;
  amountLabel: string;
  includedBenefits: readonly SnapshotBenefit[];
  customBenefits: readonly ApprovedCustomBenefit[];
  excludedOrNotApprovedBenefits: readonly ExcludedBenefit[];
  areasSponsored: readonly string[];
  exclusivity: SponsorExclusivity;
  committedAt: string;
  paymentDueAt: string | null;
  agreementVersion: string;
  contractingEntityStatus: "pending_legal_review" | "confirmed";
  locked: true;
};

export type SponsorInvoiceRecord = {
  status: SponsorInvoiceStatus;
  squareInvoiceId: string | null;
  squareInvoiceUrl: string | null;
  createdAt: string | null;
  sentAt: string | null;
  dueOn: string | null;
  amountInvoiced: number | null;
  paidAt: string | null;
  amountPaid: number | null;
  paymentMethodOrReference: string | null;
};

export type SponsorLogoVariantId = "primary" | "light" | "dark" | "monochrome";

export type SponsorLogoFileMeta = {
  variant: SponsorLogoVariantId;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string | null;
};

export type SponsorAssetCollection = {
  status: SponsorAssetStatus;
  requestedAt: string | null;
  receivedAt: string | null;
  approvedAt: string | null;
  publicBusinessName: string | null;
  website: string | null;
  primarySocialUrl: string | null;
  additionalSocialUrl: string | null;
  publicDescription: string | null;
  marketingContactName: string | null;
  marketingContactEmail: string | null;
  marketingContactPhone: string | null;
  preferredPublicUrl: string | null;
  brandGuidelinesUrl: string | null;
  logos: readonly SponsorLogoFileMeta[];
  organizerEditedDescription: string | null;
};

export type SponsorFulfillmentItemId =
  | "website_recognition"
  | "social_recognition"
  | "signage"
  | "digital_materials"
  | "giveaway_opportunity"
  | "activation"
  | "sponsored_area_programming"
  | "dedicated_social_post"
  | "custom_other";

export type SponsorFulfillmentItem = {
  id: SponsorFulfillmentItemId;
  label: string;
  status: SponsorFulfillmentStatus;
};

export type SponsorDirectoryProfile = {
  publishInDirectory: boolean;
  displayName: string;
  levelLabel: string;
  packageId: string;
  logo: string | null;
  website: string | null;
  publicDescription: string | null;
  publicSocialUrl: string | null;
  sponsoredArea: string | null;
  featured: boolean;
  sortOrder: number;
};

export type SponsorCommitmentAcknowledgment = {
  acknowledgedAt: string | null;
  acknowledgedPaymentTerms: boolean;
  acknowledgedMarketingAssets: boolean;
  acknowledgedAgreement: boolean;
  representativeName: string | null;
  representativeTitle: string | null;
  signature: string | null;
  signatureDate: string | null;
};

/**
 * Operational record for future persistence.
 * Do not ship this object to the browser or log it in production.
 */
export type SponsorshipRecord = {
  reference: string;
  status: SponsorshipStatus;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  businessAddress: string | null;
  website: string | null;
  socialUrls: readonly string[];
  selectedLevel: string | null;
  customAmountProposed: string | null;
  areasOfInterest: readonly string[];
  inquiryReceivedAt: string;
  contactedAt: string | null;
  committedAt: string | null;
  invoiceCreatedAt: string | null;
  invoiceSentAt: string | null;
  paymentDueAt: string | null;
  paidAt: string | null;
  amountCommitted: number | null;
  amountInvoiced: number | null;
  amountPaid: number | null;
  assetsNeeded: boolean;
  assetsReceivedAt: string | null;
  activatedAt: string | null;
  activationOverride: boolean;
  activationOverrideReason: string | null;
  commitment: SponsorshipCommitmentSnapshot | null;
  invoice: SponsorInvoiceRecord;
  assets: SponsorAssetCollection;
  fulfillment: readonly SponsorFulfillmentItem[];
  acknowledgment: SponsorCommitmentAcknowledgment;
  directory: SponsorDirectoryProfile;
  publicDirectoryEnabled: boolean;
  history: SponsorStatusHistoryEntry[];
};

export type SponsorshipPrivateRecord = SponsorshipRecord & {
  internalNotes: SponsorInternalNote[];
};

/** Organizer review-table shape for a future authenticated admin UI. */
export type SponsorReviewListItem = {
  sponsorReference: string;
  businessName: string;
  contactName: string;
  selectedLevel: string | null;
  status: SponsorshipStatus;
  inquiryReceivedAt: string;
  amountCommitted: number | null;
  paymentDueAt: string | null;
  invoiceStatus: SponsorInvoiceStatus;
  assetStatus: SponsorAssetStatus;
};

export type PublicSponsorCard = {
  displayName: string;
  levelLabel: string;
  packageId: string;
  logo: string | null;
  website: string | null;
  publicDescription: string | null;
  publicSocialUrl: string | null;
  sponsoredArea: string | null;
  featured: boolean;
  sortOrder: number;
};
