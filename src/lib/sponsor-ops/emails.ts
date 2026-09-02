import { event, site } from "@/lib/site";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { formatSponsorshipAmount } from "@/lib/sponsorships";
import { formatCalendarDateLong } from "@/lib/vendor-ops/dates";
import type { SponsorshipCommitmentSnapshot, SponsorshipRecord } from "@/lib/sponsor-ops/types";

export type SponsorLifecycleEmailKind =
  | "next_steps"
  | "commitment_confirmation"
  | "invoice_sent"
  | "payment_received"
  | "asset_request"
  | "asset_received";

export type SponsorLifecycleEmail = {
  kind: SponsorLifecycleEmailKind;
  subject: string;
  text: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function wrapHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Georgia,'Times New Roman',serif;color:#111;">
  <div style="max-width:640px;margin:0 auto;background:#fff;padding:24px 28px;border:1px solid #e5e5e5;">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#666;">Midwest Pixel Fest</p>
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;">${escapeHtml(title)}</h1>
    ${bodyHtml}
  </div>
</body>
</html>`;
}

function paragraphsHtml(lines: string[]): string {
  return lines
    .map(
      (line) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#222;">${escapeHtml(line)}</p>`,
    )
    .join("");
}

function eventFooter(): string[] {
  return [`Event: ${site.dateLabel}`, site.location, event.venue ? event.venue.name : "Venue TBA"];
}

function dueLabel(snapshot: SponsorshipCommitmentSnapshot): string {
  return snapshot.paymentDueAt
    ? formatCalendarDateLong(snapshot.paymentDueAt)
    : "Midwest Pixel Fest will confirm the payment due date in writing.";
}

function benefitSummary(snapshot: SponsorshipCommitmentSnapshot): string[] {
  const included = snapshot.includedBenefits
    .filter((item) => item.status === "included")
    .map((item) => item.label);
  const custom = snapshot.customBenefits.map((item) => item.label);
  const lines = [
    included.length > 0
      ? `Included benefits: ${included.join("; ")}.`
      : "Included benefits follow the agreed custom sponsorship terms.",
  ];
  if (custom.length > 0) {
    lines.push(`Approved custom benefits: ${custom.join("; ")}.`);
  }
  if (snapshot.areasSponsored.length > 0) {
    lines.push(`Approved sponsorship area: ${snapshot.areasSponsored.join(", ")}.`);
  }
  return lines;
}

export function buildSponsorNextStepsEmail(record: SponsorshipRecord): SponsorLifecycleEmail {
  const snapshot = record.commitment;
  const packageName = snapshot?.packageName ?? record.selectedLevel ?? "sponsorship discussion";
  const amount = snapshot ? formatSponsorshipAmount(snapshot.agreedAmount) : "to be confirmed in writing";
  const textLines = [
    `Thank you, ${record.businessName}.`,
    `Sponsor reference: ${record.reference}`,
    `Sponsorship: ${packageName}`,
    `Agreed amount: ${amount}`,
    ...(snapshot ? benefitSummary(snapshot) : []),
    snapshot ? `Payment deadline: ${dueLabel(snapshot)}` : "Payment terms will be confirmed if a partnership is agreed.",
    "A Square invoice or payment request will be sent separately after this commitment is finalized, or has been sent if invoicing has already started.",
    "This message confirms next steps. It is not a substitute for the final sponsorship agreement.",
    ...eventFooter(),
  ];
  return {
    kind: "next_steps",
    subject: "Midwest Pixel Fest 2027 Sponsorship — Next Steps",
    text: textLines.join("\n\n"),
    html: wrapHtml("Sponsorship next steps", paragraphsHtml(textLines)),
  };
}

export function buildSponsorCommitmentEmail(record: SponsorshipRecord): SponsorLifecycleEmail {
  if (!record.commitment) {
    throw new Error("Commitment email requires a commitment snapshot.");
  }
  const snapshot = record.commitment;
  const textLines = [
    `${snapshot.businessName} is confirmed as committed for Midwest Pixel Fest 2027.`,
    `Sponsor reference: ${snapshot.sponsorReference}`,
    `Sponsorship: ${snapshot.packageName}`,
    `Agreed amount: ${formatSponsorshipAmount(snapshot.agreedAmount)}`,
    ...benefitSummary(snapshot),
    `Payment deadline: ${dueLabel(snapshot)}`,
    "This commitment confirms the sponsorship package and benefits agreed upon between the sponsor and Midwest Pixel Fest, subject to the final sponsorship agreement and applicable event policies.",
    "Payment instructions / a Square invoice will be provided separately or have been sent, depending on status.",
    ...eventFooter(),
  ];
  return {
    kind: "commitment_confirmation",
    subject: "Midwest Pixel Fest 2027 Sponsorship Commitment",
    text: textLines.join("\n\n"),
    html: wrapHtml("Sponsorship commitment", paragraphsHtml(textLines)),
  };
}

export function buildSponsorInvoiceSentEmail(record: SponsorshipRecord): SponsorLifecycleEmail {
  if (!record.commitment) {
    throw new Error("Invoice email requires a commitment snapshot.");
  }
  const snapshot = record.commitment;
  const url = record.invoice.squareInvoiceUrl;
  const paymentUrl = url ? parseAllowedHttpUrl(url) : null;
  const textLines = [
    `${snapshot.businessName}, your Midwest Pixel Fest 2027 sponsorship invoice is ready.`,
    `Sponsor reference: ${snapshot.sponsorReference}`,
    `Sponsorship: ${snapshot.packageName}`,
    `Amount: ${formatSponsorshipAmount(record.invoice.amountInvoiced ?? snapshot.agreedAmount)}`,
    `Payment due: ${dueLabel(snapshot)}`,
    paymentUrl
      ? `Payment link: ${paymentUrl.toString()}`
      : "Midwest Pixel Fest will share the Square invoice or payment request separately. This email does not include card fields.",
    ...eventFooter(),
  ];
  return {
    kind: "invoice_sent",
    subject: "Your Midwest Pixel Fest 2027 Sponsorship Invoice",
    text: textLines.join("\n\n"),
    html: wrapHtml("Sponsorship invoice", paragraphsHtml(textLines)),
  };
}

export function buildSponsorPaymentReceivedEmail(record: SponsorshipRecord): SponsorLifecycleEmail {
  if (!record.commitment) {
    throw new Error("Payment email requires a commitment snapshot.");
  }
  const snapshot = record.commitment;
  const textLines = [
    `Thank you, ${snapshot.businessName}. Midwest Pixel Fest has recorded your sponsorship payment.`,
    `Sponsor reference: ${snapshot.sponsorReference}`,
    `Sponsorship: ${snapshot.packageName}`,
    `Amount received: ${formatSponsorshipAmount(record.amountPaid ?? snapshot.agreedAmount)}`,
    "The next step is marketing asset collection: logo, website, public business description, social links, and a marketing contact.",
    "Midwest Pixel Fest will share asset instructions. Do not send card or bank details in reply to this email.",
    ...eventFooter(),
  ];
  return {
    kind: "payment_received",
    subject: "Sponsorship payment received — Midwest Pixel Fest 2027",
    text: textLines.join("\n\n"),
    html: wrapHtml("Sponsorship payment received", paragraphsHtml(textLines)),
  };
}

export function buildSponsorAssetRequestEmail(record: SponsorshipRecord): SponsorLifecycleEmail {
  const textLines = [
    `${record.businessName}, we need your Midwest Pixel Fest 2027 sponsor assets.`,
    `Sponsor reference: ${record.reference}`,
    "Please provide:",
    "Logo (SVG, PNG, or PDF preferred; transparent high-resolution artwork when available)",
    "Website",
    "Public business description",
    "Social links",
    "Marketing contact",
    "A secure upload link will be sent when file storage is connected. Until then, Midwest Pixel Fest will tell you how to deliver files.",
    ...eventFooter(),
  ];
  return {
    kind: "asset_request",
    subject: "We need your Midwest Pixel Fest 2027 sponsor assets",
    text: textLines.join("\n\n"),
    html: wrapHtml("We need your sponsor assets", paragraphsHtml(textLines)),
  };
}

export function buildSponsorAssetReceivedEmail(record: SponsorshipRecord): SponsorLifecycleEmail {
  const textLines = [
    `Thank you, ${record.businessName}. Midwest Pixel Fest has received your sponsor materials.`,
    `Sponsor reference: ${record.reference}`,
    "These materials will be reviewed and prepared for applicable event recognition. Midwest Pixel Fest may edit the public description for length, formatting, and clarity without materially changing its meaning.",
    "We will not promise an exact publication date until recognition is scheduled.",
    ...eventFooter(),
  ];
  return {
    kind: "asset_received",
    subject: "Sponsor assets received — Midwest Pixel Fest 2027",
    text: textLines.join("\n\n"),
    html: wrapHtml("Sponsor assets received", paragraphsHtml(textLines)),
  };
}
