import Image from "next/image";
import { cn } from "@/lib/cn";

export const officialLogo = {
  src: "/logo.jpg",
  width: 1254,
  height: 1254,
  alt: "Midwest Pixel Fest",
} as const;

const variants = {
  header: {
    className: "h-[44px] w-[44px] lg:h-[52px] lg:w-[52px]",
    sizes: "(min-width: 1024px) 52px, 44px",
    width: 104,
    height: 104,
  },
  footer: {
    className: "h-14 w-14",
    sizes: "56px",
    width: 112,
    height: 112,
  },
  hero: {
    className: "h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28",
    sizes: "(min-width: 1024px) 112px, (min-width: 640px) 96px, 80px",
    width: 224,
    height: 224,
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
      width={spec.width}
      height={spec.height}
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
