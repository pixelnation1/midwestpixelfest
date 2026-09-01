import type { Metadata } from "next";
import { VendorApplicationForm } from "@/components/forms/VendorApplicationForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { TrackPageEvent } from "@/components/seo/TrackPageEvent";
import { VendorApplicationIntro } from "@/components/vendors/VendorApplicationIntro";
import { VendorApplyClosed } from "@/components/vendors/VendorApplyClosed";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { artistApplicationsOpen, officialArtistApplyPath } from "@/lib/vendors";

export const metadata: Metadata = createPageMetadata({
  title: "Artist Alley Application | Midwest Pixel Fest 2027",
  description:
    "Apply for an Artist Alley table at Midwest Pixel Fest 2027 in Emporia, Kansas. Submitting an application does not guarantee acceptance or reserve a booth.",
  path: officialArtistApplyPath,
  robots: artistApplicationsOpen
    ? { index: true, follow: true }
    : { index: false, follow: false },
});

export default function ArtistAlleyApplyPage() {
  if (!artistApplicationsOpen) {
    return <VendorApplyClosed variant="artist" />;
  }

  return (
    <InnerPage
      path={officialArtistApplyPath}
      breadcrumbLabel="Artist Alley Application"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Apply", path: "/vendors/apply" },
        { name: "Artist Alley" },
      ]}
      eyebrow="Artist Alley"
      title="Artist Alley Application"
      intro="Submit an official Artist Alley application for Midwest Pixel Fest 2027. There is no application fee. Submission does not guarantee acceptance, require payment, or reserve a booth."
      mood="business"
    >
      <TrackPageEvent name={ANALYTICS_EVENTS.artist_application_start} />
      <VendorApplicationIntro />
      <div className="mt-8 min-w-0 overflow-x-hidden">
        <VendorApplicationForm applicationType="Artist Alley" />
      </div>
    </InnerPage>
  );
}
