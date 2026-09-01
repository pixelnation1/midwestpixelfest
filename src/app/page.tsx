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
import { ArcadeCountdown } from "@/components/retro/ArcadeCountdown";
import { EventInfoPanel } from "@/components/retro/EventInfoPanel";
import { PixelDivider } from "@/components/retro/PixelDivider";
import { Container } from "@/components/ui/Container";
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
      <section className="border-b border-line py-8 sm:py-10">
        <Container className="grid gap-4 lg:grid-cols-5 lg:items-stretch">
          <EventInfoPanel className="lg:col-span-3" />
          <div className="lg:col-span-2">
            <ArcadeCountdown />
          </div>
        </Container>
      </section>
      <EventIntro />
      <PixelDivider />
      <ExploreTheFest />
      <PixelDivider />
      <FeaturedGuests />
      <PixelDivider />
      <GamingPreview />
      <PixelDivider />
      <CosplaySection />
      <PixelDivider />
      <VendorsSection />
      <HomeSponsorBand />
      <LatestNews />
      <InvolveSection />
      <EmailSignup />
    </>
  );
}
