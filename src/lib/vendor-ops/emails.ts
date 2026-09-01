import { event, site } from "@/lib/site";
import { formatVendorPrice, vendorPaymentWindowDays } from "@/lib/vendors";
import type { OfficialApplicationType } from "@/lib/vendor-application";
import { formatCalendarDateLong } from "@/lib/vendor-ops/dates";
import { formatSpaceLabel } from "@/lib/vendor-ops/pricing";
import { VENDOR_PRICING_TIER_LABELS } from "@/lib/vendor-ops/status";
import type { VendorOffer } from "@/lib/vendor-ops/types";
import { effectivePaymentDueOn } from "@/lib/vendor-ops/workflow";

export type VendorLifecycleEmailKind =
  | "approval"
  | "waitlist"
  | "decline"
  | "payment_reminder"
  | "payment_overdue"
  | "payment_confirmation";

export type VendorLifecycleEmail = {
  kind: VendorLifecycleEmailKind;
  subject: string;
  text: string;
  html: string;
};

type AddOnLine = { label: string; amount: number };

export type ApprovalEmailInput = {
  applicationType: OfficialApplicationType;
  businessName: string;
  applicationReference: string;
  offeredSpaceLabel: string;
  pricingTierLabel: string;
  basePrice: number;
  addOns: readonly AddOnLine[];
  total: number;
  paymentDueLabel: string;
  invoiceState: "will_send" | "sent";
};

export type WaitlistEmailInput = {
  businessName: string;
  applicationReference: string;
  waitlistPosition?: number | null;
};

export type DeclineEmailInput = {
  businessName: string;
  applicationReference: string;
  publicNote?: string | null;
};

export type PaymentReminderEmailInput = {
  businessName: string;
  applicationReference: string;
  spaceLabel: string;
  amountDue: number;
  paymentDueLabel: string;
};

export type PaymentOverdueEmailInput = {
  businessName: string;
  applicationReference: string;
  spaceLabel: string;
  amountDue: number;
  paymentDueLabel: string;
};

export type PaymentConfirmationEmailInput = {
  businessName: string;
  applicationReference: string;
  spaceLabel: string;
  amountPaid: number;
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
  return [
    `Event: ${site.dateLabel}`,
    site.location,
    event.venue ? event.venue.name : "Venue TBA",
  ];
}

export function buildApprovalEmail(input: ApprovalEmailInput): VendorLifecycleEmail {
  const hallOrAlley =
    input.applicationType === "Artist Alley" ? "Artist Alley" : "Vendor Hall";
  const subject = `You're Approved — Midwest Pixel Fest 2027 ${hallOrAlley}`;
  const invoiceLine =
    input.invoiceState === "sent"
      ? "A Square invoice / payment request has been sent separately."
      : "A Square invoice / payment request will be sent separately.";
  const addOnLines =
    input.addOns.length > 0
      ? input.addOns.map(
          (line) => `${line.label}: ${formatVendorPrice(line.amount)}`,
        )
      : ["Approved add-ons: none"];

  const textLines = [
    `Congratulations — ${input.businessName} has been approved for Midwest Pixel Fest 2027.`,
    `Application reference: ${input.applicationReference}`,
    `Approved space: ${input.offeredSpaceLabel}`,
    `Pricing: ${input.pricingTierLabel}`,
    `Booth / table: ${formatVendorPrice(input.basePrice)}`,
    ...addOnLines,
    `Total amount due: ${formatVendorPrice(input.total)}`,
    `Payment deadline: ${input.paymentDueLabel}`,
    `Your space is not confirmed until payment is received.`,
    invoiceLine,
    "Please review the vendor terms included with your acceptance before submitting payment.",
    ...eventFooter(),
  ];

  return {
    kind: "approval",
    subject,
    text: textLines.join("\n\n"),
    html: wrapHtml(
      `You're approved — ${hallOrAlley}`,
      paragraphsHtml(textLines),
    ),
  };
}

export function buildWaitlistEmail(input: WaitlistEmailInput): VendorLifecycleEmail {
  const position =
    typeof input.waitlistPosition === "number" && input.waitlistPosition > 0
      ? `Your waitlist position is ${input.waitlistPosition}.`
      : null;
  const textLines = [
    `Thank you for applying, ${input.businessName}.`,
    `Application reference: ${input.applicationReference}`,
    "Your application has been placed on the waitlist.",
    "No payment is required at this time.",
    "Being waitlisted does not guarantee future placement.",
    "If space becomes available, Midwest Pixel Fest will contact you.",
    ...(position ? [position] : []),
    ...eventFooter(),
  ];
  return {
    kind: "waitlist",
    subject: "Midwest Pixel Fest 2027 Vendor Application — Waitlist Update",
    text: textLines.join("\n\n"),
    html: wrapHtml("Waitlist update", paragraphsHtml(textLines)),
  };
}

export function buildDeclineEmail(input: DeclineEmailInput): VendorLifecycleEmail {
  const textLines = [
    `Thank you for your interest in Midwest Pixel Fest 2027, ${input.businessName}.`,
    `Application reference: ${input.applicationReference}`,
    "After reviewing this year's applications and available space, we're unable to offer your application a space at this time.",
    ...(input.publicNote?.trim() ? [input.publicNote.trim()] : []),
    ...eventFooter(),
  ];
  return {
    kind: "decline",
    subject: "Midwest Pixel Fest 2027 Vendor Application Update",
    text: textLines.join("\n\n"),
    html: wrapHtml("Application update", paragraphsHtml(textLines)),
  };
}

export function buildPaymentReminderEmail(
  input: PaymentReminderEmailInput,
): VendorLifecycleEmail {
  const textLines = [
    `This is a reminder that payment for ${input.businessName} is still due.`,
    `Application reference: ${input.applicationReference}`,
    `Space: ${input.spaceLabel}`,
    `Amount due: ${formatVendorPrice(input.amountDue)}`,
    `Payment deadline: ${input.paymentDueLabel}`,
    "Your space is not confirmed until payment is received.",
    ...eventFooter(),
  ];
  return {
    kind: "payment_reminder",
    subject: "Payment reminder — Midwest Pixel Fest 2027 vendor space",
    text: textLines.join("\n\n"),
    html: wrapHtml("Payment reminder", paragraphsHtml(textLines)),
  };
}

export function buildPaymentOverdueEmail(
  input: PaymentOverdueEmailInput,
): VendorLifecycleEmail {
  const textLines = [
    "Your payment deadline has passed and your space may be released.",
    `Application reference: ${input.applicationReference}`,
    `Space: ${input.spaceLabel}`,
    `Amount due: ${formatVendorPrice(input.amountDue)}`,
    `Original payment deadline: ${input.paymentDueLabel}`,
    "Please contact Midwest Pixel Fest if you still intend to participate.",
    "This notice does not automatically cancel your space.",
    ...eventFooter(),
  ];
  return {
    kind: "payment_overdue",
    subject: "Payment deadline passed — Midwest Pixel Fest 2027",
    text: textLines.join("\n\n"),
    html: wrapHtml("Payment deadline passed", paragraphsHtml(textLines)),
  };
}

export function buildPaymentConfirmationEmail(
  input: PaymentConfirmationEmailInput,
): VendorLifecycleEmail {
  const textLines = [
    `You're confirmed for Midwest Pixel Fest 2027, ${input.businessName}.`,
    `Application reference: ${input.applicationReference}`,
    `Space: ${input.spaceLabel}`,
    `Amount paid: ${formatVendorPrice(input.amountPaid)}`,
    ...eventFooter(),
    "Additional vendor packet information, setup instructions, load-in details, and venue-specific requirements will be provided later.",
  ];
  return {
    kind: "payment_confirmation",
    subject: "You're confirmed for Midwest Pixel Fest 2027",
    text: textLines.join("\n\n"),
    html: wrapHtml("You're confirmed", paragraphsHtml(textLines)),
  };
}

export function approvalEmailFromOffer(
  offer: VendorOffer,
  invoiceState: "will_send" | "sent",
): VendorLifecycleEmail {
  return buildApprovalEmail({
    applicationType: offer.applicationType,
    businessName: offer.businessName,
    applicationReference: offer.applicationReference,
    offeredSpaceLabel: formatSpaceLabel(offer.offeredSpace),
    pricingTierLabel: VENDOR_PRICING_TIER_LABELS[offer.snapshot.pricingTier],
    basePrice: offer.snapshot.basePrice,
    addOns: offer.snapshot.addOns.map((line) => ({
      label: `${line.name} × ${line.quantity}`,
      amount: line.lineTotal,
    })),
    total: offer.snapshot.total,
    paymentDueLabel: formatCalendarDateLong(effectivePaymentDueOn(offer)),
    invoiceState,
  });
}

export function paymentReminderFromOffer(offer: VendorOffer): VendorLifecycleEmail {
  return buildPaymentReminderEmail({
    businessName: offer.businessName,
    applicationReference: offer.applicationReference,
    spaceLabel: formatSpaceLabel(offer.offeredSpace),
    amountDue: offer.snapshot.total,
    paymentDueLabel: formatCalendarDateLong(effectivePaymentDueOn(offer)),
  });
}

export function paymentOverdueFromOffer(offer: VendorOffer): VendorLifecycleEmail {
  return buildPaymentOverdueEmail({
    businessName: offer.businessName,
    applicationReference: offer.applicationReference,
    spaceLabel: formatSpaceLabel(offer.offeredSpace),
    amountDue: offer.snapshot.total,
    paymentDueLabel: formatCalendarDateLong(effectivePaymentDueOn(offer)),
  });
}

export function paymentConfirmationFromOffer(
  offer: VendorOffer,
  amountPaid: number,
): VendorLifecycleEmail {
  return buildPaymentConfirmationEmail({
    businessName: offer.businessName,
    applicationReference: offer.applicationReference,
    spaceLabel: formatSpaceLabel(offer.offeredSpace),
    amountPaid,
  });
}

export const vendorPaymentWindowCopy = `${vendorPaymentWindowDays} calendar days`;
