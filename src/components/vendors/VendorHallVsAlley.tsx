import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { artistAlleyFit, vendorHallFit } from "@/lib/vendors";

export function VendorHallVsAlley() {
  return (
    <section
      className="scroll-mt-24 py-8 sm:py-10"
      aria-labelledby="hall-vs-alley-heading"
    >
      <SectionHeading
        id="hall-vs-alley-heading"
        eyebrow="Placement"
        title="Vendor Hall vs Artist Alley"
        description="Choose the closest fit when you register interest. Final placement can be determined during the application process."
        tone="cyan"
      />
      <div className="mt-10 grid min-w-0 gap-4 md:grid-cols-2">
        <article className="min-w-0 border border-line bg-panel p-6 sm:p-8">
          <Badge tone="gold">Retail & specialty goods</Badge>
          <h3 className="mt-5 font-display text-3xl uppercase tracking-wide text-paper">
            Vendor Hall
          </h3>
          <p className="mt-4 text-muted">
            Best suited for businesses selling products such as:
          </p>
          <ul className="mt-4 grid gap-2">
            {vendorHallFit.map((item) => (
              <li key={item} className="flex gap-3 text-muted">
                <span className="text-gold" aria-hidden="true">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article
          id="artists"
          className="min-w-0 scroll-mt-24 border border-line bg-panel p-6 sm:p-8"
        >
          <Badge tone="cyan">Original creative work</Badge>
          <h3 className="mt-5 font-display text-3xl uppercase tracking-wide text-paper">
            Artist Alley
          </h3>
          <p className="mt-4 text-muted">
            Best suited for creators selling primarily their own work such as:
          </p>
          <ul className="mt-4 grid gap-2">
            {artistAlleyFit.map((item) => (
              <li key={item} className="flex gap-3 text-muted">
                <span className="text-cyan" aria-hidden="true">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Artist Alley is intended for original creative work. Resale-heavy
            retail is not an automatic fit for this category.
          </p>
        </article>
      </div>
      <p className="mt-6 max-w-3xl text-muted">
        Not sure which category fits? Register your interest and choose the
        closest option. Final placement and category can be determined during
        the application process.
      </p>
    </section>
  );
}
