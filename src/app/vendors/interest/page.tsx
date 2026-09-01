import type { Metadata } from "next";
import { VendorInterestForm } from "@/components/forms/VendorInterestForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Register Vendor Interest | Midwest Pixel Fest 2027",
  description:
    "Register vendor or Artist Alley interest for Midwest Pixel Fest 2027 in Emporia, Kansas. This is not an official application and does not reserve a booth.",
  path: "/vendors/interest",
});

export default function VendorInterestPage() {
  return (
    <InnerPage
      path="/vendors/interest"
      breadcrumbLabel="Vendor Interest"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Vendor Interest" },
      ]}
      eyebrow="Register interest"
      title="Register Vendor Interest"
      intro="Tell us about your shop, collection, or creative work so we can notify you when official vendor and Artist Alley applications launch. This form is not an application, does not reserve a booth, and does not collect payment."
      mood="business"
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.vendor_interest_start} />

      <ContentSection title="What happens next">
        <p>
          We use this form to build the notification list for official
          applications. Submitting does not guarantee acceptance or create a
          contract. Full booth details will be released with official
          applications.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <VendorInterestForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/vendors", label: "Vendors" },
          { href: "/sponsors/inquiry", label: "Become a Sponsor" },
          { href: "/travel", label: "Travel" },
          { href: "/faq", label: "FAQ" },
        ]}
      />
    </InnerPage>
  );
}
