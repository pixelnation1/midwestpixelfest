import { PackageCard } from "@/components/sponsors/PackageCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sponsorshipGuideUrl, sponsorshipPackages } from "@/lib/sponsorships";
import { Button } from "@/components/ui/Button";

export function PackageGrid() {
  return (
    <section id="packages" className="scroll-mt-24 py-10 sm:py-14" aria-labelledby="packages-heading">
      <SectionHeading
        id="packages-heading"
        eyebrow="Packages"
        title="Sponsorship packages"
        description="These are working package names so we can talk in specifics. Prices and final inclusions will be confirmed in writing. An inquiry does not reserve a tier or create an agreement."
        tone="magenta"
      />
      {sponsorshipGuideUrl ? (
        <div className="mt-6">
          <Button
            href={sponsorshipGuideUrl}
            external={sponsorshipGuideUrl.startsWith("http")}
            variant="secondary"
          >
            Download Sponsorship Guide
          </Button>
        </div>
      ) : null}
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {sponsorshipPackages.map((pkg) => (
          <li key={pkg.id}>
            <PackageCard pkg={pkg} />
          </li>
        ))}
      </ul>
    </section>
  );
}
