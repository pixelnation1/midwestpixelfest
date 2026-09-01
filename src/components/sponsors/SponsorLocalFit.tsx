import { EventCta } from "@/components/cta/EventCta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { localBusinessExamples } from "@/lib/sponsorships";

export function SponsorLocalFit() {
  return (
    <section
      id="local-fit"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="local-fit-heading"
    >
      <SectionHeading
        id="local-fit-heading"
        eyebrow="Local and regional"
        title="Built in Emporia. Backed by the Midwest."
        description="Sponsorship opportunities can work for local and regional businesses that want to support the inaugural weekend. These are examples of potential partners — not a list of confirmed sponsors."
        tone="lime"
      />
      <ul className="mt-8 flex flex-wrap gap-2">
        {localBusinessExamples.map((item) => (
          <li
            key={item}
            className="border border-line bg-panel px-3 py-2 font-display text-sm uppercase tracking-[0.12em] text-paper"
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <EventCta href="/sponsors/inquiry" label="Become a Sponsor" />
      </div>
    </section>
  );
}
