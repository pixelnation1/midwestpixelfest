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

/**
 * No-op until a real analytics provider is wired.
 * Call this from CTAs and form success handlers.
 */
export function trackEvent(
  name: AnalyticsEventName,
  payload?: Record<string, string | number | boolean>,
): void {
  void name;
  void payload;
}
