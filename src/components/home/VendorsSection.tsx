import { EventCta } from "@/components/cta/EventCta";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function VendorsSection() {
  return (
    <section className="border-b border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Artist alley & vendor hall"
          title="Sell at Midwest Pixel Fest"
          description="Vendor and artist applications will open as the 2027 weekend is locked. Booths, tables, and artist alley spots are being planned for independent makers, game shops, collectible sellers, and original art."
          tone="lime"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <article className="border border-line bg-panel p-8">
            <Badge tone="gold">Coming soon</Badge>
            <h3 className="mt-5 font-display text-4xl uppercase tracking-wide">
              Vendor application
            </h3>
            <p className="mt-4 text-muted">
              Retail, collectibles, toys, games, and specialty goods. Space
              assignments and rates will be published when applications go live.
            </p>
            <div className="mt-8">
              <EventCta href="/vendors/interest" label="Join Vendor Updates" />
            </div>
          </article>

          <article className="border border-line bg-panel p-8">
            <Badge tone="gold">Coming soon</Badge>
            <h3 className="mt-5 font-display text-4xl uppercase tracking-wide">
              Artist application
            </h3>
            <p className="mt-4 text-muted">
              Prints, originals, commissions, and handmade work. Artist alley is
              part of the show, not an afterthought.
            </p>
            <div className="mt-8">
              <EventCta
                href="/vendors/interest"
                label="Register Vendor Interest"
                variant="secondary"
              />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
