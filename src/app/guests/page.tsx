import type { Metadata } from "next";
import { GuestCardGrid } from "@/components/home/FeaturedGuests";
import { InnerPage } from "@/components/pages/InnerPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guests",
  description: `Special guest announcements for ${site.name} in ${site.location}.`,
};

export default function GuestsPage() {
  return (
    <InnerPage
      eyebrow="Talent & creators"
      title="Special guests"
      intro="Guest announcements are coming soon. When names drop, this page is where attendees, press, and sponsors will find photos, schedules, and appearance details."
    >
      <p className="mb-8 font-display text-2xl uppercase tracking-wide text-gold">
        Guest announcements coming soon
      </p>
      <GuestCardGrid />
    </InnerPage>
  );
}
