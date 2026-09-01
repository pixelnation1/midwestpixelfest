import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyVendPoints } from "@/lib/vendors";

export function WhyVend() {
  return (
    <section
      id="vendor-info"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="why-vend-heading"
    >
      <SectionHeading
        id="why-vend-heading"
        eyebrow="The opportunity"
        title="Why sell at Midwest Pixel Fest?"
        description="Midwest Pixel Fest is building a marketplace around gaming, collectibles, original art, tabletop, TCGs, retro culture, and the creators who make convention floors worth exploring."
        tone="gold"
      />
      <ul className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2">
        {whyVendPoints.map((item) => (
          <li
            key={item.title}
            className="min-w-0 border border-line bg-panel p-6 sm:p-8"
          >
            <h3 className="font-display text-xl uppercase tracking-wide text-paper sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
