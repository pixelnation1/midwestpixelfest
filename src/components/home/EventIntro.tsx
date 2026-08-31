import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export function EventIntro() {
  return (
    <section className="relative border-b border-line bg-ink-2 py-20 sm:py-28">
      <Container className="grid items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="The weekend"
            title="The Midwest is getting a new kind of convention."
            tone="cyan"
          />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-5">
          <p>
            {site.name} brings gaming, cosplay, creators, collectors, artists,
            vendors, tournaments, and community together for a weekend-long
            celebration in {site.location}.
          </p>
          <p>
            This is not a borrowed big-city template. It is a regional floor
            built for the people who already drive across state lines for a
            good con — and for the locals who have been waiting for one of
            their own.
          </p>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-gold">
            Play. Dress up. Hunt rares. Meet the makers. Stay late.
          </p>
        </div>
      </Container>
    </section>
  );
}
