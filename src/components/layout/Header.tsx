"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PixelLogo } from "@/components/brand/PixelLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { navItems, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled || open
          ? "border-line bg-ink/95 backdrop-blur-md"
          : "border-transparent bg-ink/40 backdrop-blur-sm",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-paper no-underline"
          aria-label={`${site.name} home`}
        >
          <PixelLogo size={36} />
          <span className="font-display text-[15px] leading-[0.9] uppercase tracking-[0.12em] sm:text-base">
            <span className="block text-[10px] tracking-[0.28em] text-cyan sm:text-[11px]">
              Midwest
            </span>
            Pixel Fest
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center xl:flex">
          <ul className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "px-2.5 py-2 font-display text-[13px] uppercase tracking-[0.14em] transition-colors",
                      active
                        ? "text-magenta"
                        : "text-paper/80 hover:text-cyan",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/tickets" size="md" className="hidden sm:inline-flex">
            Get Tickets
          </Button>
          <Button href="/tickets" size="md" className="px-3 text-xs sm:hidden">
            Get Tickets
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-paper/20 text-paper xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 bg-current transition-transform",
                  open && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-current transition-opacity",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 bg-current transition-transform",
                  open && "-translate-y-2 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="border-t border-line bg-ink xl:hidden"
        >
          <Container className="flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto py-6">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {navItems.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href} className="border-b border-line">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between py-4 font-display text-2xl uppercase tracking-[0.12em]",
                          active ? "text-magenta" : "text-paper",
                        )}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                        <span aria-hidden="true" className="text-cyan">
                          ▸
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-6">
              <Button
                href="/tickets"
                size="lg"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Get Tickets
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
