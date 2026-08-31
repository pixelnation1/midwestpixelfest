import type { Metadata } from "next";
import { VendorInterestForm } from "@/components/forms/VendorInterestForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Vendor Interest | Midwest Pixel Fest",
  description:
    "Register vendor or artist interest for Midwest Pixel Fest in Emporia, Kansas. This is not an official application and does not offer a booth.",
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
      eyebrow="Not an application"
      title="Vendor Interest Form"
      intro="Tell us you want to hear when official vendor and artist applications open. This is not an application, not a payment, and not a booth assignment."
    >
      <ContentSection title="What this form is for">
        <p>
          Official applications are not open. Registering interest lets Midwest
          Pixel Fest notify potential vendors and artists when the real form
          exists. Submitting does not imply acceptance.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <VendorInterestForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/vendors", label: "Vendors" },
          { href: "/sponsors/inquiry", label: "Sponsor Inquiry" },
          { href: "/travel", label: "Travel" },
          { href: "/faq", label: "FAQ" },
        ]}
      />
    </InnerPage>
  );
}
