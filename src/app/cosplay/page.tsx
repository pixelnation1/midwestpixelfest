import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { InnerPage } from "@/components/pages/InnerPage";

export const metadata: Metadata = {
  title: "Cosplay",
  description:
    "Cosplay contests, meetups, and community programming at Midwest Pixel Fest in Emporia, Kansas.",
};

export default function CosplayPage() {
  return (
    <InnerPage
      eyebrow="Costume & character"
      title="Cosplay takes center stage"
      intro="Cosplay is not a side stage at Midwest Pixel Fest. Contests, creator meetups, and a floor that welcomes first-timers and veterans are part of the inaugural weekend."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="border border-line bg-panel p-8">
          <h2 className="font-display text-3xl uppercase tracking-wide">
            Contests
          </h2>
          <p className="mt-4 text-muted">
            Craftsmanship and performance categories are planned. Rules, props
            policy, and registration windows will be published before badges go
            on sale.
          </p>
        </article>
        <article className="border border-line bg-panel p-8">
          <h2 className="font-display text-3xl uppercase tracking-wide">
            Meetups & photos
          </h2>
          <p className="mt-4 text-muted">
            Group meetups, photographer-friendly spaces, and community hangouts
            will be on the schedule. Original characters and fandom looks are
            both welcome — just keep it convention-appropriate.
          </p>
        </article>
      </div>
      <div className="mt-12">
        <Button href="/tickets" size="lg">
          Cosplay at Pixel Fest
        </Button>
      </div>
    </InnerPage>
  );
}
