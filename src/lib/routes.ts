import { getAllNews } from "@/content/news";
import { absoluteUrl } from "@/lib/site";

/**
 * Public routes included in the sitemap today.
 * Add a page here only after it has real content.
 */
export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/tickets", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/news", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/guests", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/guests/inquiry", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/schedule", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/gaming", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/cosplay", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/vendors", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/vendors/interest", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/travel", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/sponsors", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/sponsors/inquiry", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/volunteer", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/volunteer/interest", changeFrequency: "monthly" as const, priority: 0.4 },
  { path: "/press", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/press/inquiry", changeFrequency: "monthly" as const, priority: 0.4 },
];

/**
 * Deeper topic routes to add only when they have unique content:
 * /gaming/retro-gaming, /gaming/console-tournaments,
 * /gaming/trading-card-games, /gaming/tabletop,
 * /cosplay/contest, /cosplay/rules, /cosplay/meetups,
 * /travel/hotels, /travel/getting-to-emporia, /travel/things-to-do-in-emporia,
 * /guests/[slug], /vendors/[slug]
 */
export const plannedRoutePatterns = [
  "/gaming/retro-gaming",
  "/gaming/console-tournaments",
  "/gaming/trading-card-games",
  "/gaming/tabletop",
  "/cosplay/contest",
  "/cosplay/rules",
  "/cosplay/meetups",
  "/travel/hotels",
  "/travel/getting-to-emporia",
  "/travel/things-to-do-in-emporia",
  "/guests/[slug]",
  "/vendors/[slug]",
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

export async function getDynamicSitemapEntries(): Promise<SitemapEntry[]> {
  return getAllNews().map((article) => ({
    url: absoluteUrl(`/news/${article.slug}`),
    lastModified: article.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}
