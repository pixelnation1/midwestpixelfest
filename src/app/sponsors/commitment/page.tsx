import type { Metadata } from "next";
import { SponsorCommitmentForm } from "@/components/forms/SponsorCommitmentForm";
import { EventCta } from "@/components/cta/EventCta";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { createPageMetadata } from "@/lib/seo";
import {
  canUseSponsorshipCommitmentForm,
  sponsorshipContractingEntity,
  sponsorshipContractingEntityStatus,
} from "@/lib/sponsorships";

export const metadata: Metadata = createPageMetadata({
  title: "Sponsorship Commitment | Midwest Pixel Fest 2027",
  description:
    "Sponsorship commitment for Midwest Pixel Fest 2027 is issued after a partnership is agreed. It is not a public checkout and does not collect payment.",
  path: "/sponsors/commitment",
  robots: { index: false, follow: false },
});

export default function SponsorCommitmentPage() {
  const open = canUseSponsorshipCommitmentForm();

  return (
    <InnerPage
      path="/sponsors/commitment"
      breadcrumbLabel="Commitment"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Sponsors", path: "/sponsors" },
        { name: "Commitment" },
      ]}
      eyebrow="After agreement"
      title={open ? "Sponsorship Commitment" : "Sponsorship Commitment Form"}
      intro={
        open
          ? "Use this form only after Midwest Pixel Fest and your organization have agreed on a package. It is not a public checkout."
          : "This form is issued after Midwest Pixel Fest and a sponsor agree on a package. It is not a public way to buy a sponsorship."
      }
      mood="business"
    >
      {open ? (
        <div className="border border-line bg-panel p-6 sm:p-8">
          <SponsorCommitmentForm />
        </div>
      ) : (
        <section className="border border-gold/50 bg-panel p-6 sm:p-8" aria-labelledby="commitment-closed-heading">
          <Badge tone="gold">Not a public checkout</Badge>
          <h2
            id="commitment-closed-heading"
            className="mt-5 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl"
          >
            Start with an inquiry
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Submitting an inquiry does not create a contract, require payment,
            reserve sponsorship inventory, guarantee exclusivity, or activate
            benefits. If a partnership is agreed, Midwest Pixel Fest will send
            the commitment step separately.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Contracting entity for sponsorship agreements is pending organizer
            and legal confirmation
            {sponsorshipContractingEntity
              ? ` (${sponsorshipContractingEntity}).`
              : ". Public pages list PixelNation as presenter; earlier paperwork used a different legal name. That discrepancy is not resolved here."}{" "}
            Status: {sponsorshipContractingEntityStatus.replaceAll("_", " ")}.
          </p>
          <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <EventCta href="/sponsors/inquiry" label="Become a Sponsor" className="w-full sm:w-auto" />
            <EventCta
              href="/sponsors"
              label="View Sponsorship Opportunities"
              variant="secondary"
              className="w-full sm:w-auto"
            />
          </div>
        </section>
      )}
    </InnerPage>
  );
}
