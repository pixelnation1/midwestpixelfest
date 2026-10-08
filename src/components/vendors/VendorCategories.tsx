import { ArcadeIcon } from "@/components/retro/ArcadeIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  vendorBrowseCategories,
} from "@/lib/vendors";

export function VendorCategories() {
  return (
    <section
      id="vendor-fit"
      className="scroll-mt-24 py-8 sm:py-10"
      aria-labelledby="vendor-fit-heading"
    >
      <SectionHeading
        id="vendor-fit-heading"
        eyebrow="The floor"
        title="Who this floor is for"
        description="If you sell or create work in gaming, collectibles, tabletop, original art, or pop culture, you are the kind of vendor this marketplace is being built for."
        tone="lime"
      />

      <ul className="mt-10 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
        {vendorBrowseCategories.map((item) => (
          <li
            key={item.title}
            className="flex min-w-0 flex-col items-center border border-line bg-panel vendor-shelf px-3 py-5 text-center"
          >
            <ArcadeIcon name={item.icon} className="h-9 w-9 text-gold" />
            <p className="mt-3 break-words font-pixel text-[10px] uppercase leading-tight tracking-[0.12em] text-paper">
              {item.title}
            </p>
            <p className="mt-2 text-[11px] leading-snug text-muted">
              {item.examples}
            </p>
          </li>
        ))}
      </ul>

    </section>
  );
}
