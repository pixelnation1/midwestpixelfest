import { EventCta } from "@/components/cta/EventCta";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import {
  formatVendorPrice,
  foundingVendorDeadlineLabel,
  getVendorPrimaryCta,
  vendorApplicationStatusLabel,
  vendorPacketNote,
  vendorSpaces,
  type VendorSpace,
} from "@/lib/vendors";

function SpacePrice({ space }: { space: VendorSpace }) {
  if (space.founding != null) {
    return (
      <div>
        <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">
          Founding rate
        </p>
        <p className="mt-2 font-display text-4xl uppercase tracking-wide text-gold sm:text-5xl">
          {formatVendorPrice(space.founding)}
        </p>
        <p className="mt-2 text-sm text-muted">
          Regular price {formatVendorPrice(space.regular)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-cyan">
        Regular price
      </p>
      <p className="mt-2 font-display text-4xl uppercase tracking-wide text-cyan sm:text-5xl">
        {formatVendorPrice(space.regular)}
      </p>
      <p className="mt-2 text-sm text-muted">
        No Founding Vendor Rate is currently assigned to this space.
      </p>
    </div>
  );
}

function SpaceCard({ space }: { space: VendorSpace }) {
  const cta = getVendorPrimaryCta();
  const status = vendorApplicationStatusLabel();
  const founding = space.founding != null;

  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col border bg-panel p-6 sm:p-8",
        founding ? "border-gold/50" : "border-line",
      )}
    >
      <div className="flex flex-wrap gap-2">
        {founding ? <Badge tone="gold">Founding Vendor Rate</Badge> : null}
        <Badge tone={founding ? "gold" : "cyan"}>{status}</Badge>
      </div>
      <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
        {space.name}
      </h3>
      {space.dimensions ? (
        <p className="mt-2 font-pixel text-[11px] uppercase tracking-[0.16em] text-cyan">
          {space.dimensions}
        </p>
      ) : null}
      <div className="mt-5">
        <SpacePrice space={space} />
      </div>
      <p className="mt-4 text-muted">{space.description}</p>
      <ul className="mt-5 space-y-2">
        {space.inclusions.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-paper">
            <span className="text-lime" aria-hidden="true">
              ▸
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">{status}.</p>
      <div className="mt-auto pt-6">
        <EventCta
          href={cta.href}
          label={cta.label}
          variant={founding ? "primary" : "secondary"}
          className="w-full sm:w-auto"
          external={cta.external}
        />
      </div>
    </article>
  );
}

export function VendorPricing() {
  const deadline = foundingVendorDeadlineLabel();

  return (
    <section
      id="vendor-pricing"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="vendor-pricing-heading"
    >
      <SectionHeading
        id="vendor-pricing-heading"
        eyebrow="Pricing"
        title="Vendor & Artist Alley pricing"
        description="Midwest Pixel Fest is keeping inaugural-year vendor pricing accessible while building a strong marketplace of game retailers, collectors, artists, creators, and specialty sellers."
        tone="gold"
      />

      <div className="mt-10 border border-gold/50 bg-panel p-6 sm:p-8">
        <Badge tone="gold">Founding Vendor Rate</Badge>
        <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
          Join the inaugural marketplace
        </h3>
        <p className="mt-4 max-w-3xl text-muted">
          Join the inaugural Midwest Pixel Fest marketplace and save with our
          Founding Vendor pricing. Founding Vendor Rate is an introductory
          pricing tier — not permanent status, exclusive rights, special
          placement, a marketing package, or a guaranteed renewal.
        </p>
        <p className="mt-4 max-w-3xl text-paper">
          Founding Vendor pricing available through {deadline}.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Founding Vendor pricing is planned through {deadline}, subject to
          availability. The deadline is informational until official
          applications launch.
        </p>
      </div>

      <ul className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
        {vendorSpaces.map((space) => (
          <li key={space.id} className="min-w-0">
            <SpaceCard space={space} />
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-3xl text-sm text-muted">{vendorPacketNote}</p>
      <p className="mt-3 max-w-3xl text-sm text-muted">
        Vendor and Artist Alley applications are free to submit. Registering
        interest does not guarantee acceptance, reserve space, lock in a booth,
        require payment, or create a contract.
      </p>
    </section>
  );
}
