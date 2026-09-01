import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import {
  comparisonLegend,
  getComparisonBenefits,
  getComparisonPackages,
  getPackageBenefit,
  packagePriceDisplay,
  showBenefitComparison,
  type BenefitStatus,
} from "@/lib/sponsorships";

const statusClass: Record<BenefitStatus, string> = {
  included: "text-lime",
  available: "text-cyan",
  priority: "text-gold",
  custom: "text-magenta",
  not_included: "text-muted",
};

function CellCopy({
  label,
  detail,
  status,
}: {
  label: string;
  detail?: string;
  status: BenefitStatus;
}) {
  return (
    <span>
      <span
        className={cn(
          "font-display uppercase tracking-[0.1em]",
          statusClass[status],
        )}
      >
        {label}
      </span>
      {detail && status !== "not_included" ? (
        <span className="mt-1 block text-sm font-sans normal-case tracking-normal text-muted">
          {detail}
        </span>
      ) : null}
    </span>
  );
}

function ComparisonLegend() {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {comparisonLegend.map((item) => (
        <li key={item.status} className="border border-line bg-panel p-4">
          <p
            className={cn(
              "font-display text-sm uppercase tracking-[0.12em]",
              statusClass[item.status],
            )}
          >
            {item.label}
          </p>
          <p className="mt-2 text-sm text-muted">{item.meaning}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Public comparison reads from package benefits. Custom / Event Sponsorship
 * is presented as its own section rather than a sixth table column.
 */
export function SponsorshipComparison() {
  const benefits = getComparisonBenefits();
  const packages = getComparisonPackages();
  if (!showBenefitComparison || benefits.length === 0) return null;

  return (
    <section
      id="compare"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="compare-heading"
    >
      <SectionHeading
        id="compare-heading"
        eyebrow="Compare"
        title="Benefit comparison"
        description="Included is part of the level. Available means eligible or subject to approval — not guaranteed. Priority is first consideration among eligible opportunities. Custom is negotiated. A dash means it is not part of that level."
        tone="cyan"
      />

      <ComparisonLegend />

      <div className="mt-10 hidden md:block">
        <div
          className="overflow-x-auto border border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          tabIndex={0}
          role="region"
          aria-label="Sponsorship benefit comparison table. Scroll horizontally to see every package."
        >
          <table className="w-full min-w-[58rem] border-collapse text-left">
            <caption className="sr-only">
              Sponsorship package comparison. Each cell states whether a benefit is
              included, available, priority, custom, or not part of that package.
            </caption>
            <thead>
              <tr className="border-b border-line bg-panel-2">
                <th
                  scope="col"
                  className="sticky left-0 z-20 bg-panel-2 px-4 py-4 font-display text-sm uppercase tracking-[0.14em] shadow-[2px_0_0_0_rgba(246,241,232,0.12)]"
                >
                  Benefit
                </th>
                {packages.map((pkg) => (
                  <th
                    key={pkg.id}
                    scope="col"
                    className="min-w-[9.5rem] px-4 py-4 font-display text-sm uppercase tracking-[0.14em]"
                  >
                    <span className="block">{pkg.name.replace(" Sponsor", "")}</span>
                    <span className="mt-1 block font-sans text-xs font-normal normal-case tracking-normal text-cyan">
                      {packagePriceDisplay(pkg)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefits.map((benefit) => (
                <tr key={benefit.id} className="border-b border-line">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-panel px-4 py-4 align-top font-display text-sm uppercase tracking-[0.12em] text-paper shadow-[2px_0_0_0_rgba(246,241,232,0.12)]"
                  >
                    {benefit.label}
                  </th>
                  {packages.map((pkg) => {
                    const cell = getPackageBenefit(pkg, benefit.id);
                    return (
                      <td
                        key={pkg.id}
                        className="bg-panel px-4 py-4 align-top text-sm"
                        title={cell.detail}
                      >
                        <CellCopy label={cell.label} status={cell.status} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 hidden text-sm text-muted md:block xl:hidden">
          Scroll sideways if needed to compare every level. Available and
          Priority are eligible opportunities, not guarantees.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 md:hidden">
        {packages.map((pkg) => (
          <li key={pkg.id} className="border border-line bg-panel p-5 sm:p-6">
            <h3 className="font-display text-2xl uppercase tracking-wide">{pkg.name}</h3>
            <p className="mt-2 text-cyan">{packagePriceDisplay(pkg)}</p>
            <dl className="mt-5 divide-y divide-line">
              {benefits.map((benefit) => {
                const cell = getPackageBenefit(pkg, benefit.id);
                return (
                  <div key={benefit.id} className="py-3">
                    <dt className="font-display text-sm uppercase tracking-[0.12em] text-paper">
                      {benefit.label}
                    </dt>
                    <dd className="mt-1 text-sm">
                      <CellCopy
                        label={cell.label}
                        detail={cell.detail}
                        status={cell.status}
                      />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
