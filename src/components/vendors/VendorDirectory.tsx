import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPublishedVendors } from "@/lib/persistence/directory";

/** Small marketplace preview for the vendor recruitment page. */
export async function VendorDirectory() {
  const vendors = await listPublishedVendors();
  return <section id="vendor-directory" aria-labelledby="vendor-directory-heading"
    className="scroll-mt-24 py-8 sm:py-10">
    <SectionHeading
      id="vendor-directory-heading"
      eyebrow="Lineup"
      title="Meet the marketplace"
      description="The official directory of approved Midwest Pixel Fest exhibitors and Artist Alley creators."
      tone="cyan"
    />
    {vendors.length === 0 ? (
      <p className="mt-8 max-w-2xl border border-line bg-panel p-6 text-muted sm:p-8">
        We haven't announced any confirmed exhibitors yet. The directory will
        grow as applications are confirmed and vendors approve their public profiles.
      </p>
    ) : (
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.slice(0, 3).map(v => <li key={v.id} className="border border-line bg-panel p-6">
          <p className="font-pixel text-[10px] uppercase tracking-widest text-cyan">{v.exhibitorType}</p>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{v.displayName}</h3>
          <p className="mt-2 text-sm text-gold">{v.category}</p>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{v.shortDescription}</p>
          <Link href={"/exhibitors/" + v.id}
            className="mt-4 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-wider text-cyan">
            View exhibitor profile →
          </Link>
        </li>)}
      </ul>
    )}
    <Link href="/exhibitors"
      className="mt-7 inline-flex min-h-11 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-widest text-cyan hover:bg-cyan/10">
      Explore Exhibitors & Artist Alley →
    </Link>
  </section>;
}
