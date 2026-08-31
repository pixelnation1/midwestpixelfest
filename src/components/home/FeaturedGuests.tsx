import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { guestPlaceholders } from "@/lib/site";

const accents = {
  magenta: "border-magenta/40 from-magenta/20",
  cyan: "border-cyan/40 from-cyan/20",
  gold: "border-gold/40 from-gold/20",
} as const;

type FeaturedGuestsProps = {
  showIntro?: boolean;
};

export function GuestCardGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {guestPlaceholders.map((guest, index) => (
        <li key={guest.id}>
          <article
            className={cn(
              "relative overflow-hidden border bg-panel p-6",
              accents[guest.accent],
            )}
          >
            <div
              className={cn(
                "mb-6 flex aspect-[4/5] items-end justify-center bg-gradient-to-b to-transparent",
                accents[guest.accent],
              )}
            >
              <GuestSilhouette className="h-4/5 w-auto text-paper/25" />
            </div>
            <Badge tone={guest.accent}>Slot 0{index + 1}</Badge>
            <h3 className="mt-4 font-display text-3xl uppercase tracking-wide">
              {guest.name}
            </h3>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-muted">
              {guest.role}
            </p>
            <p className="mt-3 font-pixel text-[11px] uppercase tracking-widest text-gold">
              {guest.note}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function FeaturedGuests({ showIntro = true }: FeaturedGuestsProps) {
  return (
    <section className="border-b border-line bg-ink-2 py-20 sm:py-28">
      <Container>
        {showIntro ? (
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured guests"
              title="Guest announcements coming soon"
              description="Talent, creators, and community guests will land here. These cards are ready to swap the moment the first name drops."
              tone="magenta"
            />
            <Button href="/guests" variant="secondary">
              View Guests
            </Button>
          </div>
        ) : null}
        <GuestCardGrid />
      </Container>
    </section>
  );
}

function GuestSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <circle cx="80" cy="52" r="32" />
      <path d="M28 210c8-64 28-92 52-92s44 28 52 92H28z" />
    </svg>
  );
}
