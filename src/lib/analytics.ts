export const ANALYTICS_EVENTS = {
  ticket_click: "ticket_click",
  newsletter_signup: "newsletter_signup",
  vendor_interest_start: "vendor_interest_start",
  vendor_interest_submit: "vendor_interest_submit",
  vendor_application_start: "vendor_application_start",
  vendor_application_submit: "vendor_application_submit",
  artist_application_start: "artist_application_start",
  artist_application_submit: "artist_application_submit",
  vendor_application_reviewed: "vendor_application_reviewed",
  vendor_application_approved: "vendor_application_approved",
  vendor_application_waitlisted: "vendor_application_waitlisted",
  vendor_application_declined: "vendor_application_declined",
  vendor_invoice_sent: "vendor_invoice_sent",
  vendor_payment_confirmed: "vendor_payment_confirmed",
  sponsor_inquiry_submit: "sponsor_inquiry_submit",
  volunteer_interest_submit: "volunteer_interest_submit",
  guest_inquiry_submit: "guest_inquiry_submit",
  press_inquiry_submit: "press_inquiry_submit",
  contact_submit: "contact_submit",
  sponsor_page_view: "sponsor_page_view",
  sponsor_package_select: "sponsor_package_select",
  sponsor_inquiry_start: "sponsor_inquiry_start",
  sponsor_custom_partnership_click: "sponsor_custom_partnership_click",
  sponsor_interest_area_select: "sponsor_interest_area_select",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

const GA_PATTERN = /^G-[A-Z0-9]+$/;

export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
  GA_PATTERN.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : null;

const PII_PAYLOAD_KEYS = new Set([
  "name",
  "email",
  "phone",
  "address",
  "company",
  "contact",
  "contactName",
  "firstName",
  "marketingEmail",
  "marketingContact",
  "displayName",
  "businessName",
  "website",
  "social",
  "socialMedia",
  "whatYouSell",
  "description",
  "street",
  "city",
  "state",
  "zip",
  "country",
  "legalName",
  "electronicSignature",
  "signature",
  "signatureBusinessName",
  "primaryRepName",
  "additionalRepNames",
  "shareBusinessName",
  "shareContactName",
  "shareEmail",
  "shareDescription",
  "socialPrimary",
  "socialAdditional",
  "businessDescription",
  "priorEvents",
  "mysteryDescription",
  "aiDescription",
  "tallDisplayDescription",
  "boothSetupNotes",
  "additionalSpaceDetails",
  "hoursExplanation",
  "invoiceUrl",
  "squareInvoiceUrl",
  "squareInvoiceId",
  "internalNote",
  "internalNotes",
  "internalReason",
  "paymentMethodOrReference",
  "customPricingInternalNote",
]);

function sanitizeEventPayload(
  payload?: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> | undefined {
  if (!payload) return undefined;
  const next: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (PII_PAYLOAD_KEYS.has(key)) continue;
    if (typeof value === "string" && value.includes("@")) continue;
    next[key] = value;
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

/**
 * No-op unless GA4 is configured and gtag is on the page.
 * Never throws. Safe to call from client click handlers.
 * Never sends names, emails, phones, addresses, or business contact details.
 */
export function trackEvent(
  name: AnalyticsEventName,
  payload?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  if (!gaMeasurementId) return;
  const gtag = (
    window as Window & { gtag?: (...args: unknown[]) => void }
  ).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, sanitizeEventPayload(payload));
}
