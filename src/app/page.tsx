import { AnnouncementTicker } from "@/components/home/AnnouncementTicker";
import { CosplaySection } from "@/components/home/CosplaySection";
import { EmailSignup } from "@/components/home/EmailSignup";
import { EventIntro } from "@/components/home/EventIntro";
import { ExploreTheFest } from "@/components/home/ExploreTheFest";
import { FeaturedGuests } from "@/components/home/FeaturedGuests";
import { GamingPreview } from "@/components/home/GamingPreview";
import { Hero } from "@/components/home/Hero";
import { HomeSponsorBand } from "@/components/home/HomeSponsorBand";
import { InvolveSection } from "@/components/home/InvolveSection";
import { LatestNews } from "@/components/home/LatestNews";
import { VendorsSection } from "@/components/home/VendorsSection";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = createPageMetadata({
  title: site.defaultTitle,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementTicker />
      <EventIntro />
      <ExploreTheFest />
      <FeaturedGuests />
      <GamingPreview />
      <CosplaySection />
      <VendorsSection />
      <HomeSponsorBand />
      <LatestNews />
      <InvolveSection />
      <EmailSignup />
    </>
  );
}
