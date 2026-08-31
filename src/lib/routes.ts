/**
 * Public routes included in the sitemap today.
 * Add a page here only after it has real content.
 */
export const publicRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/tickets", changeFrequency: "weekly", priority: 0.9 },
  { path: "/guests", changeFrequency: "weekly", priority: 0.8 },
  { path: "/schedule", changeFrequency: "weekly", priority: 0.8 },
  { path: "/gaming", changeFrequency: "monthly", priority: 0.8 },
  { path: "/cosplay", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vendors", changeFrequency: "monthly", priority: 0.7 },
  { path: "/travel", changeFrequency: "monthly", priority: 0.7 },
  { path: "/sponsors", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
] as const;

/**
 * Planned content architecture. Do not add these to the sitemap
 * until the pages exist and have useful content.
 *
 * /news
 * /news/[slug]
 * /guests/[slug]
 * /vendors/[slug]
 * /gaming/retro-gaming
 * /gaming/console-tournaments
 * /gaming/trading-card-games
 * /gaming/tabletop
 * /cosplay/contest
 * /cosplay/rules
 * /travel/hotels
 * /travel/getting-to-emporia
 * /travel/things-to-do-in-emporia
 * /volunteer
 * /press
 * /about
 */
export const plannedRoutePatterns = [
  "/news",
  "/guests/[slug]",
  "/vendors/[slug]",
  "/gaming/retro-gaming",
  "/gaming/console-tournaments",
  "/gaming/trading-card-games",
  "/gaming/tabletop",
  "/cosplay/contest",
  "/cosplay/rules",
  "/travel/hotels",
  "/travel/getting-to-emporia",
  "/travel/things-to-do-in-emporia",
  "/volunteer",
  "/press",
  "/about",
] as const;

export type SitemapEntry = {
  url: string;
  lastModified?: Date | string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

/**
 * Hook for future CMS/content routes (guest profiles, news, vendors).
 * Return additional sitemap entries here when that content exists.
 */
export async function getDynamicSitemapEntries(): Promise<SitemapEntry[]> {
  return [];
}
