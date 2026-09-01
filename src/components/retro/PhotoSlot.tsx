import Image from "next/image";
import { cn } from "@/lib/cn";

type PhotoSlotProps = {
  src?: string | null;
  alt?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Reserved frame for future original photography.
 * Renders an original graphic until a local /public image path is supplied.
 */
export function PhotoSlot({
  src,
  alt = "",
  label,
  className,
  children,
}: PhotoSlotProps) {
  const hasImage = Boolean(src && src.startsWith("/"));

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-ink-2",
        className,
      )}
    >
      {hasImage && src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {children ?? <AbstractFill />}
        </div>
      )}
      {label ? (
        <p className="absolute inset-x-0 bottom-0 bg-ink/75 px-3 py-2 text-center font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">
          {label}
        </p>
      ) : null}
    </div>
  );
}

function AbstractFill() {
  return (
    <svg viewBox="0 0 240 320" className="h-full w-full text-paper/25" aria-hidden="true">
      <rect width="240" height="320" fill="#100d18" />
      <rect x="24" y="36" width="192" height="120" fill="currentColor" opacity="0.12" />
      <circle cx="120" cy="96" r="28" fill="currentColor" opacity="0.35" />
      <path d="M60 250c12-70 30-96 60-96s48 26 60 96H60z" fill="currentColor" opacity="0.28" />
    </svg>
  );
}
