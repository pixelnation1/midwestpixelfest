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

      <div className="mb-8 border border-gold/30 bg-panel p-5 sm:p-7">
        <h2 className="font-display text-xl uppercase tracking-wide text-paper">Are you an author?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Our invitation-based Author Guest Program is separate from paid Artist Alley.
          You're welcome to introduce your writing, books, or workshop idea here,
          but an inquiry doesn't guarantee a guest invitation, table or appearance.
        </p>
        <a href="/guests/authors" className="mt-4 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-wider text-cyan underline">
          Read the Invited Author Guest Program →
        </a>
      </div>
      <RelatedLinks
        links={[
          { href: "/guests", label: "Guests" },
          { href: "/guests/authors", label: "Invited Author Guest Program" },
          { href: "/press/inquiry", label: "Press Inquiry" },
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
