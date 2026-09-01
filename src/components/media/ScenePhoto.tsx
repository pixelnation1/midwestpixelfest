import Image from "next/image";
import { cn } from "@/lib/cn";

type Overlay = "none" | "dark" | "crt" | "stage";

type ScenePhotoProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  objectPosition?: string;
  overlay?: Overlay;
  sizes?: string;
  className?: string;
  frame?: boolean;
};

export function ScenePhoto({
  src,
  alt,
  caption,
  priority = false,
  objectPosition = "center",
  overlay = "dark",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  frame = true,
}: ScenePhotoProps) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-ink-2",
        frame && "border border-line",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition }}
      />
      {overlay !== "none" ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            overlay === "dark" &&
              "bg-gradient-to-t from-ink/80 via-ink/25 to-magenta/15",
            overlay === "crt" &&
              "bg-gradient-to-t from-ink via-ink/45 to-ink/20",
            overlay === "stage" &&
              "bg-gradient-to-t from-ink/85 via-ink/20 to-magenta/25",
          )}
          aria-hidden="true"
        />
      ) : null}
      {overlay === "crt" ? (
        <div className="crt-scanlines absolute inset-0" aria-hidden="true" />
      ) : null}
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 z-[1] bg-ink/80 px-3 py-2 text-center font-pixel text-[10px] uppercase tracking-[0.2em] text-gold">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
