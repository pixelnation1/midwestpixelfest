import { GuestCard } from "@/components/retro/GuestCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllGuests } from "@/content/guests";

export function FeaturedGuests() {
  const announced = getAllGuests();
  const hasGuests = announced.length > 0;

  return (
    <section className="bg-ink-2 py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeading
            eyebrow="Featured guests"
            title={hasGuests ? "Meet our guests." : "Guest announcements coming."}
            description={hasGuests
              ? "Meet the creators and community voices joining Midwest Pixel Fest. Explore their profiles for appearance details."
              : "Our first lineup is taking shape. Join the update list for guest announcements as names are confirmed."}
            tone="magenta"
          />
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/#updates">Get Guest Updates</Button>
            {hasGuests ? (
              <Button href="/guests" variant="secondary">View All Guests</Button>
            ) : null}
          </div>
        </div>
        {hasGuests ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {announced.slice(0, 3).map((guest) => (
              <li key={guest.slug}><GuestCard guest={guest} /></li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
