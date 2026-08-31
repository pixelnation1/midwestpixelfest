import { tickerItems } from "@/lib/site";

export function AnnouncementTicker() {
  const loop = [...tickerItems, ...tickerItems];

  return (
    <div
      className="overflow-hidden border-y border-line bg-panel"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max gap-8 py-3">
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 font-display text-sm uppercase tracking-[0.28em] text-paper/80"
          >
            {item}
            <span className="text-magenta">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
