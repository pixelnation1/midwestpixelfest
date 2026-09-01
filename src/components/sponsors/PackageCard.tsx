import { EventCta } from "@/components/cta/EventCta";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import {
  availabilityLabel,
  benefitCatalogLabel,
  COMPARISON_STATUS_LABEL,
  getCardBenefits,
  inquiryHrefForPackage,
  packagePriceDisplay,
  presentingNegotiationDisclaimer,
  presentingNegotiationTopics,
  type BenefitStatus,
  type SponsorshipPackage,
} from "@/lib/sponsorships";

const accentBorder: Record<SponsorshipPackage["accent"], string> = {
  magenta: "border-magenta/50",
  cyan: "border-cyan/50",
  gold: "border-gold/50",
  lime: "border-lime/50",
};

const statusTone: Record<Exclude<BenefitStatus, "not_included">, string> = {
  included: "text-lime",
  available: "text-cyan",
  priority: "text-gold",
  custom: "text-magenta",
};

type PackageCardProps = {
  pkg: SponsorshipPackage;
};

export function PackageCard({ pkg }: PackageCardProps) {
  const soldOut = pkg.availability === "sold_out";
  const status = availabilityLabel(pkg.availability);
  const price = packagePriceDisplay(pkg);
  const href = inquiryHrefForPackage(pkg);
  const cardBenefits = getCardBenefits(pkg);
  const showNegotiation = pkg.id === "presenting";

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
      <p className="mt-4 text-muted">{pkg.shortDescription}</p>
      {cardBenefits.length > 0 ? (
        <ul className="mt-6 flex-1 space-y-3">
          {cardBenefits.map((item) => (
            <li key={item.benefitId} className="text-sm leading-relaxed">
              <span
                className={cn(
                  "font-display text-[11px] uppercase tracking-[0.14em]",
                  statusTone[item.status],
                )}
              >
                {COMPARISON_STATUS_LABEL[item.status]}
              </span>
              <span className="mt-1 block text-paper">
                {item.detail ?? benefitCatalogLabel(item.benefitId)}
              </span>
            </li>
          ))}
          <li className="text-sm leading-relaxed text-paper">
            Recognition as a {pkg.name}.
          </li>
        </ul>
      ) : (
        <p className="mt-6 flex-1 text-sm text-muted">{pkg.description}</p>
      )}
      {showNegotiation ? (
        <div className="mt-6 border border-line bg-panel-2 p-4">
          <p className="font-display text-sm uppercase tracking-[0.12em] text-gold">
            Custom negotiation opportunities
          </p>
          <p className="mt-2 text-sm text-muted">{presentingNegotiationDisclaimer}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {presentingNegotiationTopics.map((topic) => (
              <li
                key={topic}
                className="border border-line px-2 py-1 font-display text-[11px] uppercase tracking-[0.12em] text-paper"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
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
