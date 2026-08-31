import { EventCta } from "@/components/cta/EventCta";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  availabilityLabel,
  inquiryHrefForPackage,
  packagePriceDisplay,
  type SponsorshipPackage,
} from "@/lib/sponsorships";

const accentBorder: Record<SponsorshipPackage["accent"], string> = {
  magenta: "border-magenta/50",
  cyan: "border-cyan/50",
  gold: "border-gold/50",
  lime: "border-lime/50",
};

type PackageCardProps = {
  pkg: SponsorshipPackage;
};

export function PackageCard({ pkg }: PackageCardProps) {
  const soldOut = pkg.availability === "sold_out";
  const status = availabilityLabel(pkg.availability);
  const price = packagePriceDisplay(pkg);
  const href = inquiryHrefForPackage(pkg);

  return (
    <article
      className={cn(
        "flex h-full flex-col border bg-panel p-6 sm:p-8",
        pkg.featured ? accentBorder[pkg.accent] : "border-line",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {pkg.featured ? (
          <Badge tone={pkg.accent}>{pkg.featuredLabel}</Badge>
        ) : null}
        {status ? (
          <Badge tone={soldOut ? "gold" : pkg.accent}>{status}</Badge>
        ) : null}
      </div>
      <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
        {pkg.name}
      </h3>
      <p className="mt-3 font-display text-2xl uppercase tracking-[0.12em] text-cyan sm:text-3xl">
        {price}
      </p>
      <p className="mt-4 flex-1 text-muted">{pkg.shortDescription}</p>
      <div className="mt-8">
        {soldOut ? (
          <Button disabled className="w-full sm:w-auto" aria-disabled="true">
            Sold Out
          </Button>
        ) : (
          <EventCta
            href={href}
            label={pkg.ctaLabel}
            variant={pkg.featured ? "primary" : "secondary"}
            className="w-full sm:w-auto"
            eventName={ANALYTICS_EVENTS.sponsor_package_select}
            eventPayload={{ package: pkg.id }}
          />
        )}
      </div>
    </article>
  );
}
