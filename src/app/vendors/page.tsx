import type { Metadata } from "next";
import { ScenePhoto } from "@/components/media/ScenePhoto";
import { InnerPage } from "@/components/pages/InnerPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { VendorCategories } from "@/components/vendors/VendorCategories";
import { VendorDetailsComing } from "@/components/vendors/VendorDetailsComing";
import { VendorDirectory } from "@/components/vendors/VendorDirectory";
import { VendorFaq } from "@/components/vendors/VendorFaq";
import { VendorHallVsAlley } from "@/components/vendors/VendorHallVsAlley";
import { VendorProcess } from "@/components/vendors/VendorProcess";
import { VendorStatusPanel } from "@/components/vendors/VendorStatusPanel";
import { WhyVend } from "@/components/vendors/WhyVend";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { buildFaqPageJsonLd } from "@/lib/structured-data";
import { getVendorPrimaryCta, vendorFaqs } from "@/lib/vendors";

export const metadata: Metadata = createPageMetadata({
  title: "Vendors & Artist Alley | Midwest Pixel Fest 2027",
  description:
    "Interested in vending at Midwest Pixel Fest 2027 in Emporia, Kansas? Learn about Vendor Hall and Artist Alley opportunities and register for application updates.",
  path: "/vendors",
});

export default function VendorsPage() {
  const vendorCta = getVendorPrimaryCta();

  return (
    <InnerPage
      path="/vendors"
      breadcrumbLabel="Vendors"
      eyebrow="Sell at the fest"
      title="Vendors & Artist Alley"
      intro="Bring your shop, collection, creations, or brand to Midwest Pixel Fest 2027. We're building a marketplace around gaming, collectibles, original art, tabletop, TCGs, retro culture, and the creators who make convention floors worth exploring. Vendor and Artist Alley applications are not open yet. Register your interest now and we'll let you know when applications launch."
      meta={`${site.dateLabel} · ${site.location}`}
      actions={[
        {
          href: vendorCta.href,
          label: vendorCta.label,
        },
        {
          href: "#vendor-info",
          label: "Explore Vendor Info",
          variant: "secondary",
        },
      ]}
    >
      <JsonLd data={buildFaqPageJsonLd(vendorFaqs)} />

      <ScenePhoto
        src="/images/vendors/collectible-figurines.jpg"
        alt="Collectible figurines and pins arranged on a crowded vendor table"
        caption="Collectibles"
        objectPosition="center 40%"
        overlay="dark"
        sizes="(min-width: 1024px) 960px, 100vw"
        className="mb-3 aspect-[16/10] w-full min-w-0 sm:aspect-[21/9] pixel-frame"
      />
      <p className="mb-8 max-w-2xl text-sm text-muted">
        Illustrative marketplace photography. Photographed tables are not
        Midwest Pixel Fest vendors.
      </p>

      <VendorStatusPanel />
      <WhyVend />
      <VendorCategories />
      <VendorHallVsAlley />

      <CtaStrip
        className="mt-6"
        title={
          vendorCta.mode === "apply"
            ? "Ready to apply?"
            : "Get notified when applications open"
        }
        actions={[
          { href: vendorCta.href, label: vendorCta.label },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      >
        <p>
          {vendorCta.mode === "apply"
            ? "Submit the official vendor or Artist Alley application when you are ready."
            : "Registering interest is not an application and does not reserve a booth."}
        </p>
      </CtaStrip>

      <VendorProcess />
      <VendorDetailsComing />
      <VendorDirectory />
      <VendorFaq />

      <CtaStrip
        className="mt-10"
        title={
          vendorCta.mode === "apply"
            ? "Apply for Vendor Hall or Artist Alley"
            : "Register vendor interest"
        }
        actions={[
          { href: vendorCta.href, label: vendorCta.label },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      >
        <p>
          {vendorCta.mode === "apply"
            ? "Official applications are open. Acceptance is still subject to review and available space."
            : "Be first in line when official applications launch. We'll use the contact details you share to send application updates."}
        </p>
      </CtaStrip>

      <RelatedLinks
        links={[
          { href: "/sponsors", label: "Sponsors" },
          { href: "/travel", label: "Travel" },
          { href: "/faq", label: "FAQ" },
          { href: "/news", label: "News" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
