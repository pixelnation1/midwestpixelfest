"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { TicketCta } from "@/components/cta/TicketCta";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { mobileMoreLinks, navItems, site } from "@/lib/site";

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
      <Container className="flex h-[3.75rem] items-center justify-between gap-3 lg:h-[4.5rem] lg:gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center text-paper no-underline"
          aria-label={`${site.name} home`}
        >
          <SiteLogo variant="header" priority />
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 items-center lg:flex">
          <ul className="flex items-center">
            {navItems.map((item) => {
              const isHash = item.href.includes("#");
              const active = isHash
                ? false
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-block whitespace-nowrap px-2 py-2 font-display text-[12px] uppercase tracking-[0.12em] transition-colors xl:px-2.5 xl:text-[13px] xl:tracking-[0.14em]",
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

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden sm:inline-flex">
            <TicketCta intent="nav" source="header" />
          </span>
          <span className="inline-flex sm:hidden">
            <TicketCta intent="nav" size="md" className="px-3 text-xs" source="header" />
          </span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-paper/20 text-paper lg:hidden"
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
          className="border-t border-line bg-ink lg:hidden"
        >
          <Container className="flex max-h-[calc(100dvh-3.75rem)] flex-col overflow-y-auto py-6">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                className="min-h-11 px-3 font-display text-sm uppercase tracking-[0.16em] text-cyan"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                <li className="border-b border-line">
                  <Link
                    href="/tickets"
                    className="flex min-h-12 items-center justify-between py-3 font-display text-2xl uppercase tracking-[0.12em] text-magenta"
                    aria-current={pathname === "/tickets" ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    Tickets
                    <span aria-hidden="true" className="text-cyan">
                      ▸
                    </span>
                  </Link>
                </li>
                {navItems.map((item) => {
                  const isHash = item.href.includes("#");
                  const active = isHash
                    ? false
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href} className="border-b border-line">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex min-h-12 items-center justify-between py-3 font-display text-2xl uppercase tracking-[0.12em]",
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
              <p className="mt-8 font-pixel text-[11px] uppercase tracking-[0.2em] text-gold">
                More
              </p>
              <ul className="mt-3 flex flex-col">
                {mobileMoreLinks.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      className="flex min-h-11 items-center py-3 font-display text-lg uppercase tracking-[0.12em] text-muted"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6">
              <TicketCta
                intent="nav"
                size="lg"
                className="w-full"
                source="header"
                onClick={() => setOpen(false)}
              />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
