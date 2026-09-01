import type { Metadata } from "next";
import { InnerPage } from "@/components/pages/InnerPage";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { ContentSection } from "@/components/ui/ContentSection";
import { createPageMetadata } from "@/lib/seo";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { getPublishedSponsors } from "@/lib/sponsorships";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsorship Partners | Midwest Pixel Fest 2027",
  description:
    "Confirmed sponsorship partners for Midwest Pixel Fest 2027 in Emporia, Kansas will be listed here when they are official.",
  path: "/sponsors/partners",
});

export default function SponsorPartnersPage() {
  const partners = getPublishedSponsors();

  return (
    <InnerPage
      path="/sponsors/partners"
      breadcrumbLabel="Partners"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Sponsors", path: "/sponsors" },
        { name: "Partners" },
      ]}
      eyebrow="Directory"
      title="Sponsorship partners"
      intro={`Confirmed partners for ${site.name} will appear here. Until a name is published on this page, it is not an official Midwest Pixel Fest sponsor.`}
      mood="business"
    >
      <ContentSection title="Partner announcements are coming.">
        <p>
          We do not list businesses as sponsors until an agreement is in place
          and the partner is ready to be public. This directory stays empty on
          purpose until then.
        </p>
      </ContentSection>

      {partners.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {partners.map((partner) => {
            const siteUrl = partner.website
              ? parseAllowedHttpUrl(partner.website)
              : null;
            return (
              <li key={partner.slug} className="border border-line bg-panel p-6 sm:p-8">
                <p className="font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
                  {partner.tier}
                </p>
                <h2 className="mt-3 font-display text-3xl uppercase tracking-wide">
                  {partner.name}
                </h2>
                {partner.description ? (
                  <p className="mt-3 text-muted">{partner.description}</p>
                ) : null}
                {siteUrl ? (
                  <p className="mt-4">
                    <a
                      href={siteUrl.toString()}
                      className="text-cyan underline-offset-2 hover:underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Visit website
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="border border-line bg-panel p-6 text-muted">
          No sponsors are announced yet. When a partnership is official, it will
          be listed here.
        </p>
      )}

      <CtaStrip
        className="mt-10"
        title="Want to be listed here?"
        actions={[
          { href: "/sponsors", label: "View Sponsorship Opportunities" },
          { href: "/sponsors/inquiry", label: "Become a Sponsor", variant: "secondary" },
        ]}
      >
        <p>
          Start with an inquiry. Listing on this page happens after a
          sponsorship is confirmed — not when the form is submitted.
        </p>
      </CtaStrip>
    </InnerPage>
  );
}
