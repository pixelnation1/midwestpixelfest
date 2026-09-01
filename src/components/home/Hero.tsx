import Image from "next/image";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { TicketCta } from "@/components/cta/TicketCta";
import { CRTPanel } from "@/components/retro/CRTPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { event, site } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      <Image
        src="/images/hero/retro-arcade-cabinets.jpg"
        alt="Rows of illuminated retro arcade cabinets in a dim arcade"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "18% 50%" }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-magenta/20 to-cyan/15"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 pixel-starfield" />
      <div className="pointer-events-none absolute inset-0 pixel-grid opacity-70" />
      <div className="crt-scanlines pointer-events-none absolute inset-0 opacity-50" />
      <div
        className="neon-orb pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-magenta/25"
        aria-hidden="true"
      />
      <div
        className="neon-orb pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full bg-cyan/20"
        aria-hidden="true"
        style={{ animationDelay: "1.4s" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden"
        aria-hidden="true"
      >
        <div className="hero-floor hero-floor-drift h-[380px] w-full opacity-70" />
      </div>

      <Container className="relative grid items-center gap-8 py-10 sm:gap-10 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-7">
          <div className="mb-5 lg:hidden">
            <CRTPanel
              className="mx-auto max-w-[15.5rem]"
              screenClassName="px-3 py-4"
              label="Official mark"
            >
              <div className="flex flex-col items-center text-center">
                <SiteLogo variant="hero" priority decorative />
                <p className="mt-2 font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">
                  {site.dateLabel}
                </p>
              </div>
            </CRTPanel>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="cyan">{site.location}</Badge>
            <Badge tone="gold">{site.dateLabel}</Badge>
          </div>

          <p className="mt-4 font-pixel text-[11px] uppercase tracking-[0.28em] text-magenta sm:mt-5 sm:text-xs">
            Inaugural year · Presented by {site.organizer}
          </p>

          <h1
            id="hero-heading"
            className="mt-3 max-w-4xl font-display text-[clamp(2.15rem,8vw,6.4rem)] uppercase leading-[0.86] tracking-[0.04em] text-paper drop-shadow-[0_2px_18px_rgba(7,6,13,0.85)]"
          >
            Midwest Pixel Fest
            <span className="mt-1 block text-magenta">{event.year}</span>
          </h1>

          <p className="mt-4 max-w-xl font-display text-base uppercase tracking-[0.18em] text-cyan sm:mt-5 sm:text-xl">
            {site.tagline}
          </p>

          <p className="mt-4 hidden max-w-lg text-base leading-relaxed text-muted sm:block sm:text-lg">
            A Midwest gaming, cosplay, collectibles, and pop-culture convention
            in Emporia, Kansas — for players, cosplayers, collectors, artists,
            and the people who keep the floor loud.
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:mt-8 sm:flex-row">
            <TicketCta intent="nav" size="lg" />
            <Button href="#explore" variant="secondary" size="lg">
              Explore the Fest
            </Button>
          </div>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <CRTPanel label="Official mark · Midwest Pixel Fest" className="mx-auto max-w-md">
            <div className="flex flex-col items-center text-center">
              <SiteLogo variant="hero" priority decorative />
              <p className="mt-4 font-pixel text-[11px] uppercase tracking-[0.28em] text-gold">
                2027 convention
              </p>
              <p className="mt-2 font-display text-lg uppercase tracking-[0.16em] text-paper">
                {site.dateLabel}
              </p>
              <p className="mt-1 font-display text-sm uppercase tracking-[0.16em] text-cyan">
                {site.location}
              </p>
              <p className="mt-3 text-xs text-muted">{site.venueLabel}</p>
            </div>
          </CRTPanel>
        </div>
      </Container>
    </section>
  );
}
