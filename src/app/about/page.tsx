import type { Metadata } from "next";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About Midwest Pixel Fest | Emporia, Kansas Convention",
  description:
    "About Midwest Pixel Fest, a gaming, cosplay, collectibles, and pop-culture convention in Emporia, Kansas on October 16–17, 2027. Presented by PixelNation.",
  path: "/about",
});

const audiences = [
  "Families looking for an all-ages weekend",
  "Gamers — casual, competitive, retro, and tabletop",
  "Collectors and trading-card players",
  "Cosplayers at every skill level",
  "Artists, makers, and independent creators",
  "First-time convention-goers",
];

export default function AboutPage() {
  return (
    <InnerPage
      path="/about"
      breadcrumbLabel="About"
      eyebrow="The fest"
      title="About Midwest Pixel Fest"
      intro={`${site.name} is a gaming, cosplay, collectibles, and pop-culture convention coming to ${site.location} in October 2027 — ${site.dateLabel}. The venue is still to be announced.`}
    >
      <ContentSection title="What is Midwest Pixel Fest?">
        <p>
          Midwest Pixel Fest is a weekend built around video games, retro play,
          tabletop, trading cards, cosplay, vendors, artist alley, creators,
          special guests, panels, and the people who keep a convention floor
          loud. It is being created in Emporia, Kansas — not imported as a
          scaled-down copy of a coastal mega-con.
        </p>
        <p>
          The official home for tickets, guests, applications, and travel is
          this website. The venue is still to be announced. Until it is locked,
          we will not invent it.
        </p>
      </ContentSection>

      <ContentSection title="Why Emporia?">
        <p>
          Emporia sits in central Kansas on the I-35 corridor. That makes it a
          practical meeting point for people traveling from Kansas City,
          Wichita, Topeka, Manhattan, Lawrence, and surrounding Midwest
          communities.
        </p>
        <p>
          Exact drive times and parking maps will be published after the venue
          is confirmed. Until then, the Travel page is the place to watch.
        </p>
      </ContentSection>

      <ContentSection title="What to expect">
        <p>
          Planned programming includes video games and retro setups, console
          play and tournaments, tabletop, trading card games, cosplay, a vendor
          hall, artist alley, creators, special guests, panels, and community
          events. Specific titles, names, and time slots will be posted as they
          are confirmed — not before.
        </p>
      </ContentSection>

      <div className="py-8">
        <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
          Who is it for?
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {audiences.map((item) => (
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
      </div>

      <ContentSection title="Presented by PixelNation">
        <p>
          Midwest Pixel Fest is presented by{" "}
          <a
            href={site.organizerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan"
          >
            {site.organizer}
          </a>
          . PixelNation is building this event as a regional convention for the
          Midwest gaming, cosplay, and collectibles community — with Emporia as
          the home base.
        </p>
      </ContentSection>

      <ContentSection title="Photography on this site">
        <p>
          Midwest Pixel Fest is an inaugural 2027 event. Photographs on this
          website are licensed, illustrative images of gaming, cosplay, and
          convention-style environments. They are not photographs of Midwest
          Pixel Fest attendees, vendors, or a previous Pixel Fest.
        </p>
        <p>
          Arcade row photograph by Arcade Perfect, licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/2.0/"
            className="text-cyan"
            rel="noopener noreferrer"
          >
            CC BY 2.0
          </a>
          , resized for the web. Other images are from Unsplash and Pexels as
          documented in the project source list.
        </p>
      </ContentSection>

      <CtaStrip
        title="Keep planning"
        actions={[
          { href: "/gaming", label: "Gaming" },
          { href: "/cosplay", label: "Cosplay", variant: "secondary" },
          { href: "/travel", label: "Travel", variant: "secondary" },
        ]}
      />

      <RelatedLinks
        links={[
          { href: "/gaming", label: "Gaming" },
          { href: "/cosplay", label: "Cosplay" },
          { href: "/vendors", label: "Vendors" },
          { href: "/sponsors", label: "Sponsors" },
          { href: "/travel", label: "Travel" },
          { href: "/faq", label: "FAQ" },
          { href: "/news", label: "News" },
        ]}
      />
    </InnerPage>
  );
}
