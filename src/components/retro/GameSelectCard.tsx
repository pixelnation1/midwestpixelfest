import Link from "next/link";
import { ArcadeIcon, type ArcadeIconName } from "@/components/retro/ArcadeIcon";
import { cn } from "@/lib/cn";

const accent = {
  cyan: {
    border: "hover:border-cyan focus-visible:border-cyan",
    glow: "hover:shadow-[0_0_0_1px_var(--color-cyan),0_0_28px_rgba(45,226,255,0.18)]",
    icon: "text-cyan",
    meta: "text-cyan",
  },
  magenta: {
    border: "hover:border-magenta focus-visible:border-magenta",
    glow: "hover:shadow-[0_0_0_1px_var(--color-magenta),0_0_28px_rgba(255,45,149,0.2)]",
    icon: "text-magenta",
    meta: "text-magenta",
  },
  gold: {
    border: "hover:border-gold focus-visible:border-gold",
    glow: "hover:shadow-[0_0_0_1px_var(--color-gold),0_0_28px_rgba(255,216,77,0.16)]",
    icon: "text-gold",
    meta: "text-gold",
  },
  lime: {
    border: "hover:border-lime focus-visible:border-lime",
    glow: "hover:shadow-[0_0_0_1px_var(--color-lime),0_0_28px_rgba(198,255,77,0.16)]",
    icon: "text-lime",
    meta: "text-lime",
  },
} as const;

export type GameSelectAccent = keyof typeof accent;

type GameSelectCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ArcadeIconName;
  tone?: GameSelectAccent;
  index?: number;
  cta?: string;
};

export function GameSelectCard({
  href,
  title,
  description,
  icon,
  tone = "cyan",
  index,
  cta = "Enter",
}: GameSelectCardProps) {
  const colors = accent[tone];

  return (
    <Link
      href={href}
      className={cn(
        "arcade-select group flex h-full flex-col border border-line bg-panel",
        colors.border,
        colors.glow,
      )}
    >
      <div
        className={cn(
          "relative flex min-h-[7.5rem] items-center justify-center overflow-hidden border-b border-line bg-ink-2",
          colors.icon,
        )}
      >
        <div className="pointer-events-none absolute inset-0 pixel-dots opacity-40" />
        <ArcadeIcon name={icon} className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {index != null ? (
          <p className={cn("font-pixel text-[10px] uppercase tracking-[0.22em]", colors.meta)}>
            Select {String(index).padStart(2, "0")}
          </p>
        ) : null}
        <h3 className="mt-2 font-display text-2xl uppercase leading-tight tracking-wide text-paper sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
        <span
          className={cn(
            "mt-5 font-pixel text-[11px] uppercase tracking-[0.18em] text-paper/70 transition-colors group-hover:text-inherit",
            colors.meta,
          )}
        >
          {cta} ▸
        </span>
      </div>
    </Link>
  );
}
