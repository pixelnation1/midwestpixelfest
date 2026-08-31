import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { ContentSection } from "@/components/ui/ContentSection";
import { EmailSignup } from "@/components/home/EmailSignup";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Vendors & Artist Alley | Midwest Pixel Fest",
  description:
    "Sell at Midwest Pixel Fest in Emporia, Kansas. Vendor and artist applications are not open yet. Booth details, pricing, and deadlines will be posted with the official form.",
  path: "/vendors",
});

const whoShouldApply = [
  "Collectible sellers",
  "Trading card vendors",
  "Retro gaming sellers",
  "Artists and illustrators",
  "Makers and crafts",
  "Apparel and merch",
  "Gaming accessories",
  "Independent creators",
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
      intro="Vendor hall and artist alley are part of the show, not an afterthought. Applications are not open yet. When they are, this page is the official place to apply."
      after={
        <EmailSignup
          eyebrow="Vendor updates"
          title="Get vendor updates"
          description="Application windows, booth details, and artist alley notes will hit this list when they are real — not as a fake waitlist."
        />
      }
    >
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
          Who should apply
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
          <Badge tone="gold">Coming soon</Badge>
          <h2 className="mt-5 font-display text-3xl uppercase tracking-wide">
            Vendor applications
          </h2>
          <p className="mt-4 text-muted">
            Applications are not currently open. There is no live application
            URL. When the form launches, it will be linked from this page.
          </p>
        </article>
        <article id="artists" className="border border-line bg-panel p-8">
          <Badge tone="gold">Coming soon</Badge>
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
          close and booths are assigned. There are no names to publish yet —
          and we will not fill this section with placeholders.
        </p>
      </ContentSection>

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
