import {
  foundingVendorDeadline,
  formatVendorPrice,
  vendorAddOns,
  vendorPaymentWindowDays,
  vendorPricing,
  vendorSpaces,
  type VendorSpace,
  type VendorSpaceId,
} from "@/lib/vendors";
import {
  addCalendarDays,
  chicagoCalendarDateFromInstant,
  isOnOrBefore,
} from "@/lib/vendor-ops/dates";
import type { VendorPricingTier } from "@/lib/vendor-ops/status";
import type {
  VendorOfferAddOn,
  VendorPriceSnapshot,
} from "@/lib/vendor-ops/types";

export type CreatePriceSnapshotInput = {
  offeredSpace: VendorSpaceId;
  extraBadges: number;
  extraTables: number;
  electricityRequested: boolean;
  offerIssuedAt: Date | string;
  pricingTier?: VendorPricingTier;
  customBasePrice?: number;
};

export function isFoundingPricingActiveOn(calendarDate: string): boolean {
  return isOnOrBefore(calendarDate, foundingVendorDeadline);
}

export function resolvePricingTier(
  space: VendorSpace,
  offerIssuedOn: string,
  requestedTier?: VendorPricingTier,
): VendorPricingTier {
  if (requestedTier === "custom") return "custom";
  if (requestedTier === "regular") return "regular";
  if (requestedTier === "founding") {
    return space.founding != null ? "founding" : "regular";
  }
  if (space.founding != null && isFoundingPricingActiveOn(offerIssuedOn)) {
    return "founding";
  }
  return "regular";
}

export function basePriceForTier(
  space: VendorSpace,
  tier: VendorPricingTier,
  customBasePrice?: number,
): number {
  if (tier === "custom") {
    if (customBasePrice == null || customBasePrice < 0) {
      throw new Error("Custom pricing requires a non-negative base price.");
    }
    return customBasePrice;
  }
  if (tier === "founding") {
    if (space.founding == null) {
      return space.regular;
    }
    return space.founding;
  }
  return space.regular;
}

export function snapshotAddOns(
  extraBadges: number,
  extraTables: number,
): VendorOfferAddOn[] {
  const badges = Math.max(0, Math.floor(extraBadges));
  const tables = Math.max(0, Math.floor(extraTables));
  const lines: VendorOfferAddOn[] = [];
  const badge = vendorAddOns.find((item) => item.id === "extraBadge");
  const table = vendorAddOns.find((item) => item.id === "extraTable");
  if (badges > 0 && badge?.price != null) {
    lines.push({
      id: "extraBadge",
      name: badge.name,
      quantity: badges,
      unitPrice: vendorPricing.extraBadge,
      lineTotal: vendorPricing.extraBadge * badges,
    });
  }
  if (tables > 0 && table?.price != null) {
    lines.push({
      id: "extraTable",
      name: table.name,
      quantity: tables,
      unitPrice: vendorPricing.extraTable,
      lineTotal: vendorPricing.extraTable * tables,
    });
  }
  return lines;
}

export function createPriceSnapshot(
  input: CreatePriceSnapshotInput,
): VendorPriceSnapshot {
  const space = vendorSpaces.find((item) => item.id === input.offeredSpace);
  if (!space) {
    throw new Error("Unknown offered space.");
  }
  if (input.extraBadges < 0 || input.extraTables < 0) {
    throw new Error("Add-on quantities cannot be negative.");
  }

  const offerIssuedOn = chicagoCalendarDateFromInstant(input.offerIssuedAt);
  const pricingTier = resolvePricingTier(space, offerIssuedOn, input.pricingTier);
  if (pricingTier === "custom" && input.customBasePrice == null) {
    throw new Error("Custom pricing requires a base price.");
  }

  const basePrice = basePriceForTier(space, pricingTier, input.customBasePrice);
  const addOns = snapshotAddOns(input.extraBadges, input.extraTables);
  const addOnTotal = addOns.reduce((sum, line) => sum + line.lineTotal, 0);
  const paymentDueOn = addCalendarDays(offerIssuedOn, vendorPaymentWindowDays);

  return {
    spaceId: space.id,
    spaceName: space.name,
    dimensions: space.dimensions,
    pricingTier,
    basePrice,
    addOns,
    electricityRequested: input.electricityRequested,
    electricityPrice: null,
    total: basePrice + addOnTotal,
    offerIssuedOn,
    paymentDueOn,
    foundingDeadlineAtIssue: foundingVendorDeadline,
    locked: true,
  };
}

/** Live catalog price for a new offer. Never use this to mutate a locked snapshot. */
export function liveSpacePrice(
  spaceId: VendorSpaceId,
  offerIssuedOn: string,
): { tier: VendorPricingTier; price: number } {
  const space = vendorSpaces.find((item) => item.id === spaceId);
  if (!space) throw new Error("Unknown space.");
  const tier = resolvePricingTier(space, offerIssuedOn);
  return { tier, price: basePriceForTier(space, tier) };
}

export function formatSpaceLabel(spaceId: VendorSpaceId): string {
  const space = vendorSpaces.find((item) => item.id === spaceId);
  if (!space) return spaceId;
  return space.dimensions ? `${space.name} — ${space.dimensions}` : space.name;
}

export function formatLockedPriceLine(snapshot: VendorPriceSnapshot): string {
  return `${formatVendorPrice(snapshot.basePrice)} ${
    snapshot.pricingTier === "founding"
      ? "Founding Vendor Rate"
      : snapshot.pricingTier === "custom"
        ? "custom"
        : "regular"
  }`;
}
