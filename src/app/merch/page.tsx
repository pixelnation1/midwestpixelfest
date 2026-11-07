import type { Metadata } from 'next';
import { MerchGallery } from '@/components/merch/MerchGallery';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { Container } from '@/components/ui/Container';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Official Merchandise | Midwest Pixel Fest 2027',
  description: 'Explore official Midwest Pixel Fest 2027 merchandise: shirts, hoodies and tote bags featuring our five original designs. First collection coming soon.',
  path: '/merch',
});

export default function MerchPage() {
  return (
    <main>
      <header className="relative overflow-hidden border-b border-cyan/20 bg-[#070b21]">
        <div className="pixel-starfield pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(45,226,255,.14),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(255,45,149,.16),transparent_50%)]" aria-hidden="true" />
        <Container className="relative py-12 text-center sm:py-16">
          <p className="font-pixel text-[11px] uppercase tracking-[.25em] text-cyan">
            The inaugural 2027 collection
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,5.5rem)] uppercase leading-[.95] tracking-wide text-white">
            Official <span className="text-gold">Merchandise</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">
            Original gear for gamers, creators, cosplayers and everyone who calls the Midwest home.
          </p>
        </Container>
      </header>

      <section id="collection" aria-label="Official merchandise collection" className="scroll-mt-24 bg-[#2d62a8]">
        <Container className="py-10 sm:py-14">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-pixel text-[11px] uppercase tracking-[.18em] text-[#c7eeff]">Midwest Pixel Fest 2027</p>
              <h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-white sm:text-5xl">
                The Collection
              </h2>
            </div>
            <a href="#merch-updates" className="inline-flex min-h-11 items-center font-display text-sm uppercase tracking-widest text-[#fff0a1] underline decoration-[#fff0a1]/50 underline-offset-4 hover:text-white">
              First drop coming soon · Get updates
            </a>
          </div>
          <MerchGallery />
        </Container>
      </section>

      <section id="merch-updates" className="scroll-mt-24 border-t border-line bg-ink-2 py-14 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <p className="font-pixel text-[11px] uppercase tracking-[.2em] text-cyan">Official merch updates</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-wide text-paper sm:text-5xl">
              Be first in line.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              The first Midwest PixelFest merch drop is on the way. Sign up to hear when T-shirts, hoodies and tote bags are available to order.
            </p>
          </div>
          <div className="border border-line bg-panel p-5 sm:p-8">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
