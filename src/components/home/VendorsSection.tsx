import { ScenePhoto } from "@/components/media/ScenePhoto";
import { ArcadeIcon } from "@/components/retro/ArcadeIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vendorBrowseCategories } from "@/lib/site";
import { formatVendorPrice, foundingVendorDeadlineLabel, vendorSpaces } from "@/lib/vendors";

export function VendorsSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Artist alley & vendor hall"
          title="Walk the marketplace."
          description="Games, cards, collectibles, art, apparel, makers, and pop culture merchandise are the kind of tables this floor is being built for. Applications are not open, and no vendors are listed yet."
          tone="lime"
        />

        <ScenePhoto
          src="/images/vendors/collectible-figurines.jpg"
          alt="Collectible figurines and pins arranged on a crowded vendor table"
          caption="Collectibles"
          objectPosition="center 40%"
          overlay="dark"
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="mt-10 aspect-[16/10] min-h-[220px] sm:aspect-[21/9] pixel-frame"
        />
        <p className="mt-3 max-w-2xl text-sm text-muted">
          A glimpse of convention marketplace culture. Our inaugural vendor
          lineup will be announced as participants are confirmed.
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7">
          {vendorBrowseCategories.map((item) => (
            <li
              key={item.title}
              className="flex flex-col items-center border border-line bg-panel vendor-shelf px-3 py-5 text-center"
            >
              <ArcadeIcon name={item.icon} className="h-10 w-10 text-gold" />
              <p className="mt-3 font-pixel text-[10px] uppercase leading-tight tracking-[0.14em] text-paper">
                {item.title}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {vendorSpaces.filter((space) => space.id === "artistAlley" || space.id === "standard10x10").map((space) => (
            <article key={space.id} className="border border-gold/50 bg-panel p-6 sm:p-8">
              <Badge tone="gold">Founding Vendor Rate</Badge>
              <h3 className="mt-5 font-display text-3xl uppercase tracking-wide">
                {space.name}{space.dimensions ? ` · ${space.dimensions}` : ""}
              </h3>
              <p className="mt-4 font-display text-5xl text-gold">
                {formatVendorPrice(space.founding ?? space.regular)}
              </p>
              <p className="mt-2 text-sm text-muted">Regular price {formatVendorPrice(space.regular)}</p>
              <ul className="mt-4 space-y-2 text-muted">
                {space.inclusions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Founding pricing is planned through {foundingVendorDeadlineLabel()}, subject to availability.
          Official applications are not open yet. Register interest for application updates.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/vendors/interest">Register Vendor Interest</Button>
          <Button href="/vendors#vendor-pricing" variant="secondary">
            View All Booth Options & Pricing
          </Button>
        </div>
      </Container>
    </section>
  );
}
