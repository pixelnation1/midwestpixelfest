"use client";

import { Button } from "@/components/ui/Button";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type EventCtaProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  eventName?: AnalyticsEventName;
  external?: boolean;
  onClick?: () => void;
};

export function EventCta({
  href,
  label,
  variant = "primary",
  size = "md",
  className,
  eventName,
  external = false,
  onClick,
}: EventCtaProps) {
  return (
    <Button
      href={href}
      variant={variant}
      size={size}
      className={cn(className)}
      external={external}
      onClick={() => {
        if (eventName) trackEvent(eventName);
        onClick?.();
      }}
    >
      {label}
    </Button>
  );
}
