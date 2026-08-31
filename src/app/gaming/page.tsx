import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { InnerPage } from "@/components/pages/InnerPage";
import { gamingPillars } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gaming",
  description:
    "Retro gaming, console tournaments, tabletop, trading card games, and free play at Midwest Pixel Fest.",
};

export default function GamingPage() {
  return (
    <InnerPage
      eyebrow="Press start"
      title="Gaming"
      intro="Midwest Pixel Fest is being built as a play-first convention. Expect dedicated space for retro hardware, console competition, tabletop, trading card games, and open free play."
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {gamingPillars.map((pillar) => (
          <li key={pillar.title} className="border border-line bg-panel p-8" id={pillar.title === "Trading Card Games" ? "tcg" : undefined}>
            <h2 className="font-display text-3xl uppercase tracking-wide">
              {pillar.title}
            </h2>
            <p className="mt-4 text-muted">{pillar.description}</p>
            <p className="mt-4 text-sm text-gold">
              Event lists, game titles, and signup rules will be posted with the schedule.
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex flex-wrap gap-4">
        <Button href="/tickets">Get Tickets</Button>
        <Button href="/schedule" variant="secondary">
          View Schedule
        </Button>
      </div>
    </InnerPage>
  );
}
