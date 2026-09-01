import { ScenePhoto } from "@/components/media/ScenePhoto";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CosplaySection() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="stage-light absolute left-1/4 top-0 h-80 w-24 -translate-x-1/2 bg-gradient-to-b from-magenta/40 to-transparent blur-2xl" />
        <div
          className="stage-light absolute left-1/2 top-0 h-96 w-32 -translate-x-1/2 bg-gradient-to-b from-cyan/28 to-transparent blur-2xl"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="stage-light absolute left-3/4 top-0 h-80 w-24 -translate-x-1/2 bg-gradient-to-b from-gold/22 to-transparent blur-2xl"
          style={{ animationDelay: "1.6s" }}
        />
      </div>

      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Costume & character"
            title="Cosplay takes center stage"
            description="Bring the character. Walk the floor. Hit the contest. Midwest Pixel Fest is building space for craftsmanship, first-time costumes, group meetups, and the kind of hallway photos people still talk about in January."
            tone="magenta"
          />
          <ul className="mt-8 space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="text-magenta" aria-hidden="true">
                ▸
              </span>
              Cosplay contest details will be announced
            </li>
            <li className="flex gap-3">
              <span className="text-magenta" aria-hidden="true">
                ▸
              </span>
              Meetups for creators, photographers, and fan groups
            </li>
            <li className="flex gap-3">
              <span className="text-magenta" aria-hidden="true">
                ▸
              </span>
              A community floor that treats costumes as part of the show
            </li>
          </ul>
          <div className="mt-10">
            <Button href="/cosplay" size="lg">
              Cosplay at Midwest Pixel Fest
            </Button>
          </div>
        </div>

        <ScenePhoto
          src="/images/cosplay/cosplay-convention-hall.jpg"
          alt="Cosplayer in a handmade cardboard mask and trench coat standing in a convention hall"
          caption="Cosplay"
          objectPosition="center 22%"
          overlay="stage"
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="mx-auto aspect-[4/5] w-full max-w-md pixel-frame"
        />
      </Container>
    </section>
  );
}
