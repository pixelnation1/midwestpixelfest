import type { Metadata } from "next";
import { InnerPage } from "@/components/pages/InnerPage";
import { RelatedLinks } from "@/components/ui/RelatedLinks";
import { VendorPoliciesContent } from "@/components/vendors/VendorPolicies";
import { createPageMetadata } from "@/lib/seo";
import { vendorPoliciesPath } from "@/lib/vendors";

export const metadata: Metadata = createPageMetadata({
  title: "Vendor Policies | Midwest Pixel Fest 2027",
  description:
    "Midwest Pixel Fest 2027 vendor and Artist Alley policies: applications, approval, payment timing, Founding Vendor pricing, cancellation, and confirmation.",
  path: vendorPoliciesPath,
});

export default function VendorPoliciesPage() {
  return (
    <InnerPage
      path={vendorPoliciesPath}
      breadcrumbLabel="Vendor Policies"
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Vendors", path: "/vendors" },
        { name: "Vendor Policies" },
      ]}
      eyebrow="Policies"
      title="Vendor Policies"
      intro="Working vendor and Artist Alley policies for Midwest Pixel Fest 2027. This page is public information, not the final vendor agreement, and it does not open applications or collect payment."
      mood="business"
    >
      <VendorPoliciesContent />
      <RelatedLinks
        links={[
          { href: "/vendors", label: "Vendors" },
          { href: "/vendors/interest", label: "Register Vendor Interest" },
          { href: "/contact", label: "Contact" },
          { href: "/privacy", label: "Privacy" },
        ]}
      />
    </InnerPage>
  );
}
