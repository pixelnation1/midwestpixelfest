"use client";

import { useState } from "react";
import {
  visitCategories,
  visitMapUrl,
  visitPlaces,
  type VisitCategory,
} from "@/content/visit-emporia";

type Selection = "all" | VisitCategory;

const accentByCategory: Record<VisitCategory, string> = {
  family: "border-gold/65",
  gaming: "border-magenta/65",
  arts: "border-cyan/65",
  dining: "border-gold/65",
  outdoors: "border-lime/65",
  shopping: "border-cyan/65",
};

const symbols: Record<VisitCategory, string> = {
  family: "★",
  gaming: "▶",
  arts: "✦",
  dining: "◈",
  outdoors: "✳",
  shopping: "◆",
};

const labels: Record<VisitCategory, string> = {
  family: "Family",
  gaming: "Games",
  arts: "Arts",
  dining: "Dining",
  outdoors: "Outdoors",
  shopping: "Shopping",
};

export function VisitDirectory() {
  const [category, setCategory] = useState<Selection>("all");
  const [search, setSearch] = useState("");

  const query = search.trim().toLocaleLowerCase();
  const shown = visitPlaces.filter((place) =>
    (category === "all" || place.category.includes(category)) &&
    (!query || [place.name, place.short, place.label, place.address].some(
      (value) => value.toLocaleLowerCase().includes(query),
    )),
  );

  return (
    <div>
      <div className="mb-7 flex flex-col gap-5 border-b border-white/15 pb-7">
        <div role="group" aria-label="Explore Emporia by interest" className="flex flex-wrap gap-2">
          {visitCategories.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={category === option.id}
              onClick={() => setCategory(option.id)}
              className={
                "min-h-11 border px-4 py-2 font-display text-sm uppercase tracking-[.09em] transition-colors " +
                (category === option.id
                  ? "border-cyan bg-cyan font-semibold text-ink"
                  : "border-white/25 bg-panel text-paper hover:border-cyan hover:text-cyan")
              }
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="flex max-w-xl flex-col gap-2 text-sm text-paper">
          <span className="font-pixel text-[11px] uppercase tracking-[.12em] text-cyan">Looking for something specific?</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search attractions, food, activities..."
            className="min-h-12 w-full border border-white/30 bg-[#151325] px-4 py-3 text-base text-paper placeholder:text-muted/80 focus-visible:outline-cyan"
          />
        </label>
      </div>

      <p className="mb-5 font-pixel text-[11px] uppercase tracking-[.1em] text-muted" role="status">
        {shown.length} {shown.length === 1 ? "place" : "places"} to explore
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((place) => {
          const primary = place.category[0];
          return (
            <article
              key={place.slug}
              className={
                "group flex h-full flex-col border border-line border-t-4 bg-panel p-5 transition-colors hover:border-cyan/70 sm:p-6 " +
                accentByCategory[primary]
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-pixel text-[10px] uppercase tracking-[.12em] text-gold">{place.label}</span>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 bg-ink/60 text-xl text-cyan">{symbols[primary]}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl uppercase leading-tight tracking-wide text-paper">{place.name}</h3>
              {place.highlight ? (
                <p className="mt-3 inline-flex self-start border border-gold/40 bg-gold/10 px-3 py-1 font-display text-sm uppercase tracking-[.08em] text-gold">
                  {place.highlight}
                </p>
              ) : null}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:text-base">{place.short}</p>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-paper/70">{place.address}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={place.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-cyan px-3 py-2 font-display text-xs uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-ink"
                >
                  Visitor details <span className="sr-only">(opens in new tab)</span>
                </a>
                <a
                  href={visitMapUrl(place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-paper/25 px-3 py-2 font-display text-xs uppercase tracking-widest text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  Directions <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="border border-line bg-panel p-8 text-center">
          <h3 className="font-display text-xl uppercase tracking-wide text-paper">No matches yet</h3>
          <p className="mt-2 text-muted">Try another category or clear your search.</p>
          <button
            type="button"
            onClick={() => { setSearch(""); setCategory("all"); }}
            className="mt-5 min-h-11 border border-cyan px-5 py-2 font-display text-sm uppercase tracking-wide text-cyan"
          >
            Show all places
          </button>
        </div>
      ) : null}

      <p className="mt-7 text-xs leading-relaxed text-muted">
        Places are listed for visitor information, not as official Midwest Pixel Fest sponsors or partners.
        Hours, admission, age limits and offerings can change. Check each venue before visiting in October 2027.
      </p>
    </div>
  );
}
