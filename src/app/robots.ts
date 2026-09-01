import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { artistApplicationsOpen, vendorApplicationsOpen } from "@/lib/vendors";

export default function robots(): MetadataRoute.Robots {
  const applicationsClosed = !vendorApplicationsOpen && !artistApplicationsOpen;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      ...(applicationsClosed ? { disallow: ["/vendors/apply"] } : {}),
    },
    sitemap: `${site.siteUrl}/sitemap.xml`,
    host: site.siteUrl,
  };
}
