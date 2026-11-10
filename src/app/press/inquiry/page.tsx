import type { Metadata } from "next";
import { PressInquiryForm } from "@/components/forms/PressInquiryForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Press Inquiry | Midwest Pixel Fest",
  description:
    "Media and creator press inquiries for Midwest Pixel Fest in Emporia, Kansas. Official media credentials are not open yet.",
  path: "/press/inquiry",
});

export default function PressInquiryPage() {
  return (
    <InnerPage
      path="/press/inquiry"
      breadcrumbLabel="Press Inquiry"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Press", path: "/press" },
        { name: "Press Inquiry" },
      ]}
      eyebrow="Media"
      title="Press Inquiry"
      intro="Coverage interest is welcome. Official media credentials are not open yet. Sending this form does not issue a badge or guarantee access."
    >
      <ContentSection title="Credentials">
        <p>
          Formal credential applications and deadlines will be announced on the Press & Media page. This form is for coverage introductions, organizer interview requests and media questions; it does not reserve a badge.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <PressInquiryForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/press", label: "Press" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
