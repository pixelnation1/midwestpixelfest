'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { merchDesigns, merchProducts } from '@/lib/merch';

const categories = [
  { value: 'all', label: 'All Merchandise' },
  { value: 'tee', label: 'T-Shirts' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'tote', label: 'Tote Bags' },
] as const;

type Category = (typeof categories)[number]['value'];
type Product = (typeof merchProducts)[number];

export function MerchGallery() {
  const [category, setCategory] = useState<Category>('all');
  const [design, setDesign] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected]);

  const products = merchProducts.filter(
    (item) =>
      (category === 'all' || item.category === category) &&
      (design === 'all' || item.designSlug === design),
  );

  return (
    <>
      <div className="mb-9 flex flex-col gap-4 border-b border-white/20 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Merchandise categories" className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={
                'min-h-11 border px-3 py-3 font-display text-xs uppercase tracking-[.11em] transition-colors sm:px-5 sm:text-sm ' +
                (category === item.value
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/30 bg-[#153e75] text-white hover:border-gold hover:text-gold')
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-2 font-display text-xs uppercase tracking-[.16em] text-white/90 sm:flex-row sm:items-center">
          <span>Design</span>
          <select
            aria-label="Filter products by design"
            value={design}
            onChange={(event) => setDesign(event.target.value)}
            className="min-h-11 min-w-0 border border-white/40 bg-[#153e75] px-4 py-3 font-display text-sm uppercase tracking-wide text-white sm:min-w-52"
          >
            <option value="all">All Designs</option>
            {merchDesigns.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div aria-live="polite" className="sr-only">{products.length} items in this category.</div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:gap-x-7">
        {products.map((product) => (
          <article key={product.id} className="group min-w-0 text-center">
            <button
              type="button"
              onClick={() => setSelected(product)}
              aria-label={'View details for ' + product.title + ' ' + product.productType}
              className="block w-full cursor-zoom-in text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="relative block aspect-square w-full overflow-hidden border border-white/15 bg-[#e7e9ee] shadow-[0_10px_28px_rgba(0,0,0,.18)]">
                <Image
                  src={product.image}
                  fill
                  sizes="(min-width: 1280px) 255px, (min-width: 1024px) 21vw, (min-width: 640px) 30vw, 46vw"
                  alt={product.title + ' on a ' + product.color.toLowerCase() + ' ' + product.productType.toLowerCase()}
                  className="object-contain transition-transform duration-200 group-hover:scale-[1.035]"
                />
              </span>
              <span className="mt-4 block font-display text-base uppercase leading-snug tracking-[.05em] text-white sm:text-xl">
                {product.title}
              </span>
              <span className="mt-1 block font-display text-sm uppercase tracking-[.12em] text-white/90">
                {product.productType}
              </span>
            </button>
            <p className="mt-2 font-display text-sm uppercase tracking-[.16em] text-gold">Coming Soon</p>
          </article>
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-14 text-center font-display text-xl uppercase tracking-widest text-white">
          No items in this category.
        </p>
      )}

      {selected && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/95 p-3 backdrop-blur-md sm:p-6"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="merch-product-title"
            className="relative grid max-h-[94dvh] w-full max-w-4xl overflow-auto border border-cyan/40 bg-panel lg:grid-cols-[1.1fr_.9fr]"
          >
            <button
              type="button"
              autoFocus
              aria-label="Close product details"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center border border-paper/30 bg-ink text-3xl text-paper"
            >×</button>
            <div className="relative aspect-square bg-[#e7e9ee]">
              <Image
                src={selected.image}
                fill
                sizes="(min-width: 1024px) 480px, 95vw"
                className="object-contain"
                alt={selected.title + ' ' + selected.productType}
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
              <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Official Midwest PixelFest Merchandise</p>
              <h2 id="merch-product-title" className="font-display text-4xl uppercase leading-none text-paper sm:text-5xl">{selected.title}</h2>
              <p className="font-display text-xl uppercase tracking-wide text-gold">{selected.productType} · {selected.color}</p>
              <p className="leading-relaxed text-muted">{selected.description}</p>
              <p className="border-t border-line pt-5 font-display text-lg uppercase tracking-widest text-cyan">Coming Soon</p>
              <p className="text-sm leading-relaxed text-muted">Orders are not open yet. Get notified when the first collection drops.</p>
              <a
                href="#merch-updates"
                onClick={() => setSelected(null)}
                className="inline-flex min-h-11 items-center justify-center bg-gold px-5 py-3 font-display text-sm uppercase tracking-widest text-ink"
              >Get launch updates</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
