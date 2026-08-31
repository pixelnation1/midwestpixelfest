import type { Metadata } from "next";
import { GuestCardGrid } from "@/components/home/FeaturedGuests";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Special Guests | Midwest Pixel Fest",
  description:
    "Special guest announcements for Midwest Pixel Fest in Emporia, Kansas. Creators, talent, and community guests will be posted here first.",
  path: "/guests",
});

export default function GuestsPage() {
  return (
    <InnerPage
      path="/guests"
      breadcrumbLabel="Guests"
      eyebrow="Talent & creators"
      title="Special guests"
      intro="Guest announcements are coming soon. When names drop, this page is where attendees, press, and sponsors will find photos, schedules, and appearance details."
    >
      <h2 className="mb-8 font-display text-2xl uppercase tracking-wide text-gold">
        Guest announcements coming soon
      </h2>
      <GuestCardGrid />
    </InnerPage>
  );
}
