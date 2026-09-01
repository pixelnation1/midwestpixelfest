import type { Metadata } from "next";
import { ScenePhoto } from "@/components/media/ScenePhoto";
import { GameSelectCard } from "@/components/retro/GameSelectCard";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";
import { gamingPillars } from "@/lib/site";
import { getTicketAction } from "@/lib/tickets";

export const metadata: Metadata = createPageMetadata({
  title: "Gaming at Midwest Pixel Fest | Kansas Gaming Convention",
  description:
    "Gaming at Midwest Pixel Fest, a Midwest gaming convention in Emporia, Kansas: retro play, console events, trading card games, tabletop, tournaments, and free play. October 16–17, 2027.",
  path: "/gaming",
});

export default function GamingPage() {
  const tickets = getTicketAction("purchase");
  return (
    <InnerPage
      path="/gaming"
      breadcrumbLabel="Gaming"
      eyebrow="Arcade select"
      title="Gaming at Midwest Pixel Fest"
      intro="Midwest Pixel Fest is being built as a play-first gaming convention in Emporia, Kansas. Dedicated space is planned for video games, retro hardware, console play, tabletop, trading cards, tournaments, and open free play."
    >
      <ul className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {gamingPillars.map((pillar, index) => (
          <li key={pillar.slug}>
            <GameSelectCard
              href={pillar.href}
              title={pillar.title}
              description={pillar.description}
              icon={pillar.icon}
              tone={pillar.tone}
              index={index + 1}
              cta="Open"
            />
          </li>
        ))}
      </ul>

      <ScenePhoto
        src="/images/gaming/arcade-cabinets-garage.jpg"
        alt="Vintage arcade cabinets gathered outside a garage, including wood-grain and racing machines"
        caption="Retro gaming"
        objectPosition="center 35%"
        overlay="crt"
        sizes="(min-width: 1024px) 960px, 100vw"
        className="mb-10 aspect-[16/8] min-h-[200px] pixel-frame"
      />

      <ContentSection id="retro-gaming" title="Retro gaming">
        <p>
          Classic consoles, arcade-style setups, and the games that started it
          are part of the floor we are building. Expect room for free play and
          a retro community that actually sits down with the hardware — not a
          glass case of machines nobody can touch.
        </p>
        <p>
          Specific cabinets, consoles, and any retro competitions will be listed
          once they are confirmed. Watch the Schedule and News pages for those
          drops.
        </p>
      </ContentSection>

      <ContentSection id="console-gaming" title="Video gaming">
        <p>
          Modern and classic console play will share the weekend: free play,
          multiplayer, and competitive brackets as partners lock in. The goal
          is a hall you can walk with a friend, pick up a controller, or sit
          for a side event.
        </p>
        <p id="console-tournaments">
          Tournament formats, title lists, and signup rules will be published
          when they are final — not as a teaser sheet of games we cannot run.
        </p>
      </ContentSection>

      <ContentSection id="tcg" title="Trading card games">
        <p>
          Trading card space is planned for constructed play, casual tables,
          and community hangouts. Planned areas may include Pokémon, Magic: The
          Gathering, One Piece, and other supported TCG communities as the
          floor is built out.
        </p>
        <p>
          That is a direction, not a locked vendor or event list. Exact games,
          prize support, and scheduled events will be posted when they are
          confirmed.
        </p>
      </ContentSection>

      <ScenePhoto
        src="/images/tabletop/tabletop-dice-session.jpg"
        alt="Dice and tabletop gaming materials arranged on a table"
        caption="Tabletop"
        objectPosition="center"
        overlay="dark"
        sizes="(min-width: 1024px) 960px, 100vw"
        className="my-6 aspect-[21/9] min-h-[180px] pixel-frame"
      />

      <ContentSection id="tabletop" title="Tabletop gaming">
        <p>
          Board games, RPGs, demos, and community tables belong on this floor.
          We are planning open play space — not a single sponsored title standing
          in for an entire library.
        </p>
        <p>
          Demo schedules and any hosted RPG slots will appear with the
          programming grid.
        </p>
      </ContentSection>

      <ContentSection id="tournaments" title="Tournaments / organized play">
        <p>
          Official tournament schedules, rules, and formats will be published
          as they are finalized. Until then, treat competitive play as planned —
          not as a promise of a specific game on a specific day.
        </p>
      </ContentSection>

      <ContentSection id="free-play" title="Free play">
        <p>
          Not everything needs a bracket. Free play is the casual side of the
          convention: grab a controller, sit at a table, stay as long as the
          floor is open. Signup details, if any, will be posted with the event
          guide.
        </p>
      </ContentSection>

      <CtaStrip
        title="Keep watching the grid"
        actions={[
          { href: "/schedule", label: "View Schedule" },
          {
            href: tickets.href,
            label: tickets.label,
            variant: "secondary",
            external: tickets.external,
            eventName: ANALYTICS_EVENTS.ticket_click,
            eventPayload: { source: "gaming", outbound: tickets.external },
          },
          { href: "/news", label: "News", variant: "secondary" },
        ]}
      />

      <RelatedLinks
        links={[
          { href: "/schedule", label: "Schedule" },
          { href: "/tickets", label: "Tickets" },
          { href: "/faq", label: "FAQ" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
