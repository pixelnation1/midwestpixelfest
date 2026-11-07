import type { Metadata } from "next";
import Link from "next/link";
import { EmailSignup } from "@/components/home/EmailSignup";
import { EventInfoPanel } from "@/components/retro/EventInfoPanel";
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
    "Plan your trip to Midwest Pixel Fest 2027, October 16–17, at our selected venue: Webb Hall, ESU Memorial Union, 1331 Market St., Emporia, KS. Reservation pending final agreement.",
  path: "/travel",
});

const fromCities = [
  {
    name: "Kansas City",
    note: "A common I-35 approach from the northeast. Most attendees from the metro will drive.",
  },
  {
    name: "Wichita",
    note: "A common I-35 approach from the southwest. Details about ESU Memorial Union parking and hotels will follow after booking.",
  },
  {
    name: "Topeka",
    note: "A regional trip to Emporia along the I-35 corridor. Webb Hall at ESU is our selected venue.",
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
    note: "Emporia is a regional meeting point, not only a hometown show. Overnight and parking details will follow the venue reservation.",
  },
];

export default function TravelPage() {
  return (
    <InnerPage
      path="/travel"
      breadcrumbLabel="Travel"
      eyebrow="Getting here"
      title="Travel to Midwest Pixel Fest"
      intro={`${site.dateLongLabel} in ${site.location}. Our selected venue is Webb Hall at Emporia State University. Reservation pending a signed agreement and deposit.`}
      after={<EmailSignup />}
    >
      <EventInfoPanel className="mb-10" compact />

      <ContentSection title="Our selected venue: Webb Hall at ESU">
        <p>
          Webb Hall is located inside the Emporia State University Memorial Union,
          1331 Market St., Emporia, KS 66801. We have selected it as the planned
          home for Midwest Pixel Fest 2027. The reservation is not yet finalized;
          the booking remains pending a signed agreement and deposit.
        </p>
        <p>
          The venue offers meeting and event facilities with food service and
          audiovisual capabilities. Room layouts, amenities, and attendee entry
          instructions will be published after contracting with ESU.
        </p>
      </ContentSection>

      <ContentSection id="getting-to-emporia" title="Getting to Emporia">
        <p>
          Most people will arrive by car. We are not listing unverified mileage
          or drive times. Use the notes below as a planning sketch, and check
          back for finalized arrival and parking instructions after booking.
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
          Official hotel partners and room blocks have not been confirmed.
          We will publish any negotiated accommodations after the venue agreement.
        </p>
      </ContentSection>

      <ContentSection id="parking" title="Parking">
        <p>
          We plan to use Webb Hall in the ESU Memorial Union. Exact event parking
          lots, accessibility routes, and any shuttle details will be published
          after the venue reservation and arrival arrangements are finalized.
        </p>
      </ContentSection>

      <ContentSection id="things-to-do" title="Food & things to do">
        <p>
          Make a full weekend of Midwest Pixel Fest. Our Visit Emporia guide brings together
          local places to eat, museums, family-friendly attractions, gaming, shopping and outdoor adventures.
          Each listing links to visitor information and directions. Business hours and offerings may change
          before October 2027.
        </p>
        <p className="mt-4">
          <Link href="/visit-emporia" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10">
            Discover things to do in Emporia →
          </Link>
        </p>
      </ContentSection>

      <CtaStrip
        title="More from the fest"
        actions={[
          { href: "/tickets", label: "Tickets" },
          { href: "/faq", label: "FAQ", variant: "secondary" },
          { href: "/schedule", label: "Schedule", variant: "secondary" },
        ]}
      />

      <RelatedLinks
        links={[
          { href: "/attendee-services", label: "Accessibility & Attendee Services" },
          { href: "/visit-emporia", label: "Visit Emporia" },
          { href: "/first-timers-guide", label: "First-Timer's Guide" },
          { href: "/floor-map", label: "Convention Floor Map" },
          { href: "/tickets", label: "Tickets" },
          { href: "/faq", label: "FAQ" },
          { href: "/schedule", label: "Schedule" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
