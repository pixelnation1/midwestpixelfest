import { ScenePhoto } from "@/components/media/ScenePhoto";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PlayTablesSection() {
  return (
    <section className="bg-ink-2 py-16 sm:py-24">
      <Container>
        <SectionHeading
            eyebrow="Press start"
            title="Cards on the table."
            description="Trading card games and tabletop belong on the same floor as the cabinets. Photography here is illustrative of the play this weekend is being built for."
          tone="gold"
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <ScenePhoto
            src="/images/tcg/tcg-players-table.jpg"
            alt="Players seated around a table holding illustrated game cards"
            caption="Trading card games"
            objectPosition="center 45%"
            overlay="dark"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] min-h-[220px] pixel-frame"
          />
          <ScenePhoto
            src="/images/tabletop/tabletop-dice-session.jpg"
            alt="Dice and tabletop gaming materials arranged on a table"
            caption="Tabletop"
            objectPosition="center"
            overlay="dark"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] min-h-[220px] pixel-frame"
          />
        </div>
      </Container>
    </section>
  );
}
