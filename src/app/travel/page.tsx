import type { Metadata } from "next";
import { EmailSignup } from "@/components/home/EmailSignup";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InfoCard } from "@/components/ui/InfoCard";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Travel to Midwest Pixel Fest | Emporia, Kansas",
  description:
    "Travel to Midwest Pixel Fest 2027 in Emporia, Kansas on October 16–17. Guidance for Kansas City, Wichita, Topeka, Lawrence, Manhattan, and the surrounding Midwest. Hotels and parking after venue confirmation.",
  path: "/travel",
});

const fromCities = [
  {
    name: "Kansas City",
    note: "A common I-35 approach from the northeast. Most attendees from the metro will drive.",
  },
  {
    name: "Wichita",
    note: "A common I-35 approach from the southwest. Watch this page for parking and hotel notes after the venue is public.",
  },
  {
    name: "Topeka",
    note: "A shorter regional trip along the same corridor. Exact routing depends on the confirmed venue.",
  },
  {
    name: "Lawrence",
    note: "A regional drive for campus and collector crowds. We will not publish unofficial mile counts here.",
  },
  {
    name: "Manhattan",
    note: "Another regional community we expect on the road. Hotel blocks, if any, will be listed once they exist.",
  },
  {
    name: "Surrounding Midwest",
    note: "Emporia is being positioned as a meeting point, not only a hometown show. Airport and overnight details will follow the venue announcement.",
  },
];

export default function TravelPage() {
  return (
    <InnerPage
      path="/travel"
      breadcrumbLabel="Travel"
      eyebrow="Getting here"
      title="Travel to Midwest Pixel Fest"
      intro={`${site.dateLongLabel} in ${site.location}. Hotel blocks, parking maps, and the venue address will publish when they are confirmed.`}
      after={<EmailSignup />}
    >
      <ContentSection title="Why Emporia">
        <p>
          Emporia sits along I-35 and serves as a convenient meeting point for
          regional attendees. The pitch is geographic, not a claim about a
          specific building — that address is still to be announced.
        </p>
      </ContentSection>

      <ContentSection id="getting-to-emporia" title="Getting to Emporia">
        <p>
          Most people will arrive by car. We are not listing unverified mileage
          or drive times. Use the notes below as a planning sketch, then come
          back when the venue pin is public.
        </p>
      </ContentSection>

      <ul className="grid gap-4 md:grid-cols-2">
        {fromCities.map((city) => (
          <li key={city.name}>
            <InfoCard title={city.name}>
              <p>{city.note}</p>
            </InfoCard>
          </li>
        ))}
      </ul>

      <ContentSection id="hotels" title="Hotels">
        <p>
          Official hotel partners and room blocks will be published once the
          venue is confirmed. Until then, we are not naming properties or rates.
        </p>
      </ContentSection>

      <ContentSection id="parking" title="Parking">
        <p>
          Venue-specific parking, lots, and any shuttle notes will be posted
          after the venue is confirmed. Do not assume downtown vs. campus vs.
          highway lots until that map exists.
        </p>
      </ContentSection>

      <ContentSection id="things-to-do" title="Food & things to do">
        <p>
          Local restaurant and sightseeing guides will be added as we work with
          Emporia partners. This page will link out to deeper travel notes when
          those guides are worth publishing — not as a scraped list of every
          storefront in town.
        </p>
      </ContentSection>

      <CtaStrip
        title="More from the fest"
        actions={[
          { href: "/faq", label: "FAQ" },
          { href: "/schedule", label: "Schedule", variant: "secondary" },
          { href: "/news", label: "News", variant: "secondary" },
        ]}
      />

      <RelatedLinks
        links={[
          { href: "/faq", label: "FAQ" },
          { href: "/schedule", label: "Schedule" },
          { href: "/news", label: "News" },
          { href: "/vendors", label: "Vendors" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
