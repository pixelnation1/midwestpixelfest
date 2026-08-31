import { event } from "@/lib/site";

export function isTicketSalesOpen(): boolean {
  return Boolean(event.ticketUrl);
}

export type TicketAction = {
  href: string;
  label: string;
  external: boolean;
};

/**
 * Nav / hero: always a working click target.
 * Purchase: "Buy Tickets" when ticketUrl is set, otherwise "Tickets Coming Soon".
 */
export function getTicketAction(intent: "nav" | "purchase" = "nav"): TicketAction {
  if (event.ticketUrl) {
    return {
      href: event.ticketUrl,
      label: "Buy Tickets",
      external: true,
    };
  }

  return {
    href: "/tickets",
    label: intent === "purchase" ? "Tickets Coming Soon" : "Get Tickets",
    external: false,
  };
}
