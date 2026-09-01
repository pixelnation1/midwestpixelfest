import { ScenePhoto } from "@/components/media/ScenePhoto";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CommunitySection() {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-30" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Player 1 ready"
            title="Show up with your people."
            description="Midwest Pixel Fest is being built as a hangout as much as a show: friends on a couch, a table full of cards, a row of cabinets. The photos are community gaming — not pictures of a previous Pixel Fest."
            tone="cyan"
          />
          <div className="mt-8">
            <Button href="/volunteer" variant="secondary">
              Get involved
            </Button>
          </div>
        </div>
        <ScenePhoto
          src="/images/community/friends-console-play.jpg"
          alt="Friends sitting together on a sofa playing a video game with retro controllers"
          caption="Community play"
          objectPosition="center 35%"
          overlay="dark"
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="aspect-[16/10] min-h-[240px] lg:col-span-7 pixel-frame"
        />
      </Container>
    </section>
  );
}
