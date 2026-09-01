import type { Metadata } from "next";
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
import { sponsorshipFaqs } from "@/lib/sponsorships";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsor Midwest Pixel Fest 2027 | Kansas Convention Partnerships",
  description:
    "Official sponsorship levels for Midwest Pixel Fest 2027 in Emporia, Kansas — Community $250, Bronze $500, Silver $1,000, Gold $2,500, Presenting $5,000+, and custom partnerships. An inquiry is not an agreement.",
  path: "/sponsors",
});

const whyPoints = [
  {
    title: "Meet the floor, not a generic audience slide",
    body: "Midwest Pixel Fest is being built for people who play games, wear costumes, trade cards, and spend a weekend in a convention hall. Sponsorship puts your business next to that community in Emporia.",
  },
  {
    title: "Help launch a new regional weekend",
    body: "This is the inaugural year. Partners who show up now are part of standing up a Midwest convention — not buying leftover space on a finished poster.",
  },
  {
    title: "Participate in a play-first convention",
    body: "Gaming, cosplay, collectibles, creators, and community programming are the reason people travel. Partnerships sit next to that mix, not apart from it.",
  },
  {
    title: "Choose a listed level or a custom conversation",
    body: "Community through Presenting are published price points. Custom / event sponsorship is for a specific area or an amount that is not on that list. Benefits are confirmed after acceptance.",
  },
];

export default function SponsorsPage() {
  return (
    <InnerPage
      path="/sponsors"
      breadcrumbLabel="Sponsors"
      eyebrow="Partner with the fest"
      title="Sponsor Midwest Pixel Fest 2027"
      intro="Midwest Pixel Fest is bringing gaming, cosplay, collectibles, creators, vendors, and community experiences together in Emporia, Kansas. Sponsorship is how local, regional, and interested national businesses can be part of that weekend."
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

      <ContentSection title="Why sponsor Midwest Pixel Fest">
        <p>
          You are not buying a guaranteed crowd size. You are associating your
          business with a play-first convention in Emporia — games, cosplay,
          collectibles, and the people who travel for that mix.
        </p>
      </ContentSection>

      <ul className="grid gap-4 md:grid-cols-2">
        {whyPoints.map((item) => (
          <li key={item.title} className="border border-line bg-panel p-6 sm:p-8">
            <h3 className="font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-3 text-muted">{item.body}</p>
          </li>
        ))}
      </ul>

      <SponsorLocalFit />
      <PackageGrid />
      <SponsorshipComparison />
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
