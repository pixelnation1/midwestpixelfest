import Image from "next/image";
import officialLogoImage from "../../../public/logo.jpg";
import { cn } from "@/lib/cn";

/**
 * Official mark lives at /public/logo.jpg (square JPEG on a white ground).
 * Do not crop or key out that background in code — it will look worse.
 * Transparent official logo recommended when a PNG/WebP with alpha exists.
 */

export const officialLogo = {
  src: officialLogoImage,
  alt: "Midwest Pixel Fest",
} as const;

const variants = {
  header: {
    className: "h-[44px] w-[44px] lg:h-[52px] lg:w-[52px]",
    sizes: "(min-width: 1024px) 52px, 44px",
  },
  footer: {
    className: "h-14 w-14",
    sizes: "56px",
  },
  hero: {
    className: "h-20 w-20 sm:h-32 sm:w-32 lg:h-44 lg:w-44",
    sizes: "(min-width: 1024px) 176px, (min-width: 640px) 128px, 80px",
  },
} as const;

type SiteLogoProps = {
  variant?: keyof typeof variants;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function SiteLogo({
  variant = "header",
  className,
  priority = false,
  decorative = false,
}: SiteLogoProps) {
  const spec = variants[variant];

  const image = (
    <Image
      src={officialLogo.src}
      alt={decorative ? "" : officialLogo.alt}
      priority={priority}
      sizes={spec.sizes}
      className={cn("shrink-0 object-contain", spec.className, className)}
    />
  );

  if (decorative) {
    return <span aria-hidden="true">{image}</span>;
  }

  return image;
}
