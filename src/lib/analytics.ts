export const ANALYTICS_EVENTS = {
  ticket_click: "ticket_click",
  newsletter_signup: "newsletter_signup",
  vendor_interest_submit: "vendor_interest_submit",
  sponsor_inquiry_submit: "sponsor_inquiry_submit",
  volunteer_interest_submit: "volunteer_interest_submit",
  guest_inquiry_submit: "guest_inquiry_submit",
  press_inquiry_submit: "press_inquiry_submit",
  contact_submit: "contact_submit",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

const GA_PATTERN = /^G-[A-Z0-9]+$/;

export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
  GA_PATTERN.test(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    : null;

/**
 * No-op unless GA4 is configured and gtag is on the page.
 * Never throws. Safe to call from client click handlers.
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
  gtag("event", name, payload);
}
