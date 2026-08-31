import Link from "next/link";
import { PixelLogo } from "@/components/brand/PixelLogo";
import { Container } from "@/components/ui/Container";
import { navItems, site, socialLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-ink-2">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3 text-paper">
            <PixelLogo size={40} />
            <span className="font-display text-2xl uppercase tracking-[0.12em]">
              {site.name}
            </span>
          </Link>
          <p className="mt-4 max-w-md text-muted">
            A new regional convention for gaming, cosplay, collectibles, creators,
            and community.
          </p>
          <p className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-cyan">
            {site.location}
          </p>
          <p className="mt-1 font-pixel text-xs text-gold">{site.dateLabel}</p>
        </div>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-paper">
            Explore
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted transition-colors hover:text-magenta"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tickets"
                className="text-muted transition-colors hover:text-magenta"
              >
                Tickets
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-paper">
            Follow
          </h2>
          <ul className="mt-4 space-y-2">
            {socialLinks.map((item) => (
              <li key={item.name} className="text-muted">
                <span>{item.name}</span>
                <span className="ml-2 font-pixel text-[10px] uppercase tracking-widest text-gold">
                  Soon
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.name}. All rights reserved.
          </p>
          <p className="font-display uppercase tracking-[0.16em] text-paper/80">
            Presented by {site.organizer}
          </p>
        </Container>
      </div>
    </footer>
  );
}
