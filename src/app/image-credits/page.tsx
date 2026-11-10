import type { Metadata } from "next";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Image Credits | Midwest Pixel Fest",
  description:
    "Photography credits for images used on the Midwest Pixel Fest website.",
  path: "/image-credits",
});

export default function ImageCreditsPage() {
  return (
    <InnerPage
      path="/image-credits"
      breadcrumbLabel="Image Credits"
      eyebrow="Site details"
      title="Image Credits"
      intro="Some photographs on this website illustrate the atmosphere we're building for our first Midwest Pixel Fest in 2027. They are not photos from a past Pixel Fest."
    >
      <ContentSection title="Arcade photography">
        <p>
          The arcade image used on our homepage and guest pages is{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Retrovolt_Arcade_2017_-_Arcade_Machines_1.jpg"
            className="text-cyan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Retrovolt Arcade 2017 - Arcade Machines 1
          </a>{" "}
          by{" "}
          <a
            href="https://www.flickr.com/photos/arcade_perfect/39672054801/"
            className="text-cyan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arcade Perfect
          </a>
          , used under the{" "}
          <a
            href="https://creativecommons.org/licenses/by/2.0/"
            className="text-cyan"
            target="_blank"
            rel="license noopener noreferrer"
          >
            Creative Commons Attribution 2.0 license
          </a>
          . The image was resized for web display and is shown with a gradient
          and scanline styling.
        </p>
      </ContentSection>

      <ContentSection title="Magic: The Gathering photography">
        <p><a className="text-cyan" href="https://commons.wikimedia.org/wiki/File:Magic_The_Gathering_players.JPG">Magic The Gathering players</a> by U.S. Air Force photographer Airman 1st Class Kyle Gese. Public domain in the United States. Resized and displayed with cropping and a gradient overlay.</p>
      </ContentSection>
      <ContentSection title="Cosplay photography">
        <p><a className="text-cyan" href="https://commons.wikimedia.org/wiki/File:NYCC_2023_Assassin%27s_Creed_Group_Cosplay.jpg">NYCC 2023 Assassin’s Creed Group Cosplay</a> by lostplanetcomics1, used under <a className="text-cyan" href="https://creativecommons.org/licenses/by-sa/2.0/" rel="license">CC BY-SA 2.0</a>. Resized, cropped for display, and shown with a gradient overlay. This adapted image remains available under CC BY-SA 2.0.</p>
      </ContentSection>
      <ContentSection title="Other imagery">
        <p>
          Additional illustrative photography comes from Pexels and Unsplash.
          Midwest Pixel Fest will share official event photography after the
          inaugural event.
        </p>
      </ContentSection>
    </InnerPage>
  );
}
