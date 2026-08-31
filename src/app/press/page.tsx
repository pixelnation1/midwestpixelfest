import type { Metadata } from "next";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InfoCard } from "@/components/ui/InfoCard";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Press & Media | Midwest Pixel Fest",
  description:
    "Press and media information for Midwest Pixel Fest in Emporia, Kansas. Credential applications and official assets will be released closer to the event.",
  path: "/press",
});

export default function PressPage() {
  return (
    <InnerPage
      path="/press"
      breadcrumbLabel="Press"
      eyebrow="Media"
      title="Press & Media"
      intro="Coverage is welcome. Credential applications, interview desks, and official assets will be released closer to the event — not as a half-built kit. Official media credentials are not open yet."
    >
      <ContentSection title="Press inquiries">
        <p>
          For coverage questions, use the press inquiry form. We will not
          publish a personal inbox on this page.
        </p>
      </ContentSection>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Media credentials">
          <p>
            Badge types, deadlines, and what a credential includes will be
            published with the application. Accreditation standards are not
            invented yet because the programming grid is not locked.
          </p>
        </InfoCard>
        <InfoCard title="Creator coverage">
          <p>
            Independent creators covering the floor will have a path alongside
            traditional press. That process is not open. Watch News and this
            page.
          </p>
        </InfoCard>
        <InfoCard title="Interviews">
          <p>
            Guest and organizer interview requests will be routed once names
            and schedules exist. Do not assume a green room or a guaranteed
            slot until it is on the grid.
          </p>
        </InfoCard>
        <InfoCard title="Official assets">
          <p>
            Logos, photos, and a simple fact sheet will be posted here when they
            are ready for download. Until then, do not scrape the site for
            stand-ins.
          </p>
        </InfoCard>
      </div>

      <CtaStrip
        className="mt-10"
        title="Get in touch"
        actions={[
          {
            href: "/press/inquiry",
            label: "Press Inquiry",
          },
          { href: "/about", label: "About the fest", variant: "secondary" },
          { href: "/sponsors", label: "Sponsors", variant: "secondary" },
        ]}
      >
        <p>
          Use the press inquiry form for coverage questions. A credential form
          will be a separate process closer to the weekend, if we run one.
        </p>
      </CtaStrip>

      <RelatedLinks
        links={[
          { href: "/about", label: "About" },
          { href: "/sponsors", label: "Sponsors" },
          { href: "/news", label: "News" },
          { href: "/guests", label: "Guests" },
        ]}
      />
    </InnerPage>
  );
}
