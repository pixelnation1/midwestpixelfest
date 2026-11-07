"use client";

import { EventCta } from "@/components/cta/EventCta";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getTicketAction, type TicketAction } from "@/lib/tickets";

export type TicketClickSource =
  | "header"
  | "homepage"
  | "tickets_page"
  | "gaming"
  | "cosplay";

export type TicketClickType = "weekend" | "saturday" | "sunday" | "kids";

type TicketCtaProps = {
  intent?: "nav" | "purchase";
  size?: "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  action?: TicketAction;
  source?: TicketClickSource;
  ticketType?: TicketClickType;
};

export function TicketCta({
  intent = "nav",
  size = "md",
  className,
  variant = "primary",
  onClick,
  action,
  source,
  ticketType,
}: TicketCtaProps) {
  // Only the Tickets page may link directly to checkout. All other ticket
  // CTAs route through the venue-status and travel notice first.
  const ticket = action ?? getTicketAction(
    intent === "purchase" && source === "tickets_page" ? "purchase" : "nav",
  );

  return (
    <EventCta
      href={ticket.href}
      label={ticket.label}
      variant={variant}
      size={size}
      className={className}
      external={ticket.external}
      eventName={ANALYTICS_EVENTS.ticket_click}
      eventPayload={{
        outbound: ticket.external,
        ...(source ? { source } : {}),
        ...(ticketType ? { ticket_type: ticketType } : {}),
      }}
      onClick={onClick}
    />
  );
}
