import type { Metadata } from "next";
import { EventCta } from "@/components/cta/EventCta";
import { VendorInterestForm } from "@/components/forms/VendorInterestForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import {
  artistApplicationsOpen,
  officialApplyHubPath,
  vendorApplicationsOpen,
} from "@/lib/vendors";

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

      {vendorApplicationsOpen || artistApplicationsOpen ? (
        <ContentSection title="Official applications are open">
          <p>
            Official Vendor Hall and Artist Alley applications are now available.
            This interest form remains available for notifications, but you can
            submit the official application when you are ready.
          </p>
          <div className="mt-6">
            <EventCta
              href={officialApplyHubPath}
              label="Go to official application"
              className="w-full sm:w-auto"
            />
          </div>
        </ContentSection>
      ) : null}

      <ContentSection title="What happens next">
        <p>
          We use this form to build the notification list for official
          applications. Submitting does not guarantee acceptance, reserve a
          space, or create a contract. Published Vendor Hall and Artist Alley
          prices are listed on the Vendors page. This form does not collect
          payment.
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
