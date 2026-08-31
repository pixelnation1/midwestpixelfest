import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { event } from "@/lib/site";

function publicTicketUrl(): string | null {
  if (!event.ticketUrl) return null;
  const parsed = parseAllowedHttpUrl(event.ticketUrl);
  return parsed ? parsed.toString() : null;
}

/** Validated public checkout URL, or null until a real http(s) Ticketleap URL is set. */
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

/**
 * Nav / hero: always a working click target.
 * Purchase: "Buy Tickets" when ticketUrl is set, otherwise checkout-finalizing copy.
 */
export function getTicketAction(intent: "nav" | "purchase" = "nav"): TicketAction {
  const checkout = publicTicketUrl();
  if (checkout) {
    return {
      href: checkout,
      label: "Buy Tickets",
      external: true,
    };
  }

  return {
    href: "/tickets",
    label: intent === "purchase" ? "Checkout Being Finalized" : "Tickets",
    external: false,
  };
}
