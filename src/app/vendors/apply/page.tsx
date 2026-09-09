import type { Metadata } from "next";
import { VendorApplyClosed } from "@/components/vendors/VendorApplyClosed";
import { EventCta } from "@/components/cta/EventCta";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { createPageMetadata } from "@/lib/seo";
import {
  artistApplicationsOpen,
  cosplayVendorApplicationsOpen,
  officialArtistApplyPath,
  officialCosplayApplyPath,
  officialVendorApplyPath,
  vendorApplicationsOpen,
} from "@/lib/vendors";

const applicationsClosed =
  !vendorApplicationsOpen && !artistApplicationsOpen && !cosplayVendorApplicationsOpen;

export const metadata: Metadata = createPageMetadata({
  title: "Vendor & Artist Alley Application | Midwest Pixel Fest 2027",
  description:
    "Official Vendor Hall and Artist Alley applications for Midwest Pixel Fest 2027 in Emporia, Kansas.",
  path: "/vendors/apply",
  robots: applicationsClosed
    ? { index: false, follow: false }
    : { index: true, follow: true },
});

export default function VendorApplyHubPage() {
  if (applicationsClosed) {
    return <VendorApplyClosed variant="all" />;
  }

  return (
    <InnerPage
      path="/vendors/apply"
      breadcrumbLabel="Apply"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Apply" },
      ]}
      eyebrow="Applications"
      title="Apply for Vendor Hall or Artist Alley"
      intro="Choose Vendor Hall, Artist Alley, or Cosplay Creator / Vendor. Submitting an application does not guarantee acceptance, require payment, or reserve a booth. Cosplay vendor applications are not guest applications."
      mood="business"
    >
      <ul className="grid min-w-0 gap-4 lg:grid-cols-3">
        <li className="min-w-0 border border-line bg-panel p-6 sm:p-8">
          <Badge tone={vendorApplicationsOpen ? "cyan" : "gold"}>
            {vendorApplicationsOpen ? "Vendor Hall" : "Not open yet"}
          </Badge>
          <h2 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper">
            Vendor Hall
          </h2>
          <p className="mt-4 text-muted">
            For businesses selling games, cards, collectibles, apparel, and
            related merchandise.
          </p>
          <div className="mt-6">
            {vendorApplicationsOpen ? (
              <EventCta
                href={officialVendorApplyPath}
                label="Apply for Vendor Hall"
                className="w-full sm:w-auto"
              />
            ) : (
              <EventCta
                href="/vendors/interest"
                label="Register Vendor Interest"
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </li>
        <li className="min-w-0 border border-line bg-panel p-6 sm:p-8">
          <Badge tone={artistApplicationsOpen ? "cyan" : "gold"}>
            {artistApplicationsOpen ? "Artist Alley" : "Not open yet"}
          </Badge>
          <h2 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper">
            Artist Alley
          </h2>
          <p className="mt-4 text-muted">
            For artists and creators primarily selling their own original work.
          </p>
          <div className="mt-6">
            {artistApplicationsOpen ? (
              <EventCta
                href={officialArtistApplyPath}
                label="Apply for Artist Alley"
                className="w-full sm:w-auto"
              />
            ) : (
              <EventCta
                href="/vendors/interest"
                label="Register Vendor Interest"
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </li>
        <li className="min-w-0 border border-line bg-panel p-6 sm:p-8">
          <Badge tone={cosplayVendorApplicationsOpen ? "cyan" : "gold"}>
            {cosplayVendorApplicationsOpen ? "Cosplay Creator / Vendor" : "Not open yet"}
          </Badge>
          <h2 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper">
            Cosplay Creator / Vendor
          </h2>
          <p className="mt-4 text-muted">
            For cosplayers and creators selling prints, props, accessories,
            commissions, or creator merchandise. This is vendor space, not guest
            status.
          </p>
          <div className="mt-6">
            {cosplayVendorApplicationsOpen ? (
              <EventCta
                href={officialCosplayApplyPath}
                label="Apply as Cosplay Creator / Vendor"
                className="w-full sm:w-auto"
              />
            ) : (
              <EventCta
                href="/vendors/interest"
                label="Register Vendor Interest"
                className="w-full sm:w-auto"
              />
            )}
          </div>
        </li>
      </ul>
    </InnerPage>
  );
}
