import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MerchGallery } from '@/components/merch/MerchGallery';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { Container } from '@/components/ui/Container';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Official Merch | Midwest Pixel Fest 2027',
  description: 'See the inaugural Midwest Pixel Fest 2027 merchandise collection, with five original designs on shirts, hoodies, and canvas totes. Gallery previews only; sales not yet open.',
  path: '/merch',
});

export default function MerchPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-ink-2">
        <div className="pointer-events-none absolute inset-0 pixel-starfield opacity-80" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(45,226,255,.15),transparent_50%),radial-gradient(ellipse_at_30%_0%,rgba(255,45,149,.13),transparent_52%)]" aria-hidden="true" />
        <Container className="relative grid items-center gap-8 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
          <div>
            <p className="font-pixel text-xs uppercase tracking-[.26em] text-cyan">2027 • Inaugural collection</p>
            <h1 className="mt-6 font-display text-[clamp(3.5rem,10vw,8rem)] uppercase leading-[.85] tracking-tight text-paper">
              Wear<br /><span className="text-gold">the fest.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              From the first roll to the final boss. Gear for gaming, retro arcades, tabletop, cosplay, and the community that brings us together.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#collection" className="inline-flex min-h-11 items-center justify-center bg-gold px-6 py-4 font-display text-sm uppercase tracking-widest text-ink transition-colors hover:bg-paper">Explore all designs ↓</a>
              <a href="#merch-updates" className="inline-flex min-h-11 items-center justify-center border border-paper/30 px-6 py-4 font-display text-sm uppercase tracking-widest text-paper transition-colors hover:border-cyan hover:text-cyan">Get drop updates</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="pointer-events-none absolute -inset-4 rounded-full border border-cyan/20 shadow-[0_0_60px_rgba(45,226,255,.13)]" aria-hidden="true" />
            <Image src="/merch/designs/midwest-nights.webp" width={1200} height={1200} alt="Original Midwest Nights neon gaming artwork" priority className="relative aspect-square w-full object-contain" />
            <div className="absolute -bottom-3 -left-3 border-l-4 border-magenta bg-panel px-4 py-3 font-display text-sm uppercase tracking-widest text-paper">5 designs • 3 ways to wear</div>
          </div>
        </Container>
      </section>

      <div className="border-y border-cyan/20 bg-[#0b2136] px-6 py-4 text-center font-display text-sm uppercase tracking-[.2em] text-cyan">
        Level up your wardrobe <span className="mx-4 text-gold">✦</span> Five original designs <span className="mx-4 text-gold">✦</span> Fifteen product previews
      </div>

      <Container className="py-16 sm:py-20" >
        <div id="collection" className="scroll-mt-28">
          <p className="font-pixel text-xs uppercase tracking-[.24em] text-cyan">The collection</p>
          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h2 className="font-display text-4xl uppercase tracking-wide text-paper sm:text-6xl">Choose your gear</h2>
            <p className="max-w-sm leading-relaxed text-muted">Each design is previewed on T-shirts, hoodies, and canvas totes. Browse each design across all three products and tap a photo to see it up close.</p>
          </div>
          <div className="my-8 border border-cyan/30 bg-[#0b2136] px-5 py-4 text-sm leading-relaxed text-paper">
            <strong className="text-cyan">Concept gallery:</strong> Products are not currently available to purchase. Images are digital mockups; final pricing, sizes, and production details are coming later.
          </div>
          <MerchGallery />
        </div>
      </Container>

      <section id="merch-updates" className="scroll-mt-28 border-t border-line bg-ink-2 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="font-pixel text-xs uppercase tracking-[.24em] text-cyan">Get the first drop</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-wide sm:text-5xl">Don't miss the collection.</h2>
            <p className="mt-5 leading-relaxed text-muted">Get festival updates, including an announcement when official merchandise launches. No payment or reservation is required to join the list.</p>
            <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-cyan hover:text-magenta">Explore the festival ↗</Link>
          </div>
          <div className="border border-line bg-panel p-5 sm:p-8"><NewsletterForm /></div>
        </Container>
      </section>
    </div>
  );
}
