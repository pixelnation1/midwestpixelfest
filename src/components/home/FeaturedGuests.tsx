import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllGuests } from "@/content/guests";

export function FeaturedGuests() {
  const announced = getAllGuests();

  return (
    <section className="border-b border-line bg-ink-2 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Featured guests"
            title="Guest announcements are coming."
            description="Creators, artists, streamers, authors, performers, and community personalities will be posted here when they are confirmed."
            tone="magenta"
          />
          <Button href="/guests" variant="secondary">
            View Guests
          </Button>
        </div>
        {announced.length > 0 ? (
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {announced.map((guest) => (
              <li key={guest.slug}>
                <article className="border border-line bg-panel p-6">
                  <Badge tone="magenta">{guest.role}</Badge>
                  <h3 className="mt-4 font-display text-3xl uppercase tracking-wide">
                    {guest.name}
                  </h3>
                  <p className="mt-3 text-muted">{guest.bio}</p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-2xl border border-line bg-panel p-6 text-muted">
            No guests are announced yet. When a name is official, it will appear
            on the Guests page with appearance details.
          </p>
        )}
      </Container>
    </section>
  );
}
