import { cn } from "@/lib/cn";

export type ArcadeIconName =
  | "retro"
  | "gaming"
  | "tcg"
  | "tabletop"
  | "cosplay"
  | "vendors"
  | "guests"
  | "panels"
  | "tournament"
  | "freeplay"
  | "joystick"
  | "cabinet"
  | "cartridge"
  | "trophy"
  | "dice"
  | "cards"
  | "mask"
  | "booth"
  | "star";

type ArcadeIconProps = {
  name: ArcadeIconName;
  className?: string;
};

const svgProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
};

export function ArcadeIcon({ name, className }: ArcadeIconProps) {
  const classes = cn("h-14 w-14", className);

  if (name === "retro" || name === "cabinet") {
    return (
      <svg {...svgProps} className={classes}>
        <rect x="14" y="6" width="36" height="28" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="10" width="28" height="16" fill="currentColor" opacity="0.25" />
        <rect x="18" y="10" width="28" height="16" stroke="currentColor" strokeWidth="2" />
        <path d="M14 34h36l6 18H8l6-18z" stroke="currentColor" strokeWidth="2" />
        <circle cx="26" cy="46" r="3" fill="currentColor" />
        <circle cx="38" cy="46" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (name === "joystick" || name === "gaming") {
    return (
      <svg {...svgProps} className={classes}>
        <rect x="8" y="34" width="48" height="18" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="40" width="8" height="8" fill="currentColor" />
        <rect x="12" y="42" width="12" height="4" fill="currentColor" />
        <circle cx="42" cy="42" r="3.5" fill="currentColor" />
        <circle cx="50" cy="46" r="3.5" fill="currentColor" />
        <path d="M28 34V18" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="14" r="6" fill="currentColor" />
      </svg>
    );
  }

  if (name === "tcg" || name === "cards") {
    return (
      <svg {...svgProps} className={classes}>
        <rect
          x="12"
          y="14"
          width="24"
          height="36"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(-10 24 32)"
        />
        <rect x="24" y="12" width="24" height="36" stroke="currentColor" strokeWidth="2" />
        <rect x="30" y="20" width="12" height="10" fill="currentColor" />
        <path d="M30 36h12M30 40h8" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "tabletop" || name === "dice") {
    return (
      <svg {...svgProps} className={classes}>
        <rect x="10" y="18" width="28" height="28" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="26" r="2.5" fill="currentColor" />
        <circle cx="30" cy="38" r="2.5" fill="currentColor" />
        <circle cx="24" cy="32" r="2.5" fill="currentColor" />
        <path d="M38 22l14 8-10 18-14-8 10-18z" stroke="currentColor" strokeWidth="2" />
        <circle cx="46" cy="34" r="2.5" fill="currentColor" />
      </svg>
    );
  }

  if (name === "cosplay" || name === "mask") {
    return (
      <svg {...svgProps} className={classes}>
        <circle cx="32" cy="20" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M18 52c4-16 10-22 14-22s10 6 14 22" stroke="currentColor" strokeWidth="2" />
        <path d="M22 16l-8-10M42 16l8-10" stroke="currentColor" strokeWidth="2" />
        <path d="M24 20h4M36 20h4" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "vendors" || name === "booth") {
    return (
      <svg {...svgProps} className={classes}>
        <path d="M8 28l24-16 24 16v24H8V28z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 28h48" stroke="currentColor" strokeWidth="2" />
        <rect x="28" y="36" width="8" height="16" fill="currentColor" />
        <rect x="16" y="34" width="10" height="6" stroke="currentColor" strokeWidth="2" />
        <rect x="38" y="34" width="10" height="6" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "guests" || name === "star") {
    return (
      <svg {...svgProps} className={classes}>
        <path
          d="M32 8l5 14h15l-12 9 5 15-13-9-13 9 5-15-12-9h15z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (name === "tournament" || name === "trophy") {
    return (
      <svg {...svgProps} className={classes}>
        <path d="M20 12h24v14c0 10-6 16-12 16s-12-6-12-16V12z" stroke="currentColor" strokeWidth="2" />
        <path d="M20 16h-8v6c0 6 4 10 8 10M44 16h8v6c0 6-4 10-8 10" stroke="currentColor" strokeWidth="2" />
        <path d="M28 42h8v6h-8zM22 48h20v4H22z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "freeplay") {
    return (
      <svg {...svgProps} className={classes}>
        <rect x="18" y="10" width="28" height="18" stroke="currentColor" strokeWidth="2" />
        <path d="M22 16h8M22 20h12" stroke="currentColor" strokeWidth="2" />
        <rect x="24" y="28" width="16" height="6" fill="currentColor" />
        <path d="M20 34h24v16H20z" stroke="currentColor" strokeWidth="2" />
        <circle cx="28" cy="42" r="2.5" fill="currentColor" />
        <circle cx="36" cy="42" r="2.5" fill="currentColor" />
      </svg>
    );
  }

  if (name === "cartridge") {
    return (
      <svg {...svgProps} className={classes}>
        <path d="M16 16h32v32H16V16z" stroke="currentColor" strokeWidth="2" />
        <path d="M20 16v-4h24v4" stroke="currentColor" strokeWidth="2" />
        <rect x="22" y="24" width="20" height="12" fill="currentColor" opacity="0.35" />
        <rect x="22" y="24" width="20" height="12" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg {...svgProps} className={classes}>
      <rect x="8" y="16" width="48" height="26" stroke="currentColor" strokeWidth="2" />
      <path d="M18 42h28M22 48h20" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="22" width="28" height="10" fill="currentColor" />
    </svg>
  );
}
