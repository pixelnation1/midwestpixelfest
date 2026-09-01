import Link from "next/link";
import { PhotoSlot } from "@/components/retro/PhotoSlot";
import { Badge } from "@/components/ui/Badge";
import type { GuestProfile } from "@/content/guests";

type GuestCardProps = {
  guest: GuestProfile;
};

export function GuestCard({ guest }: GuestCardProps) {
  return (
    <Link
      href={`/guests/${guest.slug}`}
      className="arcade-select group flex h-full flex-col border border-line bg-panel hover:border-magenta"
    >
      <PhotoSlot
        src={guest.image}
        alt=""
        className="aspect-[3/4] w-full"
        label={guest.role}
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">
          {guest.category ?? guest.role}
        </p>
        <h2 className="mt-2 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
          {guest.name}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{guest.bio}</p>
        <span className="mt-4 font-pixel text-[11px] uppercase tracking-[0.18em] text-cyan group-hover:text-magenta">
          Profile ▸
        </span>
      </div>
    </Link>
  );
}

export function GuestAnnouncementCard() {
  return (
    <article className="flex h-full flex-col border border-line bg-panel">
      <PhotoSlot className="aspect-[3/4] w-full" label="Announcement coming">
        <svg viewBox="0 0 240 320" className="h-full w-full" aria-hidden="true">
          <rect width="240" height="320" fill="#100d18" />
          <circle cx="120" cy="88" r="34" fill="none" stroke="#ff2d95" strokeWidth="2" opacity="0.7" />
          <circle cx="120" cy="88" r="8" fill="#2de2ff" />
          <path d="M70 250c14-78 28-108 50-108s36 30 50 108H70z" fill="#ff2d95" opacity="0.18" />
          <rect x="88" y="168" width="64" height="8" fill="#ffd84d" opacity="0.5" />
        </svg>
      </PhotoSlot>
      <div className="p-5">
        <Badge tone="magenta">TBA</Badge>
        <h3 className="mt-3 font-display text-2xl uppercase tracking-wide">
          Guest slot
        </h3>
        <p className="mt-2 text-sm text-muted">
          Confirmed names will appear here with photos and appearance details.
        </p>
      </div>
    </article>
  );
}
