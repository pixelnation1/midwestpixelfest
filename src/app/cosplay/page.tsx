import type { Metadata } from "next";
import { ScenePhoto } from "@/components/media/ScenePhoto";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { getTicketAction } from "@/lib/tickets";

export const metadata: Metadata = createPageMetadata({
  title: "Cosplay at Midwest Pixel Fest | Contests, Meetups & Community",
  description:
    "Cosplay at Midwest Pixel Fest 2027 in Emporia, Kansas: a planned contest, meetups, photo space, and community floor. Full rules will be posted once the venue is confirmed.",
  path: "/cosplay",
});

export default function CosplayPage() {
  const tickets = getTicketAction("purchase");
  return (
    <InnerPage
      path="/cosplay"
      breadcrumbLabel="Cosplay"
      eyebrow="Costume & character"
      title="Cosplay at Midwest Pixel Fest"
      intro="Bring your favorite character to life at Midwest Pixel Fest. First-time cosplayers, experienced makers, and fans are welcome. A cosplay contest and community meetups are planned, with details to come as programming is confirmed."
    >
      <div className="relative mb-10">
        <ScenePhoto
          src="/images/cosplay/cosplay-convention-hall.jpg"
          alt="Cosplayer in a handmade cardboard mask and trench coat standing in a convention hall"
          caption="Cosplay"
          objectPosition="center 28%"
          overlay="stage"
          sizes="(min-width: 1024px) 960px, 100vw"
          className="aspect-[16/7] min-h-[200px] pixel-frame"
        />
        <p className="mt-4 text-center font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">
          Walk the floor. Hit the contest.
        </p>
      </div>

      <ContentSection title="Cosplay community">
        <p>
          Whether this is your first costume or your fiftieth convention,
          you belong here. Original characters and fandom favorites are welcome.
          Costume guidelines will be published with the event guide to help
          everyone plan for a comfortable, welcoming weekend.
        </p>
      </ContentSection>

      <ContentSection id="contest" title="Cosplay contest">
        <p>
          A cosplay contest is planned. Divisions, judging standards,
          registration, and prizes will be posted once they are finalized.
        </p>
      </ContentSection>

      <ContentSection id="meetups" title="Meetups">
        <p>
          Meet fellow fans, share your work, and connect over the characters
          you love. Planned meetups will be added here and to the Schedule
          page as groups, locations, and times are confirmed.
        </p>
      </ContentSection>

      <ContentSection title="Photography">
        <p>
          Show off your costume and capture memories with fellow fans. Always
          ask before taking a photo and respect anyone who declines. Details
          about any designated photo areas will be shared as plans are finalized.
        </p>
      </ContentSection>

      <ContentSection id="rules" title="Cosplay safety">
        <p>
          Help make the weekend welcoming for everyone. Full prop and replica
          guidelines will be published after the venue is confirmed. Start
          with these essentials:
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
          {
            href: tickets.href,
            label: tickets.label,
            external: tickets.external,
            eventName: ANALYTICS_EVENTS.ticket_click,
            eventPayload: { source: "cosplay", outbound: tickets.external },
          },
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
