'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { merchDesigns, merchProducts } from '@/lib/merch';

const typeOptions = [
  { value: 'all', label: 'All 15' },
  { value: 'tee', label: 'T-Shirts' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'tote', label: 'Tote Bags' },
] as const;

type Product = (typeof merchProducts)[number];

type SelectedType = (typeof typeOptions)[number]['value'];

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

  const filtered = merchProducts.filter(
    (product) =>
      (type === 'all' || product.category === type) &&
      (design === 'all' || product.designSlug === design),
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter by merchandise type" className="flex flex-wrap gap-2">
          {typeOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              aria-pressed={type === option.value}
              onClick={() => setType(option.value)}
              className={`min-h-11 border px-4 py-3 font-display text-xs uppercase tracking-[.12em] transition-colors sm:text-sm ${
                type === option.value
                  ? 'border-cyan bg-cyan font-semibold text-ink'
                  : 'border-paper/25 bg-panel text-paper hover:border-cyan hover:text-cyan'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          <span className="sr-only">Filter by design</span>
          <select
            aria-label="Filter by design"
            value={design}
            onChange={(event) => setDesign(event.target.value)}
            className="min-h-11 max-w-full border border-paper/25 bg-panel px-4 py-3 font-display text-sm uppercase tracking-wide text-paper"
          >
            <option value="all">All five designs</option>
            {merchDesigns.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <article key={product.id} className="group overflow-hidden border border-line bg-panel transition-colors hover:border-cyan/60">
            <button
              type="button"
              className="relative block w-full overflow-hidden bg-[#e4e9f1] text-left"
              onClick={() => setSelected(product)}
              aria-label={`View ${product.title} ${product.productType} preview`}
            >
              <Image
                src={product.image}
                width={880}
                height={1000}
                sizes="(min-width: 1280px) 390px, (min-width: 640px) 45vw, 90vw"
                alt={`${product.title} artwork shown on a ${product.color.toLowerCase()} ${product.productType.toLowerCase()}`}
                className="aspect-[.9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute left-4 top-4 border border-gold/60 bg-ink/95 px-3 py-2 font-pixel text-[10px] uppercase tracking-wide text-gold">
                Preview only
              </span>
            </button>
            <div className="space-y-3 p-5">
              <p className="font-pixel text-[10px] uppercase tracking-[.12em] text-cyan">{product.collection}</p>
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-paper">{product.title}</h3>
                <p className="font-display text-sm uppercase tracking-[.16em] text-muted">{product.productType} • {product.color}</p>
              </div>
              <p className="min-h-12 text-sm leading-relaxed text-muted">{product.description}</p>
              <button
                type="button"
                onClick={() => setSelected(product)}
                className="min-h-11 w-full border border-paper/30 px-4 py-3 font-display text-sm uppercase tracking-[.15em] text-paper transition-colors hover:border-cyan hover:text-cyan"
              >
                View product preview
              </button>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="border border-line bg-panel p-8 text-center text-muted">No products match these filters.</p>
      ) : null}

      {selected ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/90 p-4 backdrop-blur-lg"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="merch-preview-title"
            className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-auto border border-cyan/30 bg-panel lg:grid-cols-2"
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center border border-paper/30 bg-ink text-3xl text-paper"
              onClick={() => setSelected(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            <Image
              src={selected.image}
              width={880}
              height={1000}
              alt={`${selected.title} ${selected.productType} mockup`}
              sizes="(min-width: 1024px) 500px, 90vw"
              className="h-full max-h-[65dvh] w-full bg-[#e4e9f1] object-contain lg:max-h-[92dvh]"
            />
            <div className="flex flex-col justify-center space-y-5 p-7 sm:p-12">
              <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Inaugural collection • Product preview</p>
              <h2 id="merch-preview-title" className="font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">{selected.title}</h2>
              <p className="font-display text-lg uppercase tracking-widest text-gold">{selected.productType}</p>
              <p className="leading-relaxed text-muted">{selected.description}</p>
              <p className="text-sm text-paper">Shown in <strong>{selected.color}</strong></p>
              <div className="border border-cyan/20 bg-ink/60 p-4 text-sm leading-relaxed text-muted">
                Concept mockup only. Sales are not open and final pricing, sizing, materials, and fulfillment details have not been confirmed.
              </div>
              <a href="#merch-updates" onClick={() => setSelected(null)} className="inline-flex min-h-11 items-center justify-center bg-gold px-5 py-4 font-display text-sm uppercase tracking-widest text-ink">
                Get collection updates
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
