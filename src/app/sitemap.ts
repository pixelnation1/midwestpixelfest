import type { MetadataRoute } from "next";
import { getDynamicSitemapEntries, publicRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const dynamicEntries = await getDynamicSitemapEntries();

  return [...staticEntries, ...dynamicEntries];
}
