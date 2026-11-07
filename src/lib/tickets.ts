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
 * Nav / hero: always route through the internal Tickets page so attendees
 * see venue-booking disclosures before leaving for checkout.
 * Purchase: "Get Tickets" when checkout is live, otherwise fallback copy.
 * Only explicit purchase actions link directly to the validated checkout URL.
 */
export function getTicketAction(intent: TicketCtaIntent = "nav"): TicketAction {
  const checkout = publicTicketUrl();
  if (intent === "nav") {
    return {
      href: "/tickets",
      label: "Tickets",
      external: false,
    };
  }

  if (checkout) {
    return {
      href: checkout,
      label: "Get Tickets",
      external: true,
    };
  }

  return {
    href: "/tickets",
    label: intent === "purchase" ? "Ticket Sales On Hold" : "Tickets",
    external: false,
  };
}
