import type { Metadata } from "next";
import { VendorApplicationForm } from "@/components/forms/VendorApplicationForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { VendorApplicationIntro } from "@/components/vendors/VendorApplicationIntro";
import { VendorApplyClosed } from "@/components/vendors/VendorApplyClosed";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { officialVendorApplyPath, vendorApplicationsOpen } from "@/lib/vendors";

export const metadata: Metadata = createPageMetadata({
  title: "Vendor Hall Application | Midwest Pixel Fest 2027",
  description:
    "Apply for a Vendor Hall booth at Midwest Pixel Fest 2027 in Emporia, Kansas. Submitting an application does not guarantee acceptance or reserve a booth.",
  path: officialVendorApplyPath,
  robots: vendorApplicationsOpen
    ? { index: true, follow: true }
    : { index: false, follow: false },
});

export default function VendorHallApplyPage() {
  if (!vendorApplicationsOpen) {
    return <VendorApplyClosed variant="vendor" />;
  }

  return (
    <InnerPage
      path={officialVendorApplyPath}
      breadcrumbLabel="Vendor Hall Application"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Apply", path: "/vendors/apply" },
        { name: "Vendor Hall" },
      ]}
      eyebrow="Vendor Hall"
      title="Vendor Hall Application"
      intro="Submit an official Vendor Hall application for Midwest Pixel Fest 2027. There is no application fee. Submission does not guarantee acceptance, require payment, or reserve a booth."
      mood="business"
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.vendor_application_start} />
      <VendorApplicationIntro />
      <div className="mt-8 min-w-0 overflow-x-hidden">
        <VendorApplicationForm applicationType="Vendor Hall" />
      </div>
    </InnerPage>
  );
}
