import { EventCta } from "@/components/cta/EventCta";
import { InfoCard } from "@/components/ui/InfoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { sponsorshipOpportunities } from "@/lib/sponsorships";

export function SponsorOpportunities() {
  return (
    <section
      id="opportunities"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="opportunities-heading"
    >
      <SectionHeading
        id="opportunities-heading"
        eyebrow="Custom"
        title="Sponsorship opportunities"
        description="These are conversation starters, not guaranteed packages. If you want to be associated with a part of the weekend — gaming, cosplay, stage, or a local welcome — tell us. Custom partnerships are discussed with the event team."
        tone="gold"
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {sponsorshipOpportunities.map((item) => (
          <li key={item.id}>
            <InfoCard title={item.name}>
              <p>{item.description}</p>
            </InfoCard>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <EventCta
          href="/sponsors/inquiry?interest=Custom%20Partnership"
          label="Discuss a Custom Partnership"
          eventName={ANALYTICS_EVENTS.sponsor_custom_partnership_click}
        />
      </div>
    </section>
  );
}
