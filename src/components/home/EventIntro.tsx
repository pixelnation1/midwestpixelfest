import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EventIntro() {
  return (
    <section className="relative border-b border-line bg-ink-2 py-20 sm:py-28">
      <Container className="grid items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading
            eyebrow="The weekend"
            title="The Midwest is getting a new kind of convention."
            tone="cyan"
          />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-5">
          <p>
            Midwest Pixel Fest is being built as a play-first weekend: video
            games, retro cabinets, tabletop, trading cards, cosplay, vendors,
            and the people who show up for all of it.
          </p>
          <p>
            Emporia sits on the I-35 corridor as a meeting point for Kansas
            City, Wichita, Topeka, Lawrence, Manhattan, and the surrounding
            Midwest. This is a regional floor, not a scaled-down copy of a
            coastal mega-con.
          </p>
          <p>
            <Link
              href="/about"
              className="font-display text-sm uppercase tracking-[0.2em] text-cyan transition-colors hover:text-magenta"
            >
              About Midwest Pixel Fest ▸
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
