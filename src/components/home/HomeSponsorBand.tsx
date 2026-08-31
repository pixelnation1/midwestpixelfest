import { EventCta } from "@/components/cta/EventCta";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { getPublishedSponsors } from "@/lib/sponsorships";

export function HomeSponsorBand() {
  const partners = getPublishedSponsors();

  return (
    <section className="border-b border-line py-16 sm:py-20" aria-labelledby="home-sponsor-heading">
      <Container>
        <SectionHeading
          id="home-sponsor-heading"
          eyebrow="Partner with Midwest Pixel Fest"
          title="Be part of the weekend."
          description="Want to put your business in front of the Midwest Pixel Fest community? An inquiry is not a sponsorship agreement."
          tone="gold"
        />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <EventCta href="/sponsors" label="View Sponsorship Opportunities" />
          <EventCta
            href="/sponsors/inquiry"
            label="Become a Sponsor"
            variant="secondary"
          />
        </div>
        {partners.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {partners.map((partner) => {
              const site = partner.website ? parseAllowedHttpUrl(partner.website) : null;
              const inner = (
                <>
                  {partner.logo && partner.logo.startsWith("/") ? (
                    // Local /public assets only. Remote logos can wait for next/image config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logo}
                      alt=""
                      className="mx-auto max-h-12 w-auto object-contain"
                    />
                  ) : null}
                  <span className="mt-2 block font-display text-sm uppercase tracking-[0.12em]">
                    {partner.name}
                  </span>
                </>
              );
              return (
                <li key={partner.slug} className="border border-line bg-panel px-4 py-5 text-center">
                  {site ? (
                    <a
                      href={site.toString()}
                      className="block text-paper transition-colors hover:text-cyan"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {inner}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
