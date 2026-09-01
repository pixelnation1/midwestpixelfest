import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CosplaySection() {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-16 sm:py-24">
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

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <div className="cosplay-poster absolute inset-0 border border-magenta/50 pixel-frame" />
          <div className="absolute inset-3 border border-cyan/25" />
          <CosplayStageArt />
          <p className="absolute bottom-6 left-0 right-0 text-center font-pixel text-[11px] uppercase tracking-[0.24em] text-gold">
            Stage lights on · 2027
          </p>
        </div>
      </Container>
    </section>
  );
}

function CosplayStageArt() {
  return (
    <svg
      viewBox="0 0 320 400"
      className="absolute inset-0 h-full w-full text-paper/40"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="160" cy="118" r="36" className="text-paper/50" />
      <path d="M92 340c12-88 36-124 68-124s56 36 68 124H92z" className="text-paper/35" />
      <circle cx="92" cy="150" r="22" className="text-magenta/50" />
      <path d="M48 320c8-56 22-80 44-80s36 24 44 80H48z" className="text-magenta/30" />
      <circle cx="228" cy="150" r="22" className="text-cyan/50" />
      <path d="M184 320c8-56 22-80 44-80s36 24 44 80h-88z" className="text-cyan/30" />
      <rect x="40" y="52" width="240" height="8" className="text-gold/40" />
      <rect x="72" y="24" width="176" height="6" className="text-magenta/50" />
    </svg>
  );
}
