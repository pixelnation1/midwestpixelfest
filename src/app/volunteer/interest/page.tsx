import type { Metadata } from "next";
import { VolunteerInterestForm } from "@/components/forms/VolunteerInterestForm";
import { InnerPage } from "@/components/pages/InnerPage";
import { ContentSection } from "@/components/ui/ContentSection";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Volunteer Interest | Midwest Pixel Fest",
  description:
    "Register volunteer interest for Midwest Pixel Fest in Emporia, Kansas. This is not a shift assignment, and selection is not guaranteed.",
  path: "/volunteer/interest",
});

export default function VolunteerInterestPage() {
  return (
    <InnerPage
      path="/volunteer/interest"
      breadcrumbLabel="Volunteer Interest"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Volunteer", path: "/volunteer" },
        { name: "Volunteer Interest" },
      ]}
      eyebrow="Pre-registration"
      title="Volunteer Interest"
      intro="This is a pre-registration interest form, not an official shift assignment. Submitting it does not promise a role or selection."
    >
      <ContentSection title="Please note">
        <p>
          Final volunteer requirements will be published before official
          applications open. If you are under 18, guardian approval may be
          required later. We will not invent those rules here.
        </p>
      </ContentSection>

      <div className="border border-line bg-panel p-6 sm:p-8">
        <VolunteerInterestForm />
      </div>

      <RelatedLinks
        links={[
          { href: "/volunteer", label: "Volunteer" },
          { href: "/about", label: "About" },
          { href: "/faq", label: "FAQ" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </InnerPage>
  );
}
