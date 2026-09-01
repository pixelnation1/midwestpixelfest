import Link from "next/link";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { PixelSkyline } from "@/components/retro/PixelSkyline";
import { Container } from "@/components/ui/Container";
import {
  footerGroups,
  footerLegalLinks,
  getPublishedSocialLinks,
  site,
} from "@/lib/site";

export function Footer() {
  const copyrightYear = new Date().getFullYear();
  const social = getPublishedSocialLinks();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-ink-2">
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <PixelSkyline />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-40"
        aria-hidden="true"
      >
        <div className="hero-floor h-full w-full" />
      </div>
      <Container className="relative grid gap-10 pt-16 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-paper"
            aria-label={`${site.name} home`}
          >
            <SiteLogo variant="footer" />
          </Link>
          <p className="mt-4 font-display text-2xl uppercase tracking-[0.12em] text-paper">
            {site.name}
          </p>
          <p className="mt-4 font-pixel text-xs text-gold">{site.dateLabel}</p>
          <p className="mt-1 font-display text-sm uppercase tracking-[0.2em] text-cyan">
            {site.location}
          </p>
          <p className="mt-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-muted">
            {site.tagline}
          </p>
          <p className="mt-2 text-sm text-muted">
            Presented by{" "}
            <a
              href={site.organizerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan transition-colors hover:text-magenta"
            >
              {site.organizer}
            </a>
          </p>
          <p className="mt-4 max-w-md text-muted">
            A regional convention for gaming, cosplay, collectibles, creators,
            and community.
          </p>
          <p className="mt-1 text-sm text-muted">{site.venueLabel}</p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.heading}>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-paper">
              {group.heading}
            </p>
            <ul className="mt-4 space-y-2">
              {group.links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-magenta"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-6 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>
            © {copyrightYear} {site.name}. All rights reserved.
          </p>
          <p className="max-w-xl text-xs leading-relaxed">
            Photos are illustrative licensed imagery, not Midwest Pixel Fest
            event photography. Arcade row: Arcade Perfect,{" "}
            <a
              href="https://creativecommons.org/licenses/by/2.0/"
              className="text-cyan transition-colors hover:text-magenta"
              rel="noopener noreferrer"
            >
              CC BY 2.0
            </a>
            .
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {footerLegalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cyan">
                  {item.label}
                </Link>
              </li>
            ))}
            {social.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cyan"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-display uppercase tracking-[0.16em] text-paper/80">
            Presented by{" "}
            <a
              href={site.organizerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan transition-colors hover:text-magenta"
            >
              {site.organizer}
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
