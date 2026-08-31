import type { Metadata } from "next";
import { ContentSection } from "@/components/ui/ContentSection";
import { CtaStrip } from "@/components/ui/CtaStrip";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Volunteer at Midwest Pixel Fest",
  description:
    "Volunteer at Midwest Pixel Fest in Emporia, Kansas. Opportunities will be announced as planning progresses. Applications are not open yet.",
  path: "/volunteer",
});

const areas = [
  "Attendee support",
  "Registration",
  "Gaming",
  "Cosplay",
  "Panels",
  "Vendor support",
  "Setup",
  "Teardown",
  "Operations",
];

export default function VolunteerPage() {
  return (
    <InnerPage
      path="/volunteer"
      breadcrumbLabel="Volunteer"
      eyebrow="Crew"
      title="Volunteer at Midwest Pixel Fest"
      intro="Volunteer opportunities will be announced as planning progresses. You can register interest now — that is not a shift assignment, and selection is not guaranteed."
    >
      <ContentSection title="What we will need">
        <p>
          A regional convention runs on people who can work a door, a queue, a
          stage, or a teardown night. The list below is the shape of the crew —
          not a promise that every role opens at the same time.
        </p>
      </ContentSection>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((item) => (
          <li
            key={item}
            className="border border-line bg-panel px-4 py-3 font-display uppercase tracking-[0.12em] text-paper"
          >
            {item}
          </li>
        ))}
      </ul>

      <ContentSection title="Applications are not open">
        <p>
          Perks, shift lengths, and age requirements will be published with the
          official volunteer call. Interest registration is not a promise of
          selection. If minors may need guardian approval later, those rules
          will be posted before official applications open.
        </p>
      </ContentSection>

      <CtaStrip
        title="Register volunteer interest"
        actions={[
          { href: "/volunteer/interest", label: "Volunteer Interest" },
          { href: "/contact", label: "Contact", variant: "secondary" },
        ]}
      >
        <p>
          This is pre-registration only. Official shift signup is not live.
        </p>
      </CtaStrip>

      <RelatedLinks
        links={[
          { href: "/about", label: "About" },
          { href: "/faq", label: "FAQ" },
          { href: "/news", label: "News" },
          { href: "/press", label: "Press" },
        ]}
      />
    </InnerPage>
  );
}
