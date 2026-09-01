import { event, site } from "@/lib/site";
import { formatVendorPrice } from "@/lib/vendors";
import { formatCalendarDateLong } from "@/lib/vendor-ops/dates";
import { formatSpaceLabel } from "@/lib/vendor-ops/pricing";
import { VENDOR_PRICING_TIER_LABELS } from "@/lib/vendor-ops/status";
import type { VendorOffer } from "@/lib/vendor-ops/types";
import { effectivePaymentDueOn } from "@/lib/vendor-ops/workflow";

/**
 * Plain-text summary for manual Square Invoice entry.
 * Does not call the Square API.
 */
export function buildSquareInvoiceSummary(offer: VendorOffer): string {
  const due = formatCalendarDateLong(effectivePaymentDueOn(offer));
  const lines = [
    "MIDWEST PIXEL FEST 2027",
    "",
    `Vendor:`,
    offer.businessName,
    "",
    `Application:`,
    offer.applicationReference,
    "",
    `Space:`,
    formatSpaceLabel(offer.offeredSpace),
    "",
    `Pricing:`,
    VENDOR_PRICING_TIER_LABELS[offer.snapshot.pricingTier],
    "",
    `Booth:`,
    formatVendorPrice(offer.snapshot.basePrice),
  ];

  for (const addOn of offer.snapshot.addOns) {
    lines.push("");
    lines.push(`${addOn.name} × ${addOn.quantity}:`);
    lines.push(formatVendorPrice(addOn.lineTotal));
  }

  if (offer.snapshot.electricityRequested) {
    lines.push("");
    lines.push("Electricity:");
    lines.push("Pricing TBA — not invoiced until electrical pricing is published.");
  }

  lines.push("");
  lines.push("Total:");
  lines.push(formatVendorPrice(offer.snapshot.total));
  lines.push("");
  lines.push("Payment Due:");
  lines.push(due);
  lines.push("");
  lines.push("Event:");
  lines.push(`${site.dateLabel}`);
  lines.push(site.location);
  if (!event.venue) {
    lines.push("Venue TBA");
  }

  return lines.join("\n");
}

export function publicInvoiceFields(offer: VendorOffer): {
  amountDue: number;
  paymentDueOn: string;
  spaceLabel: string;
} {
  return {
    amountDue: offer.snapshot.total,
    paymentDueOn: effectivePaymentDueOn(offer),
    spaceLabel: formatSpaceLabel(offer.offeredSpace),
  };
}
