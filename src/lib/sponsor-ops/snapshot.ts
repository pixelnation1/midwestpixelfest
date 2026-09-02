import {
  BENEFIT_CATALOG,
  SPONSORSHIP_CUSTOM_BENEFIT_TYPE_LABELS,
  formatSponsorshipAmount,
  getPackageById,
  sponsorshipAgreementVersion,
  sponsorshipContractingEntityStatus,
  type SponsorshipCustomBenefitType,
} from "@/lib/sponsorships";
import type {
  ApprovedCustomBenefit,
  ExcludedBenefit,
  SnapshotBenefit,
  SponsorExclusivity,
  SponsorshipCommitmentSnapshot,
} from "@/lib/sponsor-ops/types";

export type CreateCommitmentSnapshotInput = {
  sponsorReference: string;
  businessName: string;
  packageId: string;
  agreedAmount?: number;
  amountOverrideInternalNote?: string;
  customBenefits?: readonly Omit<ApprovedCustomBenefit, "organizerApproved">[];
  excludedOrNotApprovedBenefits?: readonly ExcludedBenefit[];
  areasSponsored?: readonly string[];
  exclusivity?: SponsorExclusivity;
  committedAt: Date | string;
  paymentDueAt: string | null;
};

function toIso(value: Date | string): string {
  return typeof value === "string" ? value : value.toISOString();
}

function snapshotBenefitsForPackage(packageId: string): SnapshotBenefit[] {
  const pkg = getPackageById(packageId);
  if (!pkg) return [];
  return pkg.benefits
    .filter((item) => item.status !== "not_included")
    .map((item) => ({
      benefitId: item.benefitId,
      label: BENEFIT_CATALOG.find((def) => def.id === item.benefitId)?.label ?? item.benefitId,
      status: item.status,
      ...(item.detail ? { detail: item.detail } : {}),
    }));
}

export function resolveCommittedAmount(input: {
  packageId: string;
  agreedAmount?: number;
}): number {
  const pkg = getPackageById(input.packageId);
  if (!pkg) {
    throw new Error("Unknown sponsorship package.");
  }
  if (input.agreedAmount != null) {
    if (!Number.isFinite(input.agreedAmount) || input.agreedAmount <= 0) {
      throw new Error("Agreed amount must be a positive number.");
    }
    if (pkg.id === "presenting" && input.agreedAmount < (pkg.price ?? 0)) {
      throw new Error("Presenting sponsorship amount must be at least the listed starting amount.");
    }
    return Math.round(input.agreedAmount);
  }
  if (pkg.price == null) {
    throw new Error("Custom sponsorships require an agreed amount.");
  }
  return pkg.price;
}

export function createCommitmentSnapshot(
  input: CreateCommitmentSnapshotInput,
): SponsorshipCommitmentSnapshot {
  const pkg = getPackageById(input.packageId);
  if (!pkg) {
    throw new Error("Unknown sponsorship package.");
  }
  const listedIsFloor = Boolean(pkg.priceLabel);
  if (
    input.agreedAmount != null &&
    pkg.price != null &&
    !listedIsFloor &&
    input.agreedAmount !== pkg.price &&
    !input.amountOverrideInternalNote?.trim()
  ) {
    throw new Error("A price different from the listed package requires an internal note.");
  }

  const agreedAmount = resolveCommittedAmount({
    packageId: input.packageId,
    agreedAmount: input.agreedAmount,
  });

  const customBenefits: ApprovedCustomBenefit[] = (input.customBenefits ?? []).map(
    (benefit) => ({
      ...benefit,
      organizerApproved: true as const,
    }),
  );

  const exclusivity: SponsorExclusivity = input.exclusivity ?? { granted: false };
  if (exclusivity.granted && !exclusivity.category.trim()) {
    throw new Error("Granted exclusivity requires a category.");
  }
  if (exclusivity.granted && !exclusivity.internalDescription.trim()) {
    throw new Error("Granted exclusivity requires an internal description.");
  }

  return {
    sponsorReference: input.sponsorReference,
    businessName: input.businessName,
    packageId: pkg.id,
    packageName: pkg.name,
    agreedAmount,
    amountLabel: pkg.priceLabel && input.agreedAmount == null ? pkg.priceLabel : formatSponsorshipAmount(agreedAmount),
    includedBenefits: snapshotBenefitsForPackage(pkg.id),
    customBenefits,
    excludedOrNotApprovedBenefits: input.excludedOrNotApprovedBenefits ?? [],
    areasSponsored: input.areasSponsored ?? [],
    exclusivity,
    committedAt: toIso(input.committedAt),
    paymentDueAt: input.paymentDueAt,
    agreementVersion: sponsorshipAgreementVersion,
    contractingEntityStatus: sponsorshipContractingEntityStatus,
    locked: true,
  };
}

export function customBenefitLabel(type: SponsorshipCustomBenefitType): string {
  return SPONSORSHIP_CUSTOM_BENEFIT_TYPE_LABELS[type];
}

export function listedPackagePrice(packageId: string): number | null {
  return getPackageById(packageId)?.price ?? null;
}
