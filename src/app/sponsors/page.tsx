import type { Metadata } from "next";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InfoCard } from "@/components/ui/InfoCard";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsor Midwest Pixel Fest | Partnership Opportunities",
  description:
    "Sponsor Midwest Pixel Fest in Emporia, Kansas. Regional visibility with gamers, cosplayers, collectors, families, students, and creators. Packages and pricing are not published yet.",
  path: "/sponsors",
});

const opportunities = [
  {
    name: "Presenting Partner",
    note: "Lead visibility across the inaugural weekend.",
  },
  {
    name: "Gaming Area Partner",
    note: "Association with free play, retro, or competitive space.",
  },
  {
    name: "Cosplay Partner",
    note: "Support for contest, meetup, or photo programming.",
  },
  {
    name: "Tournament Partner",
    note: "Brackets and side events once formats are locked.",
  },
  {
    name: "Stage / Panel Partner",
    note: "Stages, screens, and featured conversations.",
  },
  {
    name: "Community Partner",
    note: "Local and regional brands that want a floor presence.",
  },
  {
    name: "Hotel / Travel Partner",
    note: "Room blocks and visitor support after the venue is public.",
  },
  {
    name: "Local Business Partner",
    note: "Emporia and surrounding businesses that want in on the weekend.",
  },
];

const inquiryHref = "/sponsors/inquiry";
const inquiryLabel = "Sponsor Inquiry";

export default function SponsorsPage() {
  return (
    <InnerPage
      path="/sponsors"
      breadcrumbLabel="Sponsors"
      eyebrow="Partners"
      title="Sponsor Midwest Pixel Fest"
      intro={`${site.name} is looking for brands, venues, hotels, and local organizations that want to help launch a serious regional convention in ${site.location}. Official packages and pricing are not published yet.`}
    >
      <ContentSection title="Why sponsor">
        <p>
          Sponsorship is about showing up where the Midwest already gathers for
          games, costumes, and collectibles — and helping a new regional
          weekend get on its feet in Emporia.
        </p>
        <p>
          The audience we are building toward includes gamers, cosplayers,
          collectors, families, students, creators, and local-to-regional
          businesses. We will not invent attendance numbers to sell a deck.
        </p>
      </ContentSection>

      <ContentSection title="Who we want to work with">
        <p>
          Game shops, collectible brands, hospitality, civic partners, campuses,
          media, and companies that already talk to this crowd. Custom
          partnerships are on the table once the weekend shape is locked.
        </p>
      </ContentSection>

      <div className="py-8">
        <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
          Sponsorship opportunities
        </h2>
        <p className="mt-4 max-w-3xl text-muted">
          These are categories, not priced tiers. Dollar amounts, inclusions,
          and a downloadable deck will be posted when they are real.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {opportunities.map((item) => (
            <li key={item.name}>
              <InfoCard title={item.name}>
                <p>{item.note}</p>
              </InfoCard>
            </li>
          ))}
        </ul>
      </div>

      <ContentSection title="Custom partnerships">
        <p>
          If a category above is close but not right, say so when inquiry opens.
          Activations will be built around the actual floor, not a generic
          sponsor grid copied from another show.
        </p>
      </ContentSection>

      <CtaStrip
        title="Request sponsorship information"
        actions={[
          { href: inquiryHref, label: inquiryLabel },
          { href: "/about", label: "About the fest", variant: "secondary" },
          { href: "/press", label: "Press", variant: "secondary" },
        ]}
      >
        <p>
          Use the sponsor inquiry form to introduce your organization.
          Submitting it does not create a sponsorship agreement. A prospectus
          will be posted here when it exists.
        </p>
      </CtaStrip>

      <RelatedLinks
        links={[
          { href: "/about", label: "About" },
          { href: "/press", label: "Press" },
          { href: "/vendors", label: "Vendors" },
          { href: "/news", label: "News" },
        ]}
      />
    </InnerPage>
  );
}
