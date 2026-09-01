import { cn } from "@/lib/cn";
import { event, site } from "@/lib/site";

type EventInfoPanelProps = {
  className?: string;
  compact?: boolean;
};

export function EventInfoPanel({ className, compact = false }: EventInfoPanelProps) {
  return (
    <aside
      className={cn(
        "hud-glow border border-line bg-panel",
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8",
        className,
      )}
      aria-label="Event information"
    >
      <p className="font-pixel text-[10px] uppercase tracking-[0.28em] text-cyan">
        Event data
      </p>
      <p className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide text-paper sm:text-3xl">
        {event.name}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">When</dt>
          <dd className="mt-1 font-display text-sm uppercase tracking-[0.12em] text-paper sm:text-base">
            {site.dateLabel}
          </dd>
        </div>
        <div>
          <dt className="font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">Where</dt>
          <dd className="mt-1 font-display text-sm uppercase tracking-[0.12em] text-paper sm:text-base">
            {site.location}
          </dd>
        </div>
        <div>
          <dt className="font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">Venue</dt>
          <dd className="mt-1 font-display text-sm uppercase tracking-[0.12em] text-paper sm:text-base">
            Venue announcement coming
          </dd>
        </div>
      </dl>
    </aside>
  );
}
