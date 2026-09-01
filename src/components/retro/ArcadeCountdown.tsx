"use client";

import { useEffect, useState } from "react";
import { CRTPanel } from "@/components/retro/CRTPanel";
import { event, site } from "@/lib/site";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  started: boolean;
};

function remainingFrom(now: number): Remaining {
  const target = Date.parse(event.startDate);
  const diff = target - now;
  if (!Number.isFinite(target) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, started: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    started: false,
  };
}

function pad(value: number, size: number) {
  return String(value).padStart(size, "0");
}

export function ArcadeCountdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(remainingFrom(Date.now()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const days = remaining ? pad(remaining.days, 3) : "---";
  const hours = remaining ? pad(remaining.hours, 2) : "--";
  const minutes = remaining ? pad(remaining.minutes, 2) : "--";

  return (
    <CRTPanel label="Arcade timer · decorative">
      <p className="sr-only">
        Midwest Pixel Fest begins {site.dateLongLabel} at 10:00 AM in {site.location}.
      </p>
      <div aria-hidden="true" className="text-center">
        <p className="font-pixel text-[11px] uppercase tracking-[0.28em] text-magenta">
          Player 1 ready
        </p>
        {remaining?.started ? (
          <p className="mt-4 font-display text-3xl uppercase tracking-wide text-gold">
            The weekend is here
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <ScoreCell value={days} unit="Days" />
            <ScoreCell value={hours} unit="Hours" />
            <ScoreCell value={minutes} unit="Minutes" />
          </div>
        )}
      </div>
    </CRTPanel>
  );
}

function ScoreCell({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="border border-line bg-ink/60 px-1 py-3">
      <p className="font-pixel text-2xl tabular-nums text-gold sm:text-3xl">{value}</p>
      <p className="mt-1 font-pixel text-[9px] uppercase tracking-[0.18em] text-cyan">
        {unit}
      </p>
    </div>
  );
}
