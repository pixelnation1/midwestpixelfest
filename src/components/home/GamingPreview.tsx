import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gamingPillars } from "@/lib/site";

export function GamingPreview() {
  return (
    <section className="relative overflow-hidden border-b border-line py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 pixel-grid opacity-60" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Press start"
          title="The floor is built to play."
          description="Midwest Pixel Fest is a gaming convention first — retro to modern, casual to competitive, cards on the table and controllers in hand."
          tone="cyan"
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {gamingPillars.map((pillar, index) => (
            <li key={pillar.title}>
              <Link
                href={pillar.href}
                className="block h-full border border-line bg-panel p-5 transition-colors hover:border-cyan hover:bg-panel-2"
              >
                <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-cyan">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button href="/gaming" size="lg">
            Explore Gaming
          </Button>
        </div>
      </Container>
    </section>
  );
}
