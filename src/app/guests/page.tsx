import type { Metadata } from "next";
import { GuestAnnouncementCard, GuestCard } from "@/components/retro/GuestCard";
import { InnerPage } from "@/components/pages/InnerPage";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { ContentSection } from "@/components/ui/ContentSection";
import { createPageMetadata } from "@/lib/seo";
import { guestCategories, getAllGuests } from "@/content/guests";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Special Guests | Midwest Pixel Fest 2027",
  description:
    "Guest announcements for Midwest Pixel Fest 2027 in Emporia, Kansas. Creators, artists, streamers, authors, performers, and community guests will be posted here first.",
  path: "/guests",
});

export default function GuestsPage() {
  const announced = getAllGuests();

  return (
    <InnerPage
      path="/guests"
      breadcrumbLabel="Guests"
      eyebrow="Talent & creators"
      title="Special guests"
      intro={`Guest announcements are coming. Confirmed names for ${site.dateLabel} in ${site.location} will appear here.`}
    >
      <div className="mb-10 overflow-hidden border border-magenta/40 bg-panel px-6 py-10 text-center pixel-frame">
        <p className="font-pixel text-[11px] uppercase tracking-[0.28em] text-gold">
          Now loading
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-5xl">
          Guest announcements coming
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Until a name is published on this page, it is not official. Appearance
          schedules will follow once the programming grid is built.
        </p>
      </div>

      <ContentSection title="Who may appear">
        <p>
          Midwest Pixel Fest may feature creators, artists, streamers, authors,
          performers, and industry or community personalities.
        </p>
      </ContentSection>

      <ul className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guestCategories.map((item) => (
          <li
            key={item}
            className="border border-line bg-panel px-4 py-3 font-display uppercase tracking-[0.12em]"
          >
            {item}
          </li>
        ))}
      </ul>

      {announced.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announced.map((guest) => (
            <li key={guest.slug}>
              <GuestCard guest={guest} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <GuestAnnouncementCard />
          </li>
          <li className="hidden sm:block">
            <GuestAnnouncementCard />
          </li>
          <li className="hidden lg:block">
            <GuestAnnouncementCard />
          </li>
        </ul>
      )}

      <CtaStrip
        className="mt-10"
        title="Creators and talent"
        actions={[
          { href: "/guests/inquiry", label: "Guest Inquiry" },
          { href: "/press", label: "Press", variant: "secondary" },
        ]}
      >
        <p>
          If you are interested in appearing, send an inquiry. Submission does
          not guarantee an invitation or appearance.
        </p>
      </CtaStrip>
    </InnerPage>
  );
}
