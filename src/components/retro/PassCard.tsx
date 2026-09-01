import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

type PassCardProps = {
  name: string;
  priceLabel: string;
  description: string;
  featured?: boolean;
};

export function PassCard({
  name,
  priceLabel,
  description,
  featured = false,
}: PassCardProps) {
  return (
    <article
      className={cn(
        "relative flex h-full overflow-hidden border bg-panel",
        featured ? "border-gold/70" : "border-line",
      )}
    >
      <div
        className="pass-notch hidden w-4 shrink-0 border-r border-line sm:block"
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="font-pixel text-[10px] uppercase tracking-[0.22em] text-cyan">
            Convention pass
          </p>
          {featured ? <Badge tone="gold">Full weekend</Badge> : null}
        </div>
        <h2 className="mt-4 font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {name}
        </h2>
        <p className="mt-4 font-pixel text-3xl uppercase tracking-[0.08em] text-gold">
          {priceLabel}
        </p>
        <p className="mt-3 flex-1 text-muted">{description}</p>
        <p className="mt-5 font-pixel text-[10px] uppercase tracking-[0.18em] text-muted">
          {site.dateLabel} · {site.location}
        </p>
      </div>
    </article>
  );
}
