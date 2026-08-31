import {
  absoluteUrl,
  event,
  faqs,
  isEventSchemaReady,
  site,
} from "@/lib/site";

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
      name: site.organizer,
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
 * Event JSON-LD is gated on real startDate, endDate, and venue.name.
 * Set those in `src/lib/site.ts` when they are announced — this will
 * start rendering automatically. Do not invent placeholder dates.
 */
export function buildEventJsonLd(): JsonLd | null {
  if (!isEventSchemaReady(event)) {
    return null;
  }

  return {
    "@type": "Event",
    "@id": eventId,
    name: site.name,
    description: site.description,
    url: site.siteUrl,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [absoluteUrl(site.ogImagePath)],
    organizer: {
      "@type": "Organization",
      name: site.organizer,
    },
    location: {
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
    },
    ...(event.ticketUrl ? { offers: { "@type": "Offer", url: event.ticketUrl } } : {}),
  };
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

export function buildFaqPageJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
