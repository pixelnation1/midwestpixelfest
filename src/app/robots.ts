import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { artistApplicationsOpen, vendorApplicationsOpen } from "@/lib/vendors";

export default function robots(): MetadataRoute.Robots {
  const applicationsClosed = !vendorApplicationsOpen && !artistApplicationsOpen;
  const disallow = [
    ...(applicationsClosed ? ["/vendors/apply"] : []),
    "/sponsors/commitment",
    "/sponsors/assets",
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      ...(disallow.length > 0 ? { disallow } : {}),
    },
    sitemap: `${site.siteUrl}/sitemap.xml`,
    host: site.siteUrl,
  };
}
