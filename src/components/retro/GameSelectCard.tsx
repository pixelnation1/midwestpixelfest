import Link from "next/link";
import { ArcadeIcon, type ArcadeIconName } from "@/components/retro/ArcadeIcon";
import Image from "next/image";
import { cn } from "@/lib/cn";

const categoryPhotos: Partial<Record<ArcadeIconName, { src: string; position?: string }>> = {
  retro: { src: "/images/hero/retro-arcade-cabinets.jpg" },
  tcg: { src: "/images/tcg/mtg-match.jpg" },
  tabletop: { src: "/images/tabletop/tabletop-dice-session.jpg" },
  cosplay: { src: "/images/cosplay/convention-cosplayers.jpg", position: "center 52%" },
  vendors: { src: "/images/vendors/collectible-figurines.jpg" },
  guests: { src: "/images/guests/panel-microphone.jpg" },
};

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
  const photo = categoryPhotos[icon];

  return (
    <Link
      href={href}
      className={cn(
        "arcade-select group flex h-full flex-col border border-line bg-panel",
        colors.border,
        colors.glow,
      )}
    >
      <div className="relative flex h-52 items-center justify-center overflow-hidden border-b border-line bg-ink-2 sm:h-56">
        {photo ? (
          <>
            <Image src={photo.src} alt="" fill sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover saturate-[0.8] transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" style={{ objectPosition: photo.position ?? "center" }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel via-ink/10 to-ink/10" />
          </>
        ) : <ArcadeIcon name={icon} className={cn("relative h-20 w-20", colors.icon)} />}
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
