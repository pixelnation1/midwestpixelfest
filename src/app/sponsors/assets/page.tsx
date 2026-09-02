import type { Metadata } from "next";
import { SponsorAssetForm } from "@/components/forms/SponsorAssetForm";
import { EventCta } from "@/components/cta/EventCta";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { createPageMetadata } from "@/lib/seo";
import { canUseSponsorshipAssetForm } from "@/lib/sponsorships";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsor Assets | Midwest Pixel Fest 2027",
  description:
    "Marketing asset collection for confirmed Midwest Pixel Fest 2027 sponsors. Not a public sponsorship checkout.",
  path: "/sponsors/assets",
  robots: { index: false, follow: false },
});

export default function SponsorAssetsPage() {
  const open = canUseSponsorshipAssetForm();

  return (
    <InnerPage
      path="/sponsors/assets"
      breadcrumbLabel="Sponsor Assets"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Sponsors", path: "/sponsors" },
        { name: "Assets" },
      ]}
      eyebrow="After payment"
      title="Sponsor marketing assets"
      intro="This step is for sponsors who have already committed and paid. It is not a public listing form and does not collect payment."
      mood="business"
    >
      {open ? (
        <div className="border border-line bg-panel p-6 sm:p-8">
          <SponsorAssetForm />
        </div>
      ) : (
        <section className="border border-gold/50 bg-panel p-6 sm:p-8" aria-labelledby="assets-closed-heading">
          <Badge tone="gold">Organizer-issued</Badge>
          <h2
            id="assets-closed-heading"
            className="mt-5 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl"
          >
            Asset collection is not a public upload
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            After payment, Midwest Pixel Fest will request a logo, website,
            public description, social links, and marketing contact. Secure file
            storage is not connected yet, so this site does not accept logo
            uploads here.
          </p>
          <p className="mt-4 max-w-2xl text-muted">
            Paid sponsors should wait for instructions. Public recognition
            happens only after review — payment alone does not publish a listing.
          </p>
          <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <EventCta href="/sponsors/inquiry" label="Become a Sponsor" className="w-full sm:w-auto" />
            <EventCta
              href="/sponsors"
              label="Return to Sponsors"
              variant="secondary"
              className="w-full sm:w-auto"
            />
          </div>
        </section>
      )}
    </InnerPage>
  );
}
