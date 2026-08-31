import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { exploreCards } from "@/lib/site";
import { ExploreIcon, type ExploreIconName } from "@/components/home/ExploreIcon";

const accentMap = {
  cyan: "hover:border-cyan hover:shadow-[8px_8px_0_0_var(--color-cyan)]",
  magenta: "hover:border-magenta hover:shadow-[8px_8px_0_0_var(--color-magenta)]",
  gold: "hover:border-gold hover:shadow-[8px_8px_0_0_var(--color-gold)]",
  lime: "hover:border-lime hover:shadow-[8px_8px_0_0_var(--color-lime)]",
} as const;

const iconTone = {
  cyan: "text-cyan",
  magenta: "text-magenta",
  gold: "text-gold",
  lime: "text-lime",
} as const;

export function ExploreTheFest() {
  return (
    <section id="explore" className="border-b border-line py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Explore the fest"
          title="Six ways to show up."
          description="Every card leads deeper into the weekend. Pick a lane — or walk all of them."
          tone="gold"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {exploreCards.map((card) => (
            <li key={card.title}>
              <Link
                href={card.href}
                className={cn(
                  "group flex h-full flex-col border border-line bg-panel p-6 transition-all duration-200",
                  accentMap[card.accent],
                )}
              >
                <span className={cn("mb-6", iconTone[card.accent])}>
                  <ExploreIcon name={card.icon as ExploreIconName} />
                </span>
                <h3 className="font-display text-3xl uppercase tracking-wide text-paper">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-muted">{card.description}</p>
                <span className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-paper/70 group-hover:text-inherit">
                  View {card.title} ▸
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
