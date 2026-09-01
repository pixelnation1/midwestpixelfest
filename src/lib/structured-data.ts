import {
  absoluteUrl,
  event,
  faqs,
  isEventSchemaReady,
  organizer,
  site,
  ticketProducts,
} from "@/lib/site";
import { getPublicTicketUrl } from "@/lib/tickets";

const organizationId = `${site.siteUrl}/#organization`;
const websiteId = `${site.siteUrl}/#website`;
const eventId = `${site.siteUrl}/#event`;

export type JsonLd = Record<string, unknown>;

export function buildOrganizationJsonLd(): JsonLd {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    url: site.siteUrl,
    description: site.description,
    areaServed: {
      "@type": "City",
      name: site.city,
      containedInPlace: {
        "@type": "State",
        name: site.region,
      },
    },
    parentOrganization: {
      "@type": "Organization",
      name: organizer.name,
      url: organizer.url,
    },
  };
}

export function buildWebsiteJsonLd(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: site.siteUrl,
    description: site.description,
    inLanguage: "en-US",
    publisher: {
      "@id": organizationId,
    },
  };
}

export function buildSiteGraphJsonLd(): JsonLd {
  const graph: JsonLd[] = [buildOrganizationJsonLd(), buildWebsiteJsonLd()];
  const eventNode = buildEventJsonLd();
  if (eventNode) {
    graph.push(eventNode);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Event JSON-LD uses city-level location until a venue is named.
 * When the venue is finalized, set event.venue in src/lib/site.ts
 * (name + streetAddress + locality) so this node can become a named Place.
 * Ticket offers are included only when a public checkout URL exists, and only
 * for confirmed products in ticketProducts. Do not invent availability,
 * validFrom, inventory, fees, or quantities.
 */
export function buildEventJsonLd(): JsonLd | null {
  if (!isEventSchemaReady(event)) {
    return null;
  }

  const ticketOfferUrl = getPublicTicketUrl();

  const location = event.venue
    ? {
        "@type": "Place",
        name: event.venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: event.venue.streetAddress ?? undefined,
          addressLocality: event.venue.addressLocality,
          addressRegion: event.venue.addressRegion,
          postalCode: event.venue.postalCode ?? undefined,
          addressCountry: event.venue.addressCountry,
        },
      }
    : {
        "@type": "Place",
        name: site.location,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.regionCode,
          addressCountry: site.country,
        },
      };

  return {
    "@type": "Event",
    "@id": eventId,
    name: event.name,
    description: site.description,
    url: site.siteUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [absoluteUrl(site.ogImagePath)],
    organizer: {
      "@type": "Organization",
      name: organizer.name,
      url: organizer.url,
    },
    location,
    ...(ticketOfferUrl ? { offers: buildTicketOffers(ticketOfferUrl) } : {}),
  };
}

function buildTicketOffers(ticketOfferUrl: string): JsonLd[] {
  return ticketProducts.map((item) => ({
    "@type": "Offer",
    name:
      item.id === "kids"
        ? "Kids 12 & Under — Free with Paid Adult"
        : item.name,
    description:
      item.id === "kids" ? "Free with a paid adult." : item.description,
    price: String(item.price),
    priceCurrency: "USD",
    url: ticketOfferUrl,
  }));
}

export function buildBreadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function buildFaqPageJsonLd(
  items: ReadonlyArray<{ question: string; answer: string }> = faqs,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}): JsonLd {
  const url = absoluteUrl(`/news/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    mainEntityOfPage: url,
    url,
    image: [absoluteUrl(site.ogImagePath)],
    author: {
      "@id": organizationId,
    },
    publisher: {
      "@id": organizationId,
    },
  };
}
