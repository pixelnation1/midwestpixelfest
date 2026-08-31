import type { Metadata } from "next";
import { ContentSection } from "@/components/ui/ContentSection";
import { EmailSignup } from "@/components/home/EmailSignup";
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
      intro="Volunteer opportunities will be announced as planning progresses. There is no application form yet — and we will not collect names we cannot place."
      after={
        <EmailSignup
          eyebrow="Volunteer updates"
          title="Join volunteer updates"
          description="When roles, shifts, and a signup window exist, they will be posted here and sent to this list."
        />
      }
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
          volunteer call. Until that post exists, there is no unofficial signup
          by email or social DM.
        </p>
      </ContentSection>

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
