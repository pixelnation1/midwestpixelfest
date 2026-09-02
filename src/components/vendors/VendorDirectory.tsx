import { SectionHeading } from "@/components/ui/SectionHeading";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { getPublishedVendors, type ConfirmedVendor } from "@/lib/vendors";
import { listPublishedVendors } from "@/lib/persistence/directory";

function VendorLinks({ vendor }: { vendor: ConfirmedVendor }) {
  const website = vendor.website ? parseAllowedHttpUrl(vendor.website) : null;
  const social = vendor.social ? parseAllowedHttpUrl(vendor.social) : null;
  if (!website && !social) return null;

  return (
    <p className="mt-4 flex flex-wrap gap-4 text-sm">
      {website ? (
        <a
          href={website.href}
          className="text-cyan underline-offset-4 hover:underline"
          rel="noopener noreferrer"
        >
          Website
        </a>
      ) : null}
      {social ? (
        <a
          href={social.href}
          className="text-cyan underline-offset-4 hover:underline"
          rel="noopener noreferrer"
        >
          Social
        </a>
      ) : null}
    </p>
  );
}

export async function VendorDirectory() {
  const published = await listPublishedVendors();
  const vendors =
    published.length > 0
      ? published.map((vendor) => ({
          slug: vendor.displayName,
          name: vendor.displayName,
          category: vendor.category,
          description: vendor.shortDescription,
          website: vendor.website,
          social: vendor.socialUrl,
          booth: vendor.boothLocation,
          image: vendor.logo,
          published: true,
        }))
      : getPublishedVendors();

  return (
    <section
      id="vendor-directory"
      className="scroll-mt-24 py-8 sm:py-10"
      aria-labelledby="vendor-directory-heading"
    >
      <SectionHeading
        id="vendor-directory-heading"
        eyebrow="Lineup"
        title="Meet the marketplace"
        description="Confirmed Midwest Pixel Fest vendors and artists will be published here as the lineup grows."
        tone="cyan"
      />

      {vendors.length === 0 ? (
        <p className="mt-8 max-w-2xl border border-line bg-panel p-6 text-muted sm:p-8">
          No confirmed vendors or artists are listed yet. This directory will
          update after applicants are accepted. Illustrative photography on this
          page is not a list of participating businesses.
        </p>
      ) : (
        <ul className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2">
          {vendors.map((vendor) => (
            <li
              key={vendor.slug}
              className="min-w-0 border border-line bg-panel p-6 sm:p-8"
            >
              <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-gold">
                {vendor.category}
                {vendor.booth ? ` · ${vendor.booth}` : ""}
              </p>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">
                {vendor.name}
              </h3>
              <p className="mt-3 text-muted">{vendor.description}</p>
              <VendorLinks vendor={vendor} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
