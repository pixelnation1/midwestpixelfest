import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FloorMapExplorer } from "@/components/floor-map/FloorMapExplorer";
import { listPublicFloorMaps } from "@/lib/persistence/floor-maps";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata:Metadata=createPageMetadata({
  title:"Convention Floor Map | Midwest Pixel Fest 2027",
  description:"Plan your Midwest Pixel Fest 2027 visit with an interactive venue floor map, activity areas, attendee services, vendor booths and searchable locations once the approved layout is published.",
  path:"/floor-map",
});

export default async function FloorMapPage() {
  const maps=await listPublicFloorMaps();
  return <main>
    <header className="relative overflow-hidden border-b border-cyan/25 bg-[#0a0d24]">
      <div aria-hidden="true" className="pixel-grid pointer-events-none absolute inset-0 opacity-40"/>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_25%,rgba(45,226,255,.16),transparent_52%),radial-gradient(ellipse_at_5%_90%,rgba(255,45,149,.14),transparent_45%)]"/>
      <Container className="relative py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-7 font-pixel text-[11px] uppercase tracking-widest text-muted">
          <Link href="/" className="text-cyan hover:text-gold">Home</Link>
          <span className="mx-3 text-magenta" aria-hidden="true">/</span>
          <Link href="/info" className="text-cyan hover:text-gold">Info</Link>
          <span className="mx-3 text-magenta" aria-hidden="true">/</span>
          <span aria-current="page">Floor Map</span>
        </nav>
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Your guide to the convention</p>
        <h1 className="mt-5 font-display text-[clamp(3rem,9vw,6.5rem)] uppercase leading-[.9] tracking-wide text-paper">
          Explore the <span className="text-gold">Show Floor.</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-paper/85 sm:text-xl">
          Find your next game, discover artists, and navigate the weekend.
          Our official interactive floor map will show verified rooms, booths and services as the final layout is approved.
        </p>
      </Container>
    </header>

    <section className="bg-ink py-12 sm:py-16">
      <Container>
        <div className="mb-8 border-l-4 border-gold bg-panel px-5 py-5 sm:px-7">
          <p className="font-display text-xl uppercase tracking-wide text-gold">
            {maps.length>0?"Official published sections":"Floor plan preparation is underway"}
          </p>
          <p className="mt-2 max-w-4xl leading-relaxed text-muted">
            Webb Hall at Emporia State University's Memorial Union is our selected venue.
            The reservation still requires a signed agreement and deposit.
            Exact room assignments, booths, accessibility routes and attendee entry instructions are not final until confirmed.
          </p>
        </div>
        <FloorMapExplorer maps={maps}/>
      </Container>
    </section>

    <section className="border-t border-line bg-ink-2 py-14 sm:py-20">
      <Container>
        <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Keep planning</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-wide text-paper">Your weekend, your adventure.</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          Browse confirmed exhibitors, review travel information and check our accessibility guide before the event.
          The official map will be updated if room or booth arrangements change.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {[
            {href:"/exhibitors",label:"Exhibitor Directory"},
            {href:"/attendee-services",label:"Accessibility & Services"},
            {href:"/travel",label:"Travel & Parking"},
            {href:"/first-timers-guide",label:"First-Timer's Guide"},
          ].map(item=><Link key={item.href} href={item.href}
            className="inline-flex min-h-11 items-center border border-cyan/45 px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan hover:border-gold hover:text-gold">
              {item.label}
            </Link>)}
        </div>
      </Container>
    </section>
  </main>;
}
