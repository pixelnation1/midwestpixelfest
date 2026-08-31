import type { Metadata } from "next";
import Link from "next/link";
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
      intro={`Guest announcements are coming. Confirmed names for ${site.dateLabel} in ${site.location} will appear here — not as placeholders.`}
    >
      <ContentSection title="Guest announcements are coming.">
        <p>
          Midwest Pixel Fest may feature creators, artists, streamers, authors,
          performers, and industry or community personalities. Until a name is
          published on this page, it is not official.
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
        <ul className="grid gap-4 md:grid-cols-2">
          {announced.map((guest) => (
            <li key={guest.slug}>
              <Link
                href={`/guests/${guest.slug}`}
                className="block h-full border border-line bg-panel p-6 transition-colors hover:border-cyan"
              >
                <p className="font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
                  {guest.role}
                </p>
                <h2 className="mt-3 font-display text-3xl uppercase tracking-wide">
                  {guest.name}
                </h2>
                <p className="mt-3 text-muted">{guest.bio}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-line bg-panel p-6 text-muted">
          The guest list is empty on purpose. We will not invent silhouettes or
          fake names to fill this page.
        </p>
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
