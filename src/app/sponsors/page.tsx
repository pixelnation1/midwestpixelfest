import type { Metadata } from "next";
import { PackageGrid } from "@/components/sponsors/PackageGrid";
import { SponsorFaq } from "@/components/sponsors/SponsorFaq";
import { SponsorOpportunities } from "@/components/sponsors/SponsorOpportunities";
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
import { sponsorshipFaqs, sponsorshipPaymentUrl } from "@/lib/sponsorships";
import { buildFaqPageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsor Midwest Pixel Fest 2027 | Kansas Convention Partnerships",
  description:
    "Sponsorship opportunities for Midwest Pixel Fest 2027 in Emporia, Kansas. Partner with a gaming, cosplay, collectibles, and community convention. Inquire about packages or a custom partnership — an inquiry is not an agreement.",
  path: "/sponsors",
});

const whyPoints = [
  {
    title: "Meet the floor, not a generic audience slide",
    body: "Midwest Pixel Fest is being built for people who play games, wear costumes, trade cards, and spend a weekend in a convention hall. Sponsorship puts your business next to that community in Emporia.",
  },
  {
    title: "Help launch a new regional weekend",
    body: "This is the inaugural year. Partners who show up now are part of standing up a Midwest convention — not buying a leftover logo on a finished poster.",
  },
  {
    title: "Visibility tied to real programming",
    body: "Recognition can live on the website, in sponsor listings, and on-site as the floor plan allows. Higher packages can discuss activations. Nothing here invents impression counts.",
  },
  {
    title: "Room to participate, not only to logo",
    body: "Some partners want a listing. Others want to talk about gaming, cosplay, tournaments, or attendee experience. Those conversations start with an inquiry.",
  },
  {
    title: "Local and regional businesses belong here",
    body: "Emporia sits on a corridor that already moves people between Kansas City, Wichita, Topeka, Lawrence, and the rest of the region. Nearby shops, hospitality, and brands are part of the weekend we want.",
  },
  {
    title: "Digital and on-site recognition, package by package",
    body: "What you get is whatever the package — and later the written agreement — actually includes. We will not promise placements we have not scoped.",
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

      <PackageGrid />
      <SponsorshipComparison />
      <SponsorOpportunities />

      <ContentSection title="How sponsorship works">
        <p>
          Inquiry, then review, then approval, then a written agreement, then
          payment. This website does not collect card information and does not
          reserve a package when you submit the form.
        </p>
        {sponsorshipPaymentUrl ? (
          <p>Payment instructions are shared after an agreement is in place.</p>
        ) : (
          <p>
            Payment terms are provided after a sponsorship is approved and
            finalized.
          </p>
        )}
      </ContentSection>

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
          Introduce your business on the inquiry form. We will follow up using
          the contact information you provide. Submitting the form does not
          create a sponsorship agreement.
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
