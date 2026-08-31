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
        eyebrow="Emporia and the region"
        title="Built for local and regional businesses"
        description="Midwest Pixel Fest is being stood up in Emporia. Nearby businesses are not an afterthought — they are part of who this weekend is for. These are examples of businesses that may be a good fit, not a list of confirmed sponsors."
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
    </section>
  );
}
