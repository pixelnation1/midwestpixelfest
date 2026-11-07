import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { VisitDirectory } from "@/components/visit/VisitDirectory";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Visit Emporia | Things to Do During Midwest Pixel Fest 2027",
  description:
    "Make a weekend of Midwest Pixel Fest 2027. Explore Emporia, Kansas: downtown restaurants, shops, gaming, family-friendly attractions, local arts, free zoo admission and parks.",
  path: "/visit-emporia",
});

const weekend = [
  {
    day: "Friday",
    eyebrow: "Welcome to the city",
    title: "Get settled. Explore downtown.",
    body: "Arriving the night before? Take a stroll on Commercial Street, discover independent shops, and find somewhere local to eat.",
    destination: "/visit-emporia#explore",
    label: "Find downtown favorites",
  },
  {
    day: "Saturday",
    eyebrow: "Convention day",
    title: "Play all day. Keep exploring.",
    body: "Enjoy your time at Midwest Pixel Fest, then make a night of it with dinner, a theatre calendar check, or an extra round of games.",
    destination: "/schedule",
    label: "See festival plans",
  },
  {
    day: "Sunday",
    eyebrow: "One more adventure",
    title: "Coffee, wildlife & the ride home.",
    body: "Before you head out, try a downtown breakfast or take the family to the zoo or a local park. Check each stop's Sunday hours first.",
    destination: "/visit-emporia#explore",
    label: "Browse the city",
  },
];

const localGuides = [
  {
    title: "Visit Emporia",
    description: "The area's official visitor resource for dining, attractions, lodging and events.",
    href: "https://visitemporia.com/",
    action: "Explore the visitors guide",
  },
  {
    title: "Emporia Main Street",
    description: "Find downtown businesses, local happenings and the people who keep Commercial Street vibrant.",
    href: "https://emporiamainstreet.com/explore/visit-downtown-emporia/",
    action: "Discover downtown",
  },
];

export default function VisitEmporiaPage() {
  return (
    <main>
      <header className="relative overflow-hidden border-b border-cyan/30 bg-[#080b1e]">
        <div className="pointer-events-none absolute inset-0 pixel-grid opacity-35" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_25%,rgba(45,226,255,.2),transparent_46%),radial-gradient(ellipse_at_15%_85%,rgba(255,45,149,.22),transparent_45%)]"
          aria-hidden="true"
        />
        <Container className="relative grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12">
          <div>
            <nav aria-label="Breadcrumb" className="mb-7 font-pixel text-[10px] uppercase tracking-[.15em] text-muted">
              <Link href="/" className="text-cyan hover:text-gold">Home</Link>
              <span className="mx-3 text-magenta">/</span>
              <Link href="/info" className="text-cyan hover:text-gold">Info</Link>
              <span className="mx-3 text-magenta">/</span>
              <span aria-current="page">Visit Emporia</span>
            </nav>
            <p className="font-pixel text-[11px] uppercase tracking-[.19em] text-cyan">
              Your Midwest Pixel Fest weekend, beyond the convention
            </p>
            <h1 className="mt-5 font-display text-[clamp(3.5rem,10vw,7rem)] uppercase leading-[.88] tracking-wide text-paper">
              Visit <span className="text-gold">Emporia.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85 sm:text-xl">
              You're coming for the games, creators and cosplay. Stay for great food, local shops, family outings and a whole city worth exploring.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#explore" className="inline-flex min-h-12 items-center justify-center bg-magenta px-6 py-3 font-display text-sm uppercase tracking-widest text-ink shadow-[4px_4px_0_var(--color-cyan)] hover:bg-gold">
                Find things to do
              </a>
              <Link href="/travel" className="inline-flex min-h-12 items-center justify-center border border-cyan px-6 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10">
                Hotels & travel
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden border border-cyan/30 bg-[#10162b] p-5 shadow-[0_0_45px_rgba(45,226,255,.08)] sm:p-7">
            <div className="pointer-events-none absolute -right-14 -top-12 h-56 w-56 rounded-full bg-magenta/20 blur-3xl" />
            <div className="relative">
              <p className="font-pixel text-[10px] uppercase tracking-[.18em] text-gold">Explore our hometown</p>
              <p className="mt-6 font-display text-4xl uppercase leading-none tracking-wide text-paper sm:text-5xl">More than a <span className="text-cyan">weekend.</span></p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="border border-cyan/25 bg-[#091128] p-4">
                  <p className="font-display text-4xl text-cyan">9</p>
                  <p className="mt-1 font-pixel text-[9px] uppercase tracking-[.09em] text-paper/85">Walkable downtown blocks</p>
                </div>
                <div className="border border-gold/25 bg-[#091128] p-4">
                  <p className="font-display text-4xl text-gold">FREE</p>
                  <p className="mt-1 font-pixel text-[9px] uppercase tracking-[.09em] text-paper/85">David Traylor Zoo admission</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 font-pixel text-[10px] uppercase tracking-[.1em]">
                <span className="border border-magenta/40 px-3 py-2 text-magenta">Eat local</span>
                <span className="border border-cyan/40 px-3 py-2 text-cyan">Play more</span>
                <span className="border border-gold/40 px-3 py-2 text-gold">Explore together</span>
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-sm leading-relaxed text-muted">Emporia, Kansas • October 16–17, 2027</p>
            </div>
          </div>
        </Container>
      </header>

      <section className="border-b border-line bg-ink-2">
        <Container className="py-8">
          <p className="max-w-5xl text-sm leading-relaxed text-muted sm:text-base">
            <strong className="text-paper">Planning note:</strong> Webb Hall at Emporia State University is our selected convention venue, but the reservation is pending a signed agreement and deposit. Please avoid nonrefundable travel purchases until the booking is confirmed. For official event arrival details, use our <Link href="/travel" className="text-cyan underline underline-offset-4">Travel page</Link>.
          </p>
        </Container>
      </section>

      <section id="explore" className="scroll-mt-24 bg-ink py-14 sm:py-20">
        <Container>
          <p className="font-pixel text-[11px] uppercase tracking-[.18em] text-gold">Your guide to Emporia</p>
          <div className="mb-8 mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-4xl uppercase tracking-wide text-paper sm:text-6xl">
              Explore beyond the fest.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Browse genuine local visitor stops, filter by what you enjoy, and open directions for the places you want to visit.
            </p>
          </div>
          <VisitDirectory />
        </Container>
      </section>

      <section className="border-y border-line bg-[#121023] py-14 sm:py-20">
        <Container>
          <div className="mb-7">
            <p className="font-pixel text-[11px] uppercase tracking-[.18em] text-cyan">Make a weekend of it</p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper sm:text-5xl">Three days. Plenty to discover.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">These are flexible trip ideas—not a scheduled PixelFest itinerary or confirmed specials. Check operating hours and event programming before making plans.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {weekend.map((day, index) => (
              <article key={day.day} className="flex h-full flex-col border border-line bg-panel p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">{day.eyebrow}</p>
                  <span className="font-display text-3xl text-magenta">0{index + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-gold">{day.day}</h3>
                <h4 className="mt-2 font-display text-xl uppercase tracking-wide text-paper">{day.title}</h4>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:text-base">{day.body}</p>
                <Link href={day.destination} className="mt-7 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-cyan hover:text-gold">
                  {day.label} <span aria-hidden="true" className="ml-2">→</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <p className="font-pixel text-[11px] uppercase tracking-[.17em] text-gold">Go deeper</p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper sm:text-5xl">Explore with the local experts.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Local tourism teams maintain more complete business directories, events and opening information. Find even more options through these resources.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {localGuides.map((guide) => (
              <div key={guide.href} className="flex flex-col border border-cyan/20 bg-panel p-6">
                <h3 className="font-display text-2xl uppercase tracking-wide text-paper">{guide.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{guide.description}</p>
                <a href={guide.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-cyan hover:text-gold">
                  {guide.action} <span aria-hidden="true" className="ml-2">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            ))}
          </div>
          <div className="mt-9 border-l-4 border-gold bg-panel px-5 py-5">
            <p className="font-display text-xl uppercase tracking-wide text-paper">Visiting for PixelFest?</p>
            <p className="mt-2 leading-relaxed text-muted">Any future convention-weekend discounts or official business partnerships will be announced only after they're confirmed. Businesses featured here are independent suggestions, not endorsers of the event.</p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/travel" className="inline-flex min-h-11 items-center justify-center bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink">
              Hotels & travel
            </Link>
            <Link href="/first-timers-guide" className="inline-flex min-h-11 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan">
              First-timer's guide
            </Link>
            <Link href="/info" className="inline-flex min-h-11 items-center justify-center border border-line px-5 py-3 font-display text-sm uppercase tracking-widest text-paper">
              All attendee info
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
