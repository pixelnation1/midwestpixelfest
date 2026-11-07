'use client';

import { useState } from "react";

const items = [
  "Save your ticket confirmation or admission details",
  "Check the latest event location and entry instructions",
  "Wear comfortable shoes and layers",
  "Bring a charged phone and portable charger",
  "Plan your spending and preferred payment methods",
  "Check prop, bag, and family policies before leaving",
  "Leave room for water, food, and a break",
];

export function VisitChecklist() {
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <div className="border border-cyan/30 bg-panel p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-xl uppercase tracking-wide text-paper">Ready, player one?</p>
        <p role="status" className="font-pixel text-[11px] text-gold">{checked.length} / {items.length} READY</p>
      </div>
      <div
        className="mt-4 h-2 w-full overflow-hidden bg-ink"
        role="progressbar"
        aria-label="Packing checklist progress"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={checked.length}
      >
        <div className="h-full bg-cyan transition-all" style={{ width: (checked.length / items.length) * 100 + "%" }} />
      </div>
      <ul className="mt-5 space-y-2">
        {items.map((item, index) => (
          <li key={item}>
            <label className="flex min-h-12 cursor-pointer items-center gap-3 border border-line bg-ink/45 px-3 py-2 hover:border-cyan/40">
              <input
                type="checkbox"
                checked={checked.includes(index)}
                onChange={(event) => setChecked((old) => event.target.checked ? [...old, index] : old.filter((value) => value !== index))}
                className="h-5 w-5 shrink-0 accent-[#2de2ff]"
              />
              <span className={checked.includes(index) ? "text-muted line-through" : "text-paper/95"}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-5 min-h-11 font-display text-xs uppercase tracking-widest text-cyan underline underline-offset-4 hover:text-gold" onClick={() => setChecked([])}>
        Reset checklist
      </button>
      <p className="mt-2 text-xs text-muted">Your checks stay on this page only and reset when you reload it.</p>
    </div>
  );
}
