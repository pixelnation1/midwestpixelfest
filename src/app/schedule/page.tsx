import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { InnerPage } from "@/components/pages/InnerPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Schedule",
  description: `Programming, panels, and tournaments at ${site.name}.`,
};

const blocks = [
  {
    day: "Friday",
    items: ["Doors & badge pickup", "Vendor hall preview", "Opening programming", "Evening socials"],
  },
  {
    day: "Saturday",
    items: [
      "Main programming day",
      "Cosplay contest",
      "Tournaments & TCG events",
      "Panels, meetups, and concerts TBA",
    ],
  },
  {
    day: "Sunday",
    items: ["Final brackets", "Autographs & photos (when guests are announced)", "Last-chance vendor hours", "Close"],
  },
];

export default function SchedulePage() {
  return (
    <InnerPage
      eyebrow="Programming"
      title="Schedule"
      intro={`${site.dateLabel}. The official hour-by-hour grid will publish closer to the event. Here is the weekend shape we are building toward.`}
    >
      <div className="mb-8">
        <Badge tone="gold">Times to be announced</Badge>
      </div>
      <ol className="grid gap-4 lg:grid-cols-3">
        {blocks.map((block, index) => (
          <li key={block.day} className="border border-line bg-panel p-6">
            <p className="font-pixel text-[11px] uppercase tracking-[0.2em] text-cyan">
              Day 0{index + 1}
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-wide">
              {block.day}
            </h2>
            <ul className="mt-6 space-y-3 text-muted">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-magenta" aria-hidden="true">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </InnerPage>
  );
}
