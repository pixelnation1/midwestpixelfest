import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatVendorPriceOrTba,
  vendorAddOns,
} from "@/lib/vendors";

export function VendorAddOns() {
  return (
    <section
      id="vendor-addons"
      className="scroll-mt-24 py-8 sm:py-10"
      aria-labelledby="vendor-addons-heading"
    >
      <SectionHeading
        id="vendor-addons-heading"
        eyebrow="Add-ons"
        title="Optional add-ons"
        description="Add-ons are subject to venue capacity, availability, and final vendor policies. They are not purchasable yet."
        tone="cyan"
      />
      <ul className="mt-10 grid min-w-0 gap-4 md:grid-cols-3">
        {vendorAddOns.map((item) => (
          <li
            key={item.id}
            className="min-w-0 border border-line bg-panel p-6 sm:p-8"
          >
            <Badge tone={item.price == null ? "gold" : "cyan"}>
              {item.price == null ? "Pricing TBA" : "Add-on"}
            </Badge>
            <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-paper">
              {item.name}
            </h3>
            <p className="mt-3 font-display text-3xl uppercase tracking-wide text-cyan">
              {formatVendorPriceOrTba(item.price)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{item.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
