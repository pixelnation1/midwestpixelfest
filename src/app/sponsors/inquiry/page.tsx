import type { Metadata } from "next";
import { SponsorInquiryForm } from "@/components/forms/SponsorInquiryForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { levelFromQuery } from "@/lib/sponsorships";

export const metadata: Metadata = createPageMetadata({
  title: "Become a Midwest Pixel Fest Sponsor | Partnership Inquiry",
  description:
    "Inquire about sponsoring Midwest Pixel Fest 2027 in Emporia, Kansas. Listed levels start at $250. Submitting this form does not create a sponsorship agreement, reserve a level, or collect payment.",
  path: "/sponsors/inquiry",
});

type SponsorInquiryPageProps = {
  searchParams: Promise<{ level?: string; interest?: string }>;
};

export default async function SponsorInquiryPage({
  searchParams,
}: SponsorInquiryPageProps) {
  const params = await searchParams;
  const level = levelFromQuery(params.level) ?? levelFromQuery(params.interest);

  return (
    <InnerPage
      path="/sponsors/inquiry"
      breadcrumbLabel="Become a Sponsor"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Sponsors", path: "/sponsors" },
        { name: "Become a Sponsor" },
      ]}
      eyebrow="Partnership inquiry"
      title="Become a Midwest Pixel Fest Sponsor"
      intro={`Tell us about your business and how you want to be involved with ${site.name} in ${site.location}. We review inquiries and follow up using the contact information you provide. Submitting this form expresses interest and does not by itself create a sponsorship agreement.`}
      mood="business"
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.sponsor_inquiry_start} />

      <ContentSection title="This is an inquiry, not a commitment">
        <p>
          Submitting this form does not create a contract, does not require
          payment, does not reserve sponsorship inventory, does not guarantee
          exclusivity, and does not activate sponsorship benefits.
        </p>
        <p>
          The legally operative sponsorship paperwork is sent after Midwest
          Pixel Fest accepts a partnership. We do not collect signatures,
          card numbers, or bank details on this page.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <SponsorInquiryForm defaultLevel={level} />
      </div>

      <RelatedLinks
        links={[
          { href: "/sponsors", label: "Sponsorship Opportunities" },
          { href: "/about", label: "About" },
          { href: "/vendors", label: "Vendors" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
