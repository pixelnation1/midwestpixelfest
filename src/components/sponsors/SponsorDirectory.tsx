import { EventCta } from "@/components/cta/EventCta";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import {
  getPublicSponsorCards,
  groupPublicSponsors,
} from "@/lib/sponsor-ops/directory";

export function SponsorDirectory() {
  const cards = getPublicSponsorCards();
  const groups = groupPublicSponsors(cards);
  const ungrouped =
    groups.length === 0
      ? cards
      : cards.filter((card) => !groups.some((group) => group.sponsors.includes(card)));

  return (
    <section
      id="our-sponsors"
      className="scroll-mt-24 py-10 sm:py-14"
      aria-labelledby="our-sponsors-heading"
    >
      <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-gold">
        Recognition
      </p>
      <h2
        id="our-sponsors-heading"
        className="mt-4 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl"
      >
        Our 2027 Sponsors
      </h2>
      {cards.length === 0 ? (
        <div className="mt-6 border border-line bg-panel p-6 sm:p-8">
          <p className="max-w-3xl text-muted">
            Confirmed 2027 sponsors will appear here after payment, required
            assets, and organizer review. An inquiry does not list a business as
            a sponsor.
          </p>
          <div className="mt-6">
            <EventCta href="/sponsors/inquiry" label="Become a Sponsor" />
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="font-display text-xl uppercase tracking-wide text-cyan">
                {group.label}
              </h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.sponsors.map((sponsor) => (
                  <SponsorDirectoryCard key={`${group.id}-${sponsor.displayName}`} sponsor={sponsor} />
                ))}
              </ul>
            </div>
          ))}
          {ungrouped.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ungrouped.map((sponsor) => (
                <SponsorDirectoryCard key={sponsor.displayName} sponsor={sponsor} />
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </section>
  );
}

function SponsorDirectoryCard({
  sponsor,
}: {
  sponsor: ReturnType<typeof getPublicSponsorCards>[number];
}) {
  const siteUrl = sponsor.website ? parseAllowedHttpUrl(sponsor.website) : null;
  return (
    <li className="min-w-0 border border-line bg-panel p-6 sm:p-8">
      {sponsor.logo && sponsor.logo.startsWith("/") ? (
        // Local /public assets only.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sponsor.logo}
          alt=""
          className="mb-4 max-h-14 w-auto max-w-full object-contain"
        />
      ) : null}
      <p className="font-pixel text-[11px] uppercase tracking-[0.18em] text-gold">
        {sponsor.levelLabel}
      </p>
      <h4 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">
        {sponsor.displayName}
      </h4>
      {sponsor.sponsoredArea ? (
        <p className="mt-2 text-sm text-cyan">{sponsor.sponsoredArea}</p>
      ) : null}
      {sponsor.publicDescription ? (
        <p className="mt-3 text-muted">{sponsor.publicDescription}</p>
      ) : null}
      {siteUrl ? (
        <p className="mt-4">
          <a
            href={siteUrl.toString()}
            className="text-cyan underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit website
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      ) : null}
    </li>
  );
}
