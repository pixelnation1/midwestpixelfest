import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function VendorsSection() {
  return (
    <section className="border-b border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Artist alley & vendor hall"
          title="Sell at Midwest Pixel Fest"
          description="Vendor and artist applications are not open. Register interest if you want a heads-up when they are — that is not an application, and it is not a booth offer."
          tone="lime"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
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
