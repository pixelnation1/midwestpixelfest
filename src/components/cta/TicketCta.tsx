"use client";

import { EventCta } from "@/components/cta/EventCta";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getTicketAction, type TicketAction } from "@/lib/tickets";

type TicketCtaProps = {
  intent?: "nav" | "purchase";
  size?: "md" | "lg";
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  action?: TicketAction;
};

export function TicketCta({
  intent = "nav",
  size = "md",
  className,
  variant = "primary",
  onClick,
  action,
}: TicketCtaProps) {
  const ticket = action ?? getTicketAction(intent);

  return (
    <EventCta
      href={ticket.href}
      label={ticket.label}
      variant={variant}
      size={size}
      className={className}
      external={ticket.external}
      eventName={ANALYTICS_EVENTS.ticket_click}
      onClick={onClick}
    />
  );
}
