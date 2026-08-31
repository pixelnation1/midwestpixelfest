import { TicketCta } from "@/components/cta/TicketCta";
import { Badge } from "@/components/ui/Badge";
import { EventCta } from "@/components/cta/EventCta";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden hero-atmosphere"
    >
      <div className="pointer-events-none absolute inset-0 pixel-grid" />
      <div className="pointer-events-none absolute inset-0 pixel-dots mix-blend-screen" />
      <div
        className="neon-orb pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-magenta/40"
        aria-hidden="true"
      />
      <div
        className="neon-orb pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-cyan/30"
        aria-hidden="true"
        style={{ animationDelay: "1.4s" }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden" aria-hidden="true">
        <div className="hero-floor h-[420px] w-full opacity-80" />
      </div>
      <div className="scanlines absolute inset-0 opacity-40" aria-hidden="true" />

      <Container className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-16 sm:py-24">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="cyan">{site.location}</Badge>
          <Badge tone="gold">{site.dateLabel}</Badge>
        </div>

        <p className="mt-8 font-pixel text-xs uppercase tracking-[0.28em] text-magenta sm:text-sm">
          Inaugural year · Presented by {site.organizer}
        </p>

        <h1
          id="hero-heading"
          className="mt-4 max-w-5xl font-display text-[clamp(2.6rem,11vw,8.75rem)] uppercase leading-[0.82] tracking-[0.04em] text-paper glow-pulse"
        >
          Midwest
          <span className="block text-magenta">Pixel Fest</span>
        </h1>

        <p className="mt-6 max-w-xl font-display text-lg uppercase tracking-[0.18em] text-cyan sm:text-xl">
          {site.tagline}
        </p>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          A Midwest gaming, cosplay, and pop-culture convention in Emporia,
          Kansas — built for players, cosplayers, collectors, artists, and the
          people who keep the floor loud.
        </p>
        <p className="mt-2 text-sm text-muted">{site.venueLabel}</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <TicketCta intent="nav" size="lg" />
          <EventCta href="#explore" label="Explore the Fest" variant="secondary" size="lg" />
        </div>
      </Container>
    </section>
  );
}
