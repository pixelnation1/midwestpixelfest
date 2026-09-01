import { ArcadeIcon } from "@/components/retro/ArcadeIcon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vendorBrowseCategories } from "@/lib/site";

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
          <article className="border border-line bg-panel p-8">
            <Badge tone="gold">Applications not open</Badge>
            <h3 className="mt-5 font-display text-4xl uppercase tracking-wide">
              Vendor hall
            </h3>
            <p className="mt-4 text-muted">
              Retail, collectibles, toys, games, and specialty goods. Space
              assignments and rates will be published when applications go live.
            </p>
          </article>

          <article className="border border-line bg-panel p-8">
            <Badge tone="gold">Applications not open</Badge>
            <h3 className="mt-5 font-display text-4xl uppercase tracking-wide">
              Artist alley
            </h3>
            <p className="mt-4 text-muted">
              Prints, originals, commissions, and handmade work. Artist alley is
              part of the show, not an afterthought.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/vendors/interest">Register Vendor Interest</Button>
          <Button href="/vendors" variant="secondary">
            Vendors
          </Button>
        </div>
      </Container>
    </section>
  );
}
