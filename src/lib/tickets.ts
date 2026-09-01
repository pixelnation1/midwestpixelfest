import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { event } from "@/lib/site";

function publicTicketUrl(): string | null {
  if (!event.ticketUrl) return null;
  const parsed = parseAllowedHttpUrl(event.ticketUrl);
  return parsed ? parsed.toString() : null;
}

/** Validated public checkout URL, or null if ticketUrl is unset or not a safe http(s) URL. */
export function getPublicTicketUrl(): string | null {
  return publicTicketUrl();
}

export function isTicketSalesOpen(): boolean {
  return Boolean(publicTicketUrl());
}

export type TicketAction = {
  href: string;
  label: string;
  external: boolean;
};

export type TicketCtaIntent = "nav" | "purchase";

/**
 * Nav / hero: label stays "Tickets".
 * Purchase: "Get Tickets" when checkout is live, otherwise fallback copy.
 * All live purchase/nav destinations read event.ticketUrl through getPublicTicketUrl().
 */
export function getTicketAction(intent: TicketCtaIntent = "nav"): TicketAction {
  const checkout = publicTicketUrl();
  if (checkout) {
    return {
      href: checkout,
      label: intent === "purchase" ? "Get Tickets" : "Tickets",
      external: true,
    };
  }

  return {
    href: "/tickets",
    label: intent === "purchase" ? "Checkout Being Finalized" : "Tickets",
    external: false,
  };
}
