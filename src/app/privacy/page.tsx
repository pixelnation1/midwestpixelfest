import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy | Midwest Pixel Fest",
  description:
    "How Midwest Pixel Fest handles information you voluntarily submit for event updates, inquiries, and application communication.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <InnerPage
      path="/privacy"
      breadcrumbLabel="Privacy"
      eyebrow="Policies"
      title="Privacy"
      intro="This page explains, in general terms, how Midwest Pixel Fest uses information you choose to send us. It is not a claim of a specific privacy certification."
    >
      <ContentSection title="Information you submit">
        <p>
          Forms on this website collect information you enter voluntarily —
          typically a name, email address, and details about an inquiry,
          newsletter signup, or interest in vendors, sponsorship, volunteering,
          press, or guest appearances.
        </p>
      </ContentSection>

      <ContentSection title="How we may use it">
        <p>Depending on the form, we may use submitted information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Send event updates you asked for</li>
          <li>Respond to inquiries</li>
          <li>Communicate about applications when those processes open</li>
          <li>Plan operations for Midwest Pixel Fest in {site.location}</li>
        </ul>
      </ContentSection>

      <ContentSection title="Service providers">
        <p>
          We may use service providers to host this website, deliver email, or
          store form submissions. Those providers only receive what they need to
          perform that work.
        </p>
      </ContentSection>

      <ContentSection title="We do not sell personal information">
        <p>
          Midwest Pixel Fest does not sell the personal information you submit
          through these forms.
        </p>
      </ContentSection>

      <ContentSection title="Privacy questions">
        <p>
          For privacy questions, use the{" "}
          <Link href="/contact" className="text-cyan">
            Contact
          </Link>{" "}
          page
          {site.contactEmail ? (
            <>
              {" "}
              or email{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-cyan">
                {site.contactEmail}
              </a>
            </>
          ) : null}
          .
        </p>
      </ContentSection>

      <RelatedLinks
        links={[
          { href: "/contact", label: "Contact" },
          { href: "/faq", label: "FAQ" },
          { href: "/about", label: "About" },
        ]}
      />
    </InnerPage>
  );
}
