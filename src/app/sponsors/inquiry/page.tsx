import type { Metadata } from "next";
import { SponsorInquiryForm } from "@/components/forms/SponsorInquiryForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsor Inquiry | Midwest Pixel Fest",
  description:
    "Inquire about sponsoring Midwest Pixel Fest in Emporia, Kansas. Submitting this form does not create a sponsorship agreement. Packages and pricing are not published yet.",
  path: "/sponsors/inquiry",
});

export default function SponsorInquiryPage() {
  return (
    <InnerPage
      path="/sponsors/inquiry"
      breadcrumbLabel="Sponsor Inquiry"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Sponsors", path: "/sponsors" },
        { name: "Sponsor Inquiry" },
      ]}
      eyebrow="Partnerships"
      title="Sponsor Midwest Pixel Fest"
      intro={`Introduce your organization if you want to help launch ${site.name} in ${site.location}. Official packages are not published yet. Submitting this form does not create a sponsorship agreement.`}
    >
      <ContentSection title="Before you send">
        <p>
          We are collecting serious interest, not taking payment and not locking
          a tier. Budget notes are optional. A range is enough if you share one
          — we are not asking for an exact amount.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <SponsorInquiryForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/sponsors", label: "Sponsors" },
          { href: "/about", label: "About" },
          { href: "/press", label: "Press" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
