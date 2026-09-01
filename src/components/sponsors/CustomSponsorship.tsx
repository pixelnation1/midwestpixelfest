import { EventCta } from "@/components/cta/EventCta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import {
  customPartnershipFocusAreas,
  getCustomSponsorshipPackage,
  inquiryHrefForPackage,
} from "@/lib/sponsorships";

export function CustomSponsorship() {
  const pkg = getCustomSponsorshipPackage();
  if (!pkg) return null;

  return (
    <section
      id="custom-sponsorship"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="custom-sponsorship-heading"
    >
      <SectionHeading
        id="custom-sponsorship-heading"
        eyebrow="Custom / Event Sponsorship"
        title="Build something with us"
        description="Businesses can propose partnerships centered around particular areas of Midwest Pixel Fest. These are examples of possible focus areas — not a menu of guaranteed inventory. Not every opportunity is available."
        tone="cyan"
      />
      <div className="mt-10 border border-cyan/40 bg-panel p-6 sm:p-8">
        <p className="max-w-3xl text-lg text-muted">{pkg.shortDescription}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {customPartnershipFocusAreas.map((area) => (
            <li
              key={area}
              className="border border-line bg-panel-2 px-3 py-2 font-display text-sm uppercase tracking-[0.12em] text-paper"
            >
              {area}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm text-muted">{pkg.description}</p>
        <div className="mt-8">
          <EventCta
            href={inquiryHrefForPackage(pkg)}
            label={pkg.ctaLabel}
            eventName={ANALYTICS_EVENTS.sponsor_package_select}
            eventPayload={{ package: pkg.id }}
          />
        </div>
      </div>
    </section>
  );
}
