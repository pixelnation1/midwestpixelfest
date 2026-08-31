type ExploreIconName = "gaming" | "cosplay" | "tcg" | "vendors" | "guests" | "panels";

type ExploreIconProps = {
  name: ExploreIconName;
};

export type { ExploreIconName };

export function ExploreIcon({ name }: ExploreIconProps) {
  const common = {
    width: 56,
    height: 56,
    viewBox: "0 0 56 56",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (name === "gaming") {
    return (
      <svg {...common}>
        <rect x="6" y="18" width="44" height="22" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="26" width="6" height="6" fill="currentColor" />
        <rect x="12" y="28" width="10" height="2" fill="currentColor" />
        <circle cx="38" cy="26" r="3" fill="currentColor" />
        <circle cx="44" cy="32" r="3" fill="currentColor" />
      </svg>
    );
  }

  if (name === "cosplay") {
    return (
      <svg {...common}>
        <circle cx="28" cy="18" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M16 44c2-10 8-14 12-14s10 4 12 14" stroke="currentColor" strokeWidth="2" />
        <path d="M20 16l-6-6M36 16l6-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "tcg") {
    return (
      <svg {...common}>
        <rect x="14" y="12" width="22" height="32" stroke="currentColor" strokeWidth="2" transform="rotate(-8 25 28)" />
        <rect x="20" y="12" width="22" height="32" stroke="currentColor" strokeWidth="2" />
        <rect x="26" y="20" width="10" height="8" fill="currentColor" />
      </svg>
    );
  }

  if (name === "vendors") {
    return (
      <svg {...common}>
        <path d="M8 24l20-12 20 12v20H8V24z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 24h40" stroke="currentColor" strokeWidth="2" />
        <rect x="24" y="32" width="8" height="12" fill="currentColor" />
      </svg>
    );
  }

  if (name === "guests") {
    return (
      <svg {...common}>
        <path
          d="M28 8l4 12h12l-10 8 4 12-10-7-10 7 4-12-10-8h12z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="8" y="14" width="40" height="24" stroke="currentColor" strokeWidth="2" />
      <path d="M16 38h24M20 42h16" stroke="currentColor" strokeWidth="2" />
      <rect x="18" y="20" width="20" height="8" fill="currentColor" />
    </svg>
  );
}
