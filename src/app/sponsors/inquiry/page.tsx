import type { Metadata } from "next";
import { SponsorInquiryForm } from "@/components/forms/SponsorInquiryForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { interestFromQuery } from "@/lib/sponsorships";

export const metadata: Metadata = createPageMetadata({
  title: "Become a Midwest Pixel Fest Sponsor | Partnership Inquiry",
  description:
    "Inquire about sponsoring Midwest Pixel Fest 2027 in Emporia, Kansas. Tell us about your business and how you want to be involved. Submitting this form does not create a sponsorship agreement or collect payment.",
  path: "/sponsors/inquiry",
});

type SponsorInquiryPageProps = {
  searchParams: Promise<{ interest?: string }>;
};

export default async function SponsorInquiryPage({
  searchParams,
}: SponsorInquiryPageProps) {
  const params = await searchParams;
  const interest = interestFromQuery(params.interest);

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
      intro={`Tell us about your business and how you want to be involved with ${site.name} in ${site.location}. We review inquiries and follow up using the contact information you provide. This form does not create an agreement, reserve a package, or take payment.`}
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.sponsor_inquiry_start} />

      <ContentSection title="Before you send">
        <p>
          Share enough that we can have a real conversation. Package names are
          working labels until prices and final inclusions are confirmed in
          writing. If you are not sure which package fits, choose “Not Sure Yet”
          or “Custom Partnership.”
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <SponsorInquiryForm defaultInterest={interest} />
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
