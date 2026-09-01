import { GameSelectCard } from "@/components/retro/GameSelectCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gamingPillars } from "@/lib/site";

export function GamingPreview() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 pixel-grid opacity-50" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Arcade select"
          title="The floor is built to play."
          description="Midwest Pixel Fest is a gaming convention first — retro to modern, casual to competitive, cards on the table and controllers in hand. Specific titles and formats will be posted once they are confirmed."
          tone="cyan"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {gamingPillars.map((pillar, index) => (
            <li key={pillar.slug}>
              <GameSelectCard
                href={pillar.href}
                title={pillar.title}
                description={pillar.description}
                icon={pillar.icon}
                tone={pillar.tone}
                index={index + 1}
                cta="Load game"
              />
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
