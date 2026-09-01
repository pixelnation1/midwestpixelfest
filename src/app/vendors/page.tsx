import type { Metadata } from "next";
import { ArcadeIcon } from "@/components/retro/ArcadeIcon";
import { Badge } from "@/components/ui/Badge";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { vendorBrowseCategories } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Vendors & Artist Alley | Midwest Pixel Fest",
  description:
    "Sell at Midwest Pixel Fest in Emporia, Kansas. Vendor and artist applications are not open yet. Booth details, pricing, and deadlines will be posted with the official form.",
  path: "/vendors",
});

const whoShouldApply = [
  "Collectibles",
  "Gaming and retro",
  "Tabletop",
  "Trading card games",
  "Art and prints",
  "Creators and handmade goods",
  "Pop culture merchandise",
  "Independent makers",
];

const upcomingDetails = [
  "Booth and table sizes",
  "Pricing",
  "Tables, chairs, and power",
  "Load-in and setup times",
  "Show rules",
  "Tax requirements",
  "Insurance requirements, if applicable",
  "Application deadlines",
];

export default function VendorsPage() {
  return (
    <InnerPage
      path="/vendors"
      breadcrumbLabel="Vendors"
      eyebrow="Sell at the fest"
      title="Vendors & Artist Alley"
      intro="Vendor hall and artist alley are part of the show, not an afterthought. Applications are not open yet. Register interest if you want to be notified when they are — that is not an application."
    >
      <ul className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
        {vendorBrowseCategories.map((item) => (
          <li
            key={item.title}
            className="flex flex-col items-center border border-line bg-panel vendor-shelf px-3 py-5 text-center"
          >
            <ArcadeIcon name={item.icon} className="h-9 w-9 text-gold" />
            <p className="mt-3 font-pixel text-[10px] uppercase leading-tight tracking-[0.12em] text-paper">
              {item.title}
            </p>
          </li>
        ))}
      </ul>

      <ContentSection title="Sell at Midwest Pixel Fest">
        <p>
          Midwest Pixel Fest is building space for shops, collectible sellers,
          game retailers, and original art in Emporia, Kansas. The weekend is
          meant to be walked twice: once for the floor, once for the tables.
        </p>
        <p>
          Applying will not guarantee a booth. Selection, maps, and load-in
          details will ship with the application — not as rumors.
        </p>
      </ContentSection>

      <div className="py-8">
        <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
          Who this floor is for
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {whoShouldApply.map((item) => (
            <li
              key={item}
              className="flex gap-3 border border-line bg-panel px-4 py-3 text-muted"
            >
              <span className="text-lime" aria-hidden="true">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="border border-line bg-panel p-8">
            <Badge tone="gold">Applications not open</Badge>
          <h2 className="mt-5 font-display text-3xl uppercase tracking-wide">
            Vendor applications
          </h2>
          <p className="mt-4 text-muted">
            Applications are not currently open. There is no live application
            URL. Join vendor updates or register interest so we can notify you
            when the official form exists.
          </p>
        </article>
        <article id="artists" className="border border-line bg-panel p-8">
            <Badge tone="gold">Applications not open</Badge>
          <h2 className="mt-5 font-display text-3xl uppercase tracking-wide">
            Artist applications
          </h2>
          <p className="mt-4 text-muted">
            Artist alley is for original work: prints, zines, crafts, and
            commissions. Table maps and display rules will post with the
            application.
          </p>
        </article>
      </div>

      <ContentSection title="What we will publish">
        <p>
          Future vendor packets may include the items below. None of these
          values are assigned yet.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {upcomingDetails.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="text-gold" aria-hidden="true">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title="Vendor directory">
        <p>
          Confirmed vendors and artists will be listed here after applications
          close and booths are assigned. There are no names to publish yet.
        </p>
      </ContentSection>

      <CtaStrip
        className="mt-10"
        title="Join vendor updates"
        actions={[
          { href: "/vendors/interest", label: "Register Vendor Interest" },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      >
        <p>
          Official applications are not open, so there is no Apply Now path.
          Registering interest does not imply acceptance and does not request
          payment.
        </p>
      </CtaStrip>

      <RelatedLinks
        links={[
          { href: "/sponsors", label: "Sponsors" },
          { href: "/travel", label: "Travel" },
          { href: "/faq", label: "FAQ" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
