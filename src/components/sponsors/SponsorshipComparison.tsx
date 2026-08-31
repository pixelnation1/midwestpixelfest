import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getComparisonBenefits,
  getPackageBenefit,
  packagePriceDisplay,
  showBenefitComparison,
  sponsorshipPackages,
} from "@/lib/sponsorships";

function CellCopy({
  label,
  detail,
}: {
  label: string;
  detail?: string;
}) {
  return (
    <span>
      <span className="font-display uppercase tracking-[0.1em]">{label}</span>
      {detail ? <span className="mt-1 block text-sm font-sans normal-case tracking-normal text-muted">{detail}</span> : null}
    </span>
  );
}

/**
 * Public comparison stays hidden until showBenefitComparison is true and
 * packages have real benefit rows. Do not invent a matrix.
 */
export function SponsorshipComparison() {
  const benefits = getComparisonBenefits();
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
        title="Package comparison"
        description="Included means it is part of that package. Custom / contact us means it can be discussed. Not included means it is not part of that package unless we agree otherwise in writing."
        tone="cyan"
      />

      <div className="mt-10 hidden lg:block">
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              Sponsorship package comparison. Each cell states whether a benefit is
              included, not included, or custom.
            </caption>
            <thead>
              <tr className="border-b border-line bg-panel-2">
                <th scope="col" className="px-4 py-4 font-display text-sm uppercase tracking-[0.14em]">
                  Benefit
                </th>
                {sponsorshipPackages.map((pkg) => (
                  <th
                    key={pkg.id}
                    scope="col"
                    className="px-4 py-4 font-display text-sm uppercase tracking-[0.14em]"
                  >
                    <span className="block">{pkg.name}</span>
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
                    className="bg-panel px-4 py-4 align-top font-display text-sm uppercase tracking-[0.12em] text-paper"
                  >
                    {benefit.label}
                  </th>
                  {sponsorshipPackages.map((pkg) => {
                    const cell = getPackageBenefit(pkg, benefit.id);
                    return (
                      <td key={pkg.id} className="bg-panel px-4 py-4 align-top text-muted">
                        <CellCopy label={cell.label} detail={cell.detail} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="mt-10 grid gap-4 lg:hidden">
        {sponsorshipPackages.map((pkg) => (
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
                    <dd className="mt-1 text-sm text-muted">
                      <CellCopy label={cell.label} detail={cell.detail} />
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
