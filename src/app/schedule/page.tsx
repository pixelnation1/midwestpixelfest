import type { Metadata } from "next";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { Badge } from "@/components/ui/Badge";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { event, site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Schedule | Midwest Pixel Fest 2027",
  description:
    "Midwest Pixel Fest 2027 schedule for October 16–17 in Emporia, Kansas. Gaming, tournaments, cosplay, panels, guests, and vendor hall details will be posted as they are confirmed.",
  path: "/schedule",
});

const categories = [
  {
    title: "Gaming",
    note: "Video games, retro play, tabletop, trading cards, and free play.",
  },
  {
    title: "Tournaments",
    note: "Organized play and brackets as partners and formats lock in.",
  },
  {
    title: "Cosplay",
    note: "Contest, meetups, and photo-friendly space — times later.",
  },
  {
    title: "Panels",
    note: "Stages and conversations once the programming grid is built.",
  },
  {
    title: "Guests",
    note: "Appearance hours post with confirmed names. None are announced yet.",
  },
  {
    title: "Community activities",
    note: "Meetups and floor programming for the people who show up to play.",
  },
  {
    title: "Vendor hall",
    note: "Hours for shops, artists, and the tables worth walking twice.",
  },
];

export default function SchedulePage() {
  return (
    <InnerPage
      path="/schedule"
      breadcrumbLabel="Schedule"
      eyebrow="Programming"
      title="Schedule"
      intro={`${site.dateLongLabel} in ${site.location}. The official hour-by-hour grid will publish as programming is confirmed. Detailed times below are not announced yet.`}
      after={
        <EmailSignup
          eyebrow="Programming"
          title="Get schedule announcements"
          description="Hour-by-hour grids, tournament signups, and guest appearance times will hit this list when they are real."
        />
      }
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <Badge tone="gold">Times to be announced</Badge>
        <Badge tone="cyan">{site.venueLabel}</Badge>
      </div>

      <ContentSection title="Planned public hours">
        <p>
          Public opening is currently planned for {event.doorsLabel} on
          Saturday, October 16. Sunday is currently planned through{" "}
          {event.closeLabel.replace("Sunday at ", "")} on October 17. Those
          hours can shift with the venue. They are not a locked door schedule.
        </p>
      </ContentSection>

      <ul className="grid gap-4 sm:grid-cols-2">
        {categories.map((item) => (
          <li key={item.title} className="border border-line bg-panel p-6">
            <h2 className="font-display text-2xl uppercase tracking-wide">
              {item.title}
            </h2>
            <p className="mt-3 font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
              Programming announcements coming later
            </p>
            <p className="mt-3 text-muted">{item.note}</p>
          </li>
        ))}
      </ul>

      <RelatedLinks
        links={[
          { href: "/gaming", label: "Gaming" },
          { href: "/cosplay", label: "Cosplay" },
          { href: "/guests", label: "Guests" },
          { href: "/tickets", label: "Tickets" },
          { href: "/travel", label: "Travel" },
        ]}
      />
    </InnerPage>
  );
}
