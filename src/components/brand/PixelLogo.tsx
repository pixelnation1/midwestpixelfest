import { cn } from "@/lib/cn";

type PixelLogoProps = {
  className?: string;
  size?: number;
};

export function PixelLogo({ className, size = 40 }: PixelLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="40" height="40" fill="#100d18" />
      <rect x="4" y="4" width="8" height="8" fill="#ff2d95" />
      <rect x="16" y="4" width="8" height="8" fill="#2de2ff" />
      <rect x="28" y="4" width="8" height="8" fill="#ffd84d" />
      <rect x="4" y="16" width="8" height="8" fill="#2de2ff" />
      <rect x="16" y="16" width="8" height="8" fill="#c6ff4d" />
      <rect x="28" y="16" width="8" height="8" fill="#ff2d95" />
      <rect x="4" y="28" width="8" height="8" fill="#ffd84d" />
      <rect x="16" y="28" width="8" height="8" fill="#ff2d95" />
      <rect x="28" y="28" width="8" height="8" fill="#2de2ff" />
    </svg>
  );
}
