import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsors",
  description: `Sponsorship opportunities for ${site.name}, presented by ${site.organizer}.`,
};

const tiers = [
  {
    name: "Title",
    note: "Lead partner for the inaugural weekend.",
  },
  {
    name: "Presenting",
    note: "High-visibility floor, stage, and digital placement.",
  },
  {
    name: "Community",
    note: "Local businesses, hotels, and regional brands.",
  },
];

export default function SponsorsPage() {
  return (
    <InnerPage
      eyebrow="Partners"
      title="Sponsors"
      intro={`${site.name} is looking for brands, venues, hotels, and local organizations that want to help launch a serious regional convention in ${site.location}. Official packages are in progress.`}
      after={<EmailSignup />}
    >
      <div className="mb-8">
        <Badge tone="gold">Packages coming soon</Badge>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <li key={tier.name} className="border border-line bg-panel p-8">
            <h2 className="font-display text-3xl uppercase tracking-wide">
              {tier.name}
            </h2>
            <p className="mt-4 text-muted">{tier.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-2xl text-muted">
        If you represent a sponsor, hotel, or city partner, join the list and
        watch this page. A dedicated prospectus will be available as dates and
        venue are announced.
      </p>
    </InnerPage>
  );
}
