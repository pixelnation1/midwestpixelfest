import { event, site } from "@/lib/site";
import { formatSponsorshipAmount } from "@/lib/sponsorships";
import { formatCalendarDateLong } from "@/lib/vendor-ops/dates";
import type { SponsorshipRecord } from "@/lib/sponsor-ops/types";

/**
 * Plain-text summary for manual Square Invoice entry.
 * Does not call the Square API.
 */
export function buildSponsorSquareInvoiceSummary(record: SponsorshipRecord): string {
  const snapshot = record.commitment;
  if (!snapshot) {
    throw new Error("Cannot build an invoice summary before commitment.");
  }
  const due = snapshot.paymentDueAt
    ? formatCalendarDateLong(snapshot.paymentDueAt)
    : "To be set by Midwest Pixel Fest";
  const area = snapshot.areasSponsored[0];
  const lines = [
    "MIDWEST PIXEL FEST 2027",
    "SPONSORSHIP",
    "",
    "Sponsor:",
    snapshot.businessName,
    "",
    "Reference:",
    snapshot.sponsorReference,
    "",
    "Sponsorship:",
    snapshot.packageName,
    "",
    "Amount:",
    formatSponsorshipAmount(snapshot.agreedAmount),
  ];

  if (area) {
    lines.push("");
    lines.push("Approved Area:");
    lines.push(area);
  }

  lines.push("");
  lines.push("Event:");
  lines.push(site.dateLabel);
  lines.push(site.location);
  if (!event.venue) {
    lines.push("Venue TBA");
  }
  lines.push("");
  lines.push("Payment Due:");
  lines.push(due);

  return lines.join("\n");
}
