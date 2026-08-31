import type { Metadata } from "next";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Cosplay at Midwest Pixel Fest | Contests, Meetups & Community",
  description:
    "Cosplay at Midwest Pixel Fest 2027 in Emporia, Kansas: a planned contest, meetups, photo space, and community floor. Full rules will be posted once the venue is confirmed.",
  path: "/cosplay",
});

export default function CosplayPage() {
  return (
    <InnerPage
      path="/cosplay"
      breadcrumbLabel="Cosplay"
      eyebrow="Costume & character"
      title="Cosplay at Midwest Pixel Fest"
      intro="Cosplay is a major part of Midwest Pixel Fest. Attendees are encouraged to participate. A contest is planned, along with community meetups. Contest details and rules will be announced — we will not invent prizes or judging criteria here."
    >
      <ContentSection title="Cosplay community">
        <p>
          If this is your first con in costume or your fiftieth, the floor is
          supposed to have room for you. Original characters and fandom looks
          are both welcome. Keep it convention-appropriate; detailed costume
          and coverage rules will be published with the event guide.
        </p>
      </ContentSection>

      <ContentSection id="contest" title="Cosplay contest">
        <p>
          A cosplay contest is planned. Divisions, judging standards,
          registration, and prizes will be posted once they are finalized.
        </p>
        <p>
          Until that packet is public, there is no unofficial signup and no
          prize list to cite.
        </p>
      </ContentSection>

      <ContentSection id="meetups" title="Meetups">
        <p>
          Themed and community meetups are planned as programming comes
          together. We will not invent fandom-specific timeslots until groups
          and space are confirmed. Watch the Schedule and this page.
        </p>
      </ContentSection>

      <ContentSection title="Photography">
        <p>
          Photo opportunities and designated photo-friendly areas may be part
          of the weekend. Hallway shots happen at every con; designated space
          is about giving people a better backdrop and a clearer yes-or-no
          about being photographed.
        </p>
      </ContentSection>

      <ContentSection id="rules" title="Cosplay safety">
        <p>
          Full prop and replica rules depend on the venue and will be posted
          here when that building is confirmed. In the meantime, plan around
          these high-level expectations:
        </p>
      </ContentSection>

      <ul className="mb-10 grid gap-3 md:grid-cols-2">
        {[
          "Props may be inspected at entry or on the floor.",
          "Functional weapons are not allowed.",
          "Respect personal boundaries — costume is not consent.",
          "Ask before photographing someone.",
          "Follow venue rules once they are published.",
        ].map((item) => (
          <li
            key={item}
            className="flex gap-3 border border-line bg-panel px-4 py-3 text-muted"
          >
            <span className="text-magenta" aria-hidden="true">
              ▸
            </span>
            {item}
          </li>
        ))}
      </ul>

      <CtaStrip
        title="Show up in character"
        actions={[
          { href: "/tickets", label: "Get Tickets" },
          { href: "/schedule", label: "View Schedule", variant: "secondary" },
          { href: "/faq", label: "FAQ", variant: "secondary" },
        ]}
      />

      <RelatedLinks
        links={[
          { href: "/schedule", label: "Schedule" },
          { href: "/faq", label: "FAQ" },
          { href: "/tickets", label: "Tickets" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
