import type { Metadata } from "next";
import { CustomSponsorship } from "@/components/sponsors/CustomSponsorship";
import { PackageGrid } from "@/components/sponsors/PackageGrid";
import { SponsorFaq } from "@/components/sponsors/SponsorFaq";
import { SponsorLocalFit } from "@/components/sponsors/SponsorLocalFit";
import { SponsorOpportunities } from "@/components/sponsors/SponsorOpportunities";
import { SponsorPayment } from "@/components/sponsors/SponsorPayment";
import { SponsorProcess } from "@/components/sponsors/SponsorProcess";
import { SponsorshipComparison } from "@/components/sponsors/SponsorshipComparison";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { sponsorshipFaqs, whySponsorPoints } from "@/lib/sponsorships";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Midwest Pixel Fest Sponsorship | Kansas Convention Partnerships",
  description:
    "Sponsor Midwest Pixel Fest 2027 in Emporia, Kansas. Official gaming and pop-culture event partnership levels: Community $250, Bronze $500, Silver $1,000, Gold $2,500, Presenting $5,000+, and custom sponsorships. An inquiry is not an agreement.",
  path: "/sponsors",
});

const valueAreas = [
  {
    title: "Digital Visibility",
    body: "Sponsor-page recognition and digital materials that grow more prominent at higher levels.",
  },
  {
    title: "Social / Promotional Exposure",
    body: "Collective thank-yous at Community, dedicated recognition from Silver, and stronger social opportunities at Gold and Presenting.",
  },
  {
    title: "On-Site Event Visibility",
    body: "General sponsor signage begins at Bronze. Placement becomes more prominent as investment increases.",
  },
  {
    title: "Activation / Partnership Opportunities",
    body: "Giveaways, activity sponsorship, and on-site activations are eligible opportunities at higher levels — not automatic at $250 or $500.",
  },
];

export default function SponsorsPage() {
  return (
    <InnerPage
      path="/sponsors"
      breadcrumbLabel="Sponsors"
      eyebrow="Partnerships"
      title="Partner with Midwest Pixel Fest"
      intro="Supporting gaming, cosplay, collectibles, and community in the heart of the Midwest. Sponsorship gives businesses an opportunity to support the event while connecting with attendees and the surrounding community."
      meta={`${site.dateLabel} · ${site.location}`}
      mood="business"
      actions={[
        { href: "#packages", label: "View Sponsorship Opportunities" },
        {
          href: "/sponsors/inquiry",
          label: "Become a Sponsor",
          variant: "secondary",
        },
      ]}
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.sponsor_page_view} />
      <JsonLd data={buildFaqPageJsonLd(sponsorshipFaqs)} />

      <ContentSection title="Why sponsor">
        <p>
          Partnership helps stand up a new regional convention in Emporia and
          places your business alongside gaming, cosplay, collectibles, and
          community programming. We do not publish attendance, impression, or
          demographic claims.
        </p>
      </ContentSection>

      <ul className="grid gap-4 md:grid-cols-2">
        {whySponsorPoints.map((item) => (
          <li key={item.title} className="border border-line bg-panel p-6 sm:p-8">
            <h3 className="font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-3 text-muted">{item.body}</p>
          </li>
        ))}
      </ul>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {valueAreas.map((item) => (
          <li key={item.title} className="border border-line bg-panel-2 p-5 sm:p-6">
            <h3 className="font-display text-lg uppercase tracking-wide text-cyan">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-muted">{item.body}</p>
          </li>
        ))}
      </ul>

      <SponsorLocalFit />
      <PackageGrid />
      <SponsorshipComparison />
      <CustomSponsorship />
      <SponsorOpportunities />
      <SponsorProcess />
      <SponsorPayment />
      <SponsorFaq />

      <CtaStrip
        title="Ready to talk?"
        actions={[
          { href: "/sponsors/inquiry", label: "Become a Sponsor" },
          { href: "/about", label: "About Midwest Pixel Fest", variant: "secondary" },
          { href: "/press", label: "Press", variant: "secondary" },
        ]}
      >
        <p>
          Submitting this form expresses your interest in sponsoring Midwest
          Pixel Fest and does not by itself create a sponsorship agreement.
        </p>
      </CtaStrip>

      <RelatedLinks
        links={[
          { href: "/sponsors/inquiry", label: "Become a Sponsor" },
          { href: "/about", label: "About" },
          { href: "/vendors", label: "Vendors" },
          { href: "/press", label: "Press" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
