'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { merchDesigns, merchProducts } from '@/lib/merch';

const typeOptions = [
  { value: 'all', label: 'All merch' },
  { value: 'tee', label: 'T-Shirts' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'tote', label: 'Tote Bags' },
] as const;

type Product = (typeof merchProducts)[number];
type SelectedType = (typeof typeOptions)[number]['value'];

const styleByDesign: Record<string, string> = {
  'official-logo': 'border-gold/70',
  'midwest-nights': 'border-cyan/70',
  'arcade-mode': 'border-magenta/70',
  'roll-for-adventure': 'border-gold/70',
  'cosplay-lives-here': 'border-magenta/70',
};

export function MerchGallery() {
  const [type, setType] = useState<SelectedType>('all');
  const [design, setDesign] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  const designs = merchDesigns.filter((item) => design === 'all' || item.slug === design);
  const productCount = merchProducts.filter((item) =>
    (type === 'all' || item.category === type) && (design === 'all' || item.designSlug === design),
  ).length;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by merchandise type" className="flex flex-wrap gap-2">
          {typeOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              aria-pressed={type === option.value}
              onClick={() => setType(option.value)}
              className={`min-h-11 border px-3 py-2.5 font-display text-xs uppercase tracking-[.1em] transition-colors sm:px-4 sm:text-sm ${
                type === option.value
                  ? 'border-cyan bg-cyan font-semibold text-ink'
                  : 'border-paper/25 bg-panel text-paper hover:border-cyan hover:text-cyan'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <span className="sr-only">Filter by design</span>
          <select
            aria-label="Filter by design"
            value={design}
            onChange={(event) => setDesign(event.target.value)}
            className="min-h-11 w-full border border-paper/25 bg-panel px-4 py-3 font-display text-sm uppercase tracking-wide text-paper sm:w-auto"
          >
            <option value="all">All five designs</option>
            {merchDesigns.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-5 font-pixel text-[11px] uppercase tracking-widest text-muted" aria-live="polite">
        Showing {productCount} product previews · Tap any photo for a larger view
      </p>

      <div className="space-y-7">
        {designs.map((designItem) => {
          const matches = merchProducts.filter((product) =>
            product.designSlug === designItem.slug && (type === 'all' || product.category === type),
          );
          return (
            <section
              key={designItem.slug}
              aria-label={`${designItem.name} collection`}
              className={`overflow-hidden border border-line border-t-4 bg-panel ${styleByDesign[designItem.slug]}`}
            >
              <div className="grid gap-0 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
                <div className="flex items-center gap-4 border-b border-line bg-[#100d19] p-4 sm:p-6 lg:flex-col lg:items-start lg:border-r lg:border-b-0">
                  <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32 lg:h-48 lg:w-full">
                    <Image
                      src={`/merch/designs/${designItem.slug}.webp`}
                      fill
                      sizes="(min-width: 1024px) 240px, 128px"
                      alt={`${designItem.name} original graphic artwork`}
                      className="object-contain drop-shadow-[0_0_16px_rgba(45,226,255,.10)]"
                    />
                  </div>
                  <div className="min-w-0 lg:mt-4">
                    <p className="font-pixel text-[9px] uppercase tracking-[.14em] text-cyan sm:text-[10px]">{designItem.collection}</p>
                    <h3 className="mt-1 font-display text-xl uppercase leading-tight tracking-wide text-paper sm:text-3xl">{designItem.name}</h3>
                    <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">{designItem.description}</p>
                  </div>
                </div>
                <div className={`grid gap-2 p-3 sm:gap-4 sm:p-5 ${type === 'all' ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  {matches.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={`group min-w-0 overflow-hidden border border-line bg-[#11101a] text-left transition-colors hover:border-cyan/70 focus-visible:border-cyan ${type !== 'all' ? 'w-full max-w-sm' : ''}`}
                      onClick={() => setSelected(product)}
                      aria-label={`Enlarge ${product.title} ${product.productType} photo`}
                    >
                      <span className="relative block aspect-[6/5] w-full overflow-hidden bg-[#25202f]">
                        <Image
                          src={product.image}
                          fill
                          sizes={type === 'all' ? '(min-width: 1280px) 230px, (min-width: 1024px) 21vw, (min-width: 640px) 30vw, 29vw' : '(min-width: 1024px) 340px, 90vw'}
                          alt={`${product.title} design on a ${product.color.toLowerCase()} ${product.productType.toLowerCase()} — digital mockup`}
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                        />
                      </span>
                      <span className="block px-2 py-3 text-center font-display text-[11px] uppercase tracking-[.06em] text-paper sm:px-3 sm:text-sm">
                        {product.category === 'tee' ? 'T-Shirt' : product.category === 'hoodie' ? 'Hoodie' : 'Tote Bag'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/90 p-3 backdrop-blur-lg sm:p-6"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="merch-preview-title"
            className="relative grid max-h-[94dvh] w-full max-w-5xl overflow-auto border border-cyan/40 bg-panel lg:grid-cols-[1.25fr_1fr]"
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center border border-paper/30 bg-ink/95 text-3xl text-paper"
              onClick={() => setSelected(null)}
              aria-label="Close product preview"
              autoFocus
            >
              ×
            </button>
            <Image
              src={selected.image}
              width={1020}
              height={850}
              alt={`Larger preview of ${selected.title} on ${selected.productType}`}
              sizes="(min-width: 1024px) 620px, 94vw"
              className="aspect-[6/5] w-full bg-[#262032] object-contain"
            />
            <div className="flex flex-col justify-center gap-4 p-5 sm:p-10">
              <p className="font-pixel text-[10px] uppercase tracking-widest text-cyan">2027 Collection · Digital Preview</p>
              <h2 id="merch-preview-title" className="font-display text-3xl uppercase tracking-wide sm:text-5xl">{selected.title}</h2>
              <p className="font-display text-lg uppercase tracking-widest text-gold">{selected.productType} · {selected.color}</p>
              <p className="text-sm leading-relaxed text-muted">{selected.description}</p>
              <p className="border border-cyan/30 bg-ink/60 p-4 text-sm text-muted">
                Illustrative digital mockup. Merchandise sales are not open; final production details, sizing, and pricing will be announced later.
              </p>
              <a href="#merch-updates" onClick={() => setSelected(null)} className="inline-flex min-h-11 items-center justify-center bg-gold px-4 py-3 font-display text-sm uppercase tracking-wide text-ink">Get collection updates</a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
