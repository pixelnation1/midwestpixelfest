import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ExhibitorDirectory } from "@/components/exhibitors/ExhibitorDirectory";
import { listPublishedVendors } from "@/lib/persistence/directory";
import { createPageMetadata } from "@/lib/seo";
import { getVendorPrimaryCta } from "@/lib/vendors";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Exhibitor & Artist Directory | Midwest Pixel Fest 2027",
  description:
    "Explore the confirmed vendors, artists and cosplay creators exhibiting at Midwest Pixel Fest 2027. Search by category and find exhibitor profiles and booth locations as announced.",
  path: "/exhibitors",
});

export default async function ExhibitorsPage() {
  const vendors = await listPublishedVendors();
  const cta = getVendorPrimaryCta();
  return <main>
    <header className="relative overflow-hidden border-b border-cyan/30 bg-[#0a0d22]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 pixel-grid opacity-50"/>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(45,226,255,.18),transparent_54%),radial-gradient(ellipse_at_10%_90%,rgba(255,45,149,.18),transparent_53%)]"/>
      <Container className="relative py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-6 font-pixel text-[11px] uppercase tracking-widest text-muted">
          <Link href="/" className="text-cyan hover:text-gold">Home</Link>
          <span className="mx-3 text-magenta">/</span>
          <span aria-current="page">Exhibitor Directory</span>
        </nav>
        <p className="font-pixel text-[11px] uppercase tracking-[.17em] text-cyan">
          Discover the marketplace
        </p>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(2.8rem,8.5vw,6rem)] uppercase leading-[.92] tracking-wide text-paper">
          Exhibitors <span className="text-gold">&amp; Artist Alley</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">
          From independent artists and makers to video games, collectibles and tabletop
          treasures—meet the exhibitors joining Midwest Pixel Fest 2027 in Emporia.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#browse" className="inline-flex min-h-12 items-center bg-magenta px-6 py-3 font-display text-sm uppercase tracking-widest text-ink shadow-[4px_4px_0_var(--color-cyan)] hover:bg-gold">
            Browse the lineup ↓
          </a>
          <Link href="/vendors" className="inline-flex min-h-12 items-center border border-cyan px-6 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10">
            Become an exhibitor
          </Link>
        </div>
      </Container>
    </header>

    <section id="browse" className="scroll-mt-24 bg-ink py-12 sm:py-16">
      <Container>
        <div className="mb-8">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">The 2027 marketplace</p>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper sm:text-5xl">Meet the makers, artists &amp; shops.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            Only confirmed exhibitors approved for public announcement appear here.
            Booth assignments and offerings may change as planning continues.
          </p>
        </div>
        <ExhibitorDirectory vendors={vendors} />
      </Container>
    </section>

    <section className="border-t border-line bg-ink-2 py-14 sm:py-20">
      <Container className="grid gap-6 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div>
          <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Exhibit at Midwest Pixel Fest</p>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper sm:text-5xl">Your next customers could be here.</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Bring your art, merchandise, games or creations to the inaugural Midwest Pixel Fest.
            Our vendor page has space details, pricing and the current application process.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={cta.href} className="inline-flex min-h-12 items-center bg-cyan px-6 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
              {cta.mode === "apply" ? "Apply to exhibit" : "Register exhibitor interest"}
            </Link>
            <Link href="/vendors" className="inline-flex min-h-12 items-center border border-cyan px-6 py-3 font-display text-sm uppercase tracking-widest text-cyan">
              Vendor information
            </Link>
          </div>
        </div>
        <div className="border-l-4 border-gold bg-panel p-6 sm:p-8">
          <h3 className="font-display text-2xl uppercase tracking-wide text-paper">Building the 2027 lineup</h3>
          <p className="mt-3 leading-relaxed text-muted">
            This directory is updated as participating vendors and artists are confirmed
            and approve their public information. Businesses listed here are event exhibitors,
            not sponsors or partners unless separately designated.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Booth numbers will appear when the venue agreement and floor layout are finalized.
            Webb Hall at Emporia State University remains our selected venue, with the reservation pending.
          </p>
        </div>
      </Container>
    </section>
  </main>;
}
