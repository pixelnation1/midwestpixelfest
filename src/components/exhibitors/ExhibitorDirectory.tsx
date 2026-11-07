"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PublicVendorCard } from "@/lib/persistence/directory";
import { parseAllowedHttpUrl } from "@/lib/safe-url";

const types = [
  { value: "all", label: "All exhibitors" },
  { value: "Vendor Hall", label: "Vendor Hall" },
  { value: "Artist Alley", label: "Artist Alley" },
  { value: "Cosplay Creator / Vendor", label: "Cosplay creators" },
] as const;

function Logo({ vendor }: { vendor: PublicVendorCard }) {
  const src = vendor.logo ? parseAllowedHttpUrl(vendor.logo)?.href : undefined;
  const initial = vendor.displayName.trim().slice(0, 1).toUpperCase() || "★";
  return (
    <span className="relative flex aspect-[5/4] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_30%,rgba(45,226,255,.15),transparent_50%),radial-gradient(circle_at_75%_70%,rgba(255,45,149,.15),transparent_55%)]">
      {src ? (
        // Approved external logos are unoptimized to support various vendor hosts.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={vendor.displayName + " logo"} loading="lazy"
          className="h-full w-full object-contain p-5" />
      ) : (
        <span aria-hidden="true" className="font-display text-7xl font-bold text-cyan/70 sm:text-8xl">{initial}</span>
      )}
    </span>
  );
}

export function ExhibitorDirectory({ vendors }: { vendors: PublicVendorCard[] }) {
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const categories = useMemo(
    () => Array.from(new Set(vendors.map(v => v.category.trim()).filter(Boolean))).sort(),
    [vendors],
  );
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return vendors.filter(v =>
      (type === "all" || v.exhibitorType === type) &&
      (category === "all" || v.category === category) &&
      (!term || [v.displayName, v.category, v.shortDescription, v.boothLocation ?? ""]
        .some(x => x.toLocaleLowerCase().includes(term))),
    );
  }, [vendors, type, category, search]);

  if (vendors.length === 0) {
    return <div className="border border-cyan/30 bg-panel px-6 py-12 text-center sm:px-12 sm:py-16">
      <p className="font-pixel text-[11px] uppercase tracking-[.2em] text-cyan">Lineup loading</p>
      <h2 className="mt-4 font-display text-4xl uppercase leading-tight tracking-wide text-paper sm:text-5xl">
        The marketplace is taking shape.
      </h2>
      <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
        Confirmed exhibitors and Artist Alley creators will appear here as they are approved
        for publication. No participating businesses have been announced yet.
      </p>
      <Link href="/vendors" className="mt-7 inline-flex min-h-11 items-center justify-center border border-cyan px-6 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10">
        Interested in exhibiting?
      </Link>
    </div>;
  }

  return <div>
    <div className="mb-8 border-b border-line pb-7">
      <div role="group" aria-label="Exhibitor type" className="flex flex-wrap gap-2">
        {types.map(t => <button key={t.value} type="button" aria-pressed={type === t.value}
          onClick={() => setType(t.value)}
          className={"min-h-11 border px-3 py-3 font-display text-xs uppercase tracking-[.08em] transition-colors sm:px-5 sm:text-sm " +
            (type === t.value ? "border-cyan bg-cyan text-ink" : "border-paper/25 bg-panel text-paper hover:border-cyan hover:text-cyan")}
        >{t.label}</button>)}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_minmax(180px,240px)]">
        <label className="block text-sm text-muted">
          Search exhibitors
          <input type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Name, product or category..."
            className="mt-2 min-h-12 w-full border border-paper/30 bg-panel px-4 py-3 text-base text-paper placeholder:text-muted/70 focus:border-cyan focus:outline-none" />
        </label>
        <label className="block text-sm text-muted">
          Shop by category
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="mt-2 min-h-12 w-full border border-paper/30 bg-panel px-4 py-3 text-base text-paper focus:border-cyan focus:outline-none">
            <option value="all">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="mt-5 font-pixel text-[11px] uppercase tracking-widest text-gold">
        {filtered.length} {filtered.length === 1 ? "exhibitor" : "exhibitors"} found
      </p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map(v => <article key={v.id}
        className="group flex min-w-0 flex-col overflow-hidden border border-line bg-panel transition-colors hover:border-cyan/60">
        <Link href={"/exhibitors/" + v.id} aria-label={"View " + v.displayName + " exhibitor profile"}
          className="block border-b border-line bg-ink-2">
          <Logo vendor={v} />
        </Link>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-pixel text-[10px] uppercase tracking-widest text-cyan">{v.exhibitorType}</span>
            {v.featured && <span className="font-pixel text-[10px] uppercase text-gold">Featured</span>}
          </div>
          <h3 className="mt-3 break-words font-display text-2xl uppercase tracking-wide text-paper">
            <Link href={"/exhibitors/" + v.id} className="hover:text-cyan">{v.displayName}</Link>
          </h3>
          {v.category && <p className="mt-2 text-sm text-gold">{v.category}</p>}
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
            {v.shortDescription || "Meet this confirmed exhibitor and discover what they bring to the show."}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-xs text-muted">Booth: <span className="text-paper">{v.boothLocation || "To be assigned"}</span></p>
            <Link href={"/exhibitors/" + v.id} className="shrink-0 font-display text-xs uppercase tracking-wide text-cyan hover:text-gold">
              View profile →
            </Link>
          </div>
        </div>
      </article>)}
    </div>
    {filtered.length === 0 && <div className="border border-line bg-panel p-10 text-center">
      <h3 className="font-display text-2xl uppercase text-paper">No matches found</h3>
      <p className="mt-2 text-muted">Try a different search or category.</p>
      <button type="button" onClick={() => {setType("all");setCategory("all");setSearch("");}}
        className="mt-5 min-h-11 border border-cyan px-5 py-2 font-display text-sm uppercase text-cyan">Clear filters</button>
    </div>}
  </div>;
}
