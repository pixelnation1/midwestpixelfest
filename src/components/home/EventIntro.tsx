import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EventIntro() {
  return (
    <section className="relative overflow-hidden bg-ink-2 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 pixel-grid opacity-40" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="relative mx-auto aspect-square w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <ArcadeMarquee />
        </div>
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="The weekend"
            title="The Midwest is getting a new kind of convention."
            tone="cyan"
          />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Midwest Pixel Fest is being built as a play-first weekend: video
              games, retro cabinets, tabletop, trading cards, cosplay, vendors,
              and the people who show up for all of it.
            </p>
            <p>
              Emporia sits on the I-35 corridor as a meeting point for Kansas
              City, Wichita, Topeka, Lawrence, Manhattan, and the surrounding
              Midwest. This is a regional floor, not a scaled-down copy of a
              coastal mega-con.
            </p>
            <p>
              <Button href="/about" variant="ghost">
                About Midwest Pixel Fest
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ArcadeMarquee() {
  return (
    <div className="relative h-full w-full border border-line bg-panel p-4">
      <div className="relative h-full min-h-[280px] overflow-hidden border border-magenta/30 bg-ink pixel-frame">
        <Image
          src="/images/gaming/arcade-cabinet-controls.jpg"
          alt="Close-up of a retro arcade cabinet with a glowing CRT and joysticks"
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
          style={{ objectPosition: "center 42%" }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15"
          aria-hidden="true"
        />
        <div className="crt-scanlines absolute inset-0" aria-hidden="true" />
        <div className="relative z-[1] flex h-full flex-col items-center justify-end px-4 pb-7 pt-8 text-center">
          <p className="font-pixel text-[10px] uppercase tracking-[0.24em] text-gold">
            Now playing
          </p>
          <p className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide text-paper drop-shadow-[0_2px_12px_rgba(7,6,13,0.9)]">
            Gaming · Cosplay · Collectibles
          </p>
        </div>
      </div>
    </div>
  );
}
