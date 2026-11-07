import { getAllNews } from "@/content/news";
import { getAllGuests } from "@/content/guests";
import { absoluteUrl } from "@/lib/site";
import { getPublishedSponsors } from "@/lib/sponsorships";
import { listPublishedVendors } from "@/lib/persistence/directory";
import { listPublicGuestExperiences } from "@/lib/persistence/guest-experiences";

/**
 * Public routes included in the sitemap today.
 * Add a page here only after it has real content.
 */
export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/tickets", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/first-timers-guide", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/attendee-services", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/floor-map", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/info", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/weapons-policy", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/code-of-conduct", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/merch", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/news", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/guests", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/guests/autographs", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/guests/authors", changeFrequency: "weekly" as const, priority: 0.75 },
  { path: "/guests/inquiry", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/schedule", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/panels", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/panels/submit", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/gaming", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/cosplay", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/cosplay/contest", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/cosplay/contest/register", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/vendors", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/exhibitors", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/vendors/interest", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/vendors/policies", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/travel", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/visit-emporia", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/sponsors", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/sponsors/inquiry", changeFrequency: "monthly" as const, priority: 0.6 },
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
  const news = getAllNews().map((article) => ({
    url: absoluteUrl(`/news/${article.slug}`),
    lastModified: article.updatedAt ?? article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guestProfiles = getAllGuests().map((guest) => ({
    url: absoluteUrl(`/guests/${guest.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const publicGuests = (await listPublicGuestExperiences())
    .filter(g => !getAllGuests().some(existing => existing.slug === g.slug))
    .map(g => ({
      url: absoluteUrl("/guests/" + g.slug),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const partnerDirectory =
    getPublishedSponsors().length > 0
      ? [
          {
            url: absoluteUrl("/sponsors/partners"),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : [];

  const exhibitorProfiles = (await listPublishedVendors()).map((vendor) => ({
    url: absoluteUrl("/exhibitors/" + vendor.id),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...news, ...guestProfiles, ...publicGuests, ...partnerDirectory, ...exhibitorProfiles];
}
