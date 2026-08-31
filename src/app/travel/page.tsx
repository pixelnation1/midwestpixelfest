import type { Metadata } from "next";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Travel to Midwest Pixel Fest | Emporia, Kansas",
  description:
    "Travel information for Midwest Pixel Fest in Emporia, Kansas — driving, hotels, and nearby airports. Venue and hotel blocks will be posted with the official dates.",
  path: "/travel",
});

export default function TravelPage() {
  return (
    <InnerPage
      path="/travel"
      breadcrumbLabel="Travel"
      eyebrow="Getting here"
      title="Travel"
      intro={`${site.name} is based in ${site.location}, a college town on the I-35 corridor. Hotel blocks, parking maps, and venue addresses will publish with the official dates.`}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="border border-line bg-panel p-8">
          <h2 className="font-display text-3xl uppercase tracking-wide">Drive</h2>
          <p className="mt-4 text-muted">
            Emporia sits between the Kansas City metro, Topeka, and Wichita.
            Most attendees will arrive by car. Exact drive-time guidance and
            parking will be added once the venue is confirmed.
          </p>
        </article>
        <article className="border border-line bg-panel p-8">
          <h2 className="font-display text-3xl uppercase tracking-wide">Stay</h2>
          <p className="mt-4 text-muted">
            Official hotel blocks are not live yet. We are working toward room
            blocks that make sense for a regional weekend — more here as
            partnerships land.
          </p>
        </article>
        <article className="border border-line bg-panel p-8">
          <h2 className="font-display text-3xl uppercase tracking-wide">Fly</h2>
          <p className="mt-4 text-muted">
            The nearest major airports are in the Kansas City and Wichita
            metros, with regional options in Topeka. Ground transport details
            will be listed with the event guide.
          </p>
        </article>
      </div>
    </InnerPage>
  );
}
