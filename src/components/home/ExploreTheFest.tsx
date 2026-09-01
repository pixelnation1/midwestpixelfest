import { GameSelectCard } from "@/components/retro/GameSelectCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { exploreCards } from "@/lib/site";

export function ExploreTheFest() {
  return (
    <section id="explore" className="scroll-mt-24 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Enter the fest"
          title="What you can do this weekend."
          description="Pick a lane — retro play, cards, tabletop, cosplay, the vendor hall, or guest announcements. Programming details land as they are confirmed."
          tone="gold"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {exploreCards.map((card, index) => (
            <li key={card.title}>
              <GameSelectCard
                href={card.href}
                title={card.title}
                description={card.description}
                icon={card.icon}
                tone={card.accent}
                index={index + 1}
                cta="Press start"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
