import type { Metadata } from "next";
import { VendorApplicationForm } from "@/components/forms/VendorApplicationForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { VendorApplicationIntro } from "@/components/vendors/VendorApplicationIntro";
import { VendorApplyClosed } from "@/components/vendors/VendorApplyClosed";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { cosplayVendorApplicationsOpen, officialCosplayApplyPath } from "@/lib/vendors";

export const metadata: Metadata = createPageMetadata({
  title: "Cosplay Creator / Vendor Application | Midwest Pixel Fest 2027",
  description:
    "Apply for vendor or Artist Alley space as a cosplay creator selling merchandise at Midwest Pixel Fest 2027. This is not a guest application.",
  path: officialCosplayApplyPath,
  robots: cosplayVendorApplicationsOpen
    ? { index: true, follow: true }
    : { index: false, follow: false },
});

export default function CosplayVendorApplyPage() {
  if (!cosplayVendorApplicationsOpen) {
    return <VendorApplyClosed variant="cosplay" />;
  }

  return (
    <InnerPage
      path={officialCosplayApplyPath}
      breadcrumbLabel="Cosplay Creator / Vendor Application"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Apply", path: "/vendors/apply" },
        { name: "Cosplay Creator / Vendor" },
      ]}
      eyebrow="Vendor space"
      title="Cosplay Creator / Vendor Application"
      intro="Submit an official vendor application if you sell prints, props, accessories, commissions, handmade goods, or creator merchandise. This is not a guest application and does not grant guest status, a free booth, travel, hotel, an appearance fee, or featured placement."
      mood="business"
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.vendor_application_start} />
      <VendorApplicationIntro />
      <div className="mt-8 min-w-0 overflow-x-hidden">
        <VendorApplicationForm applicationType="Cosplay Creator / Vendor" />
      </div>
    </InnerPage>
  );
}
