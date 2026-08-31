import { AnnouncementTicker } from "@/components/home/AnnouncementTicker";
import { CosplaySection } from "@/components/home/CosplaySection";
import { EmailSignup } from "@/components/home/EmailSignup";
import { EventIntro } from "@/components/home/EventIntro";
import { ExploreTheFest } from "@/components/home/ExploreTheFest";
import { FeaturedGuests } from "@/components/home/FeaturedGuests";
import { GamingPreview } from "@/components/home/GamingPreview";
import { Hero } from "@/components/home/Hero";
import { VendorsSection } from "@/components/home/VendorsSection";

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
      <EmailSignup />
    </>
  );
}
