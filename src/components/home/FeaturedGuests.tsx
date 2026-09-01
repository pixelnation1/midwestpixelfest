import { GuestAnnouncementCard, GuestCard } from "@/components/retro/GuestCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllGuests } from "@/content/guests";

export function FeaturedGuests() {
  const announced = getAllGuests();

  return (
    <section className="bg-ink-2 py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Featured guests"
            title="Guest announcements coming."
            description="Creators, artists, streamers, authors, performers, and community personalities will be posted here when they are confirmed."
            tone="magenta"
          />
          <Button href="/guests" variant="secondary">
            View Guests
          </Button>
        </div>
        {announced.length > 0 ? (
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {announced.slice(0, 3).map((guest) => (
              <li key={guest.slug}>
                <GuestCard guest={guest} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="overflow-hidden border border-magenta/40 bg-panel px-6 py-12 text-center pixel-frame lg:col-span-2 lg:flex lg:flex-col lg:justify-center">
              <p className="font-pixel text-[11px] uppercase tracking-[0.28em] text-gold">
                Now loading
              </p>
              <h3 className="mt-3 font-display text-3xl uppercase tracking-wide sm:text-5xl">
                Guest announcements coming
              </h3>
              <p className="mx-auto mt-4 max-w-lg text-muted">
                Confirmed names will appear here with photos and appearance
                details. Until a name is official, it is not on this site.
              </p>
            </div>
            <GuestAnnouncementCard />
          </div>
        )}
      </Container>
    </section>
  );
}
