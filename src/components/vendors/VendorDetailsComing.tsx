import { SectionHeading } from "@/components/ui/SectionHeading";
import { vendorDetailsComing, vendorPricingPublished } from "@/lib/vendors";

export function VendorDetailsComing() {
  return (
    <section
      id="vendor-details"
      className="scroll-mt-24 py-8 sm:py-10"
      aria-labelledby="vendor-details-heading"
    >
      <SectionHeading
        id="vendor-details-heading"
        eyebrow="Vendor packet"
        title="Vendor details coming with applications"
        description={
          vendorPricingPublished
            ? "Booth details, pricing, and event policies are published with the official vendor application."
            : "Full booth details, pricing, and event policies will be released with official applications."
        }
        tone="gold"
      />
      <ul className="mt-10 grid min-w-0 gap-2 sm:grid-cols-2">
        {vendorDetailsComing.map((item) => (
          <li key={item} className="flex min-w-0 gap-3 border border-line bg-panel px-4 py-3">
            <span className="text-gold" aria-hidden="true">
              ▸
            </span>
            <span className="text-muted">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
