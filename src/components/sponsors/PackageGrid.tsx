import { PackageCard } from "@/components/sponsors/PackageCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  sponsorshipCommitmentFormUrl,
  sponsorshipGuideUrl,
  sponsorshipPackages,
} from "@/lib/sponsorships";
import { Button } from "@/components/ui/Button";

export function PackageGrid() {
  return (
    <section id="packages" className="scroll-mt-24 py-10 sm:py-14" aria-labelledby="packages-heading">
      <SectionHeading
        id="packages-heading"
        eyebrow="Levels"
        title="Sponsorship levels"
        description="Official partnership levels for Midwest Pixel Fest 2027. Exact benefits for each level will be confirmed in writing after a sponsorship is accepted. Submitting an inquiry does not reserve a level or create an agreement."
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
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sponsorshipPackages.map((pkg) => (
          <li key={pkg.id}>
            <PackageCard pkg={pkg} />
          </li>
        ))}
      </ul>
      {sponsorshipCommitmentFormUrl ? (
        <p className="mt-8 text-sm text-muted">
          The online inquiry is the first step. Approved sponsors receive the
          formal commitment form separately.
        </p>
      ) : null}
    </section>
  );
}
