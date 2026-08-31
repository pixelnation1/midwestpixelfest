import type { Metadata } from "next";
import { GuestInquiryForm } from "@/components/forms/GuestInquiryForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Guest & Talent Inquiries | Midwest Pixel Fest",
  description:
    "Inquire about appearing at Midwest Pixel Fest as a creator, streamer, artist, performer, or community guest. Submission does not guarantee an invitation.",
  path: "/guests/inquiry",
});

export default function GuestInquiryPage() {
  return (
    <InnerPage
      path="/guests/inquiry"
      breadcrumbLabel="Guest Inquiry"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Guests", path: "/guests" },
        { name: "Guest Inquiry" },
      ]}
      eyebrow="Creators & talent"
      title="Guest & Talent Inquiries"
      intro="For creators, streamers, authors, artists, performers, voice talent, industry professionals, and community personalities. Submission does not guarantee an invitation or appearance."
    >
      <ContentSection title="What to expect">
        <p>
          Confirmed guests will be posted on the Guests page. This form is an
          introduction, not a contract and not a booking.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <GuestInquiryForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/guests", label: "Guests" },
          { href: "/press/inquiry", label: "Press Inquiry" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
