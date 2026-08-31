import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-magenta text-ink shadow-[4px_4px_0_0_var(--color-cyan)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-cyan)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_var(--color-cyan)]",
  secondary:
    "bg-transparent text-paper border-2 border-cyan shadow-[4px_4px_0_0_var(--color-magenta)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-cyan/10 hover:shadow-[6px_6px_0_0_var(--color-magenta)] active:translate-x-0.5 active:translate-y-0.5",
  ghost:
    "bg-transparent text-paper border border-paper/20 hover:border-magenta hover:text-magenta",
} as const;

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type Shared = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = Shared &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Shared & {
  href: string;
  disabled?: boolean;
  onClick?: () => void;
  external?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 font-display uppercase tracking-[0.14em] transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, disabled, onClick, external } = props;
    if (disabled) {
      return (
        <span className={cn(classes, "pointer-events-none opacity-60")} aria-disabled="true">
          {children}
        </span>
      );
    }
    const isRemote =
      Boolean(external) ||
      href.startsWith("http://") ||
      href.startsWith("https://");
    if (href.startsWith("mailto:") || isRemote) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          {...(isRemote
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
          {isRemote ? (
            <span className="sr-only"> (opens in a new tab)</span>
          ) : null}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
