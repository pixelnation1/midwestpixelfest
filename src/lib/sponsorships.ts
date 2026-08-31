/**
 * Central sponsorship configuration for Midwest Pixel Fest.
 *
 * Change package names, prices, benefits, availability, and featured status
 * here. Cards, comparison, inquiry options, and CTAs all read this file.
 *
 * Prices stay null until the owner supplies them. Do not invent dollar amounts,
 * attendee counts, impressions, or confirmed partners.
 */

export type PackageAvailability = "available" | "limited" | "sold_out" | "contact";

export type AccentTone = "magenta" | "cyan" | "gold" | "lime";

export type BenefitId =
  | "website_recognition"
  | "directory_listing"
  | "logo_placement"
  | "social_recognition"
  | "event_signage"
  | "program_recognition"
  | "vendor_activation"
  | "gaming_area"
  | "cosplay"
  | "tournament"
  | "stage_panel"
  | "attendee_experience"
  | "naming_rights"
  | "on_site_activation"
  | "promotional_materials"
  | "custom_partnership";

export type BenefitDefinition = {
  id: BenefitId;
  label: string;
};

export type BenefitInclusion = boolean | "custom";

export type PackageBenefit = {
  benefitId: BenefitId;
  included: BenefitInclusion;
  /** Optional detail, e.g. "Website sponsor section". */
  detail?: string;
};

export type SponsorshipPackage = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  priceLabel: string | null;
  shortDescription: string;
  description: string;
  featured: boolean;
  featuredLabel: string;
  availability: PackageAvailability;
  benefits: PackageBenefit[];
  ctaLabel: string;
  accent: AccentTone;
};

export type ConfirmedSponsor = {
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  tier: string;
  description: string;
  featured: boolean;
  published: boolean;
};

export type SponsorshipOpportunity = {
  id: string;
  name: string;
  description: string;
};

export type SponsorshipFaq = {
  question: string;
  answer: string;
};

export const EXTRA_INQUIRY_OPTIONS = ["Custom Partnership", "Not Sure Yet"] as const;

export const BENEFIT_CATALOG: readonly BenefitDefinition[] = [
  { id: "website_recognition", label: "Website Recognition" },
  { id: "directory_listing", label: "Sponsor Directory Listing" },
  { id: "logo_placement", label: "Logo Placement" },
  { id: "social_recognition", label: "Social Media Recognition" },
  { id: "event_signage", label: "Event Signage" },
  { id: "program_recognition", label: "Program Recognition" },
  { id: "vendor_activation", label: "Vendor / Activation Space" },
  { id: "gaming_area", label: "Gaming Area Sponsorship" },
  { id: "cosplay", label: "Cosplay Sponsorship" },
  { id: "tournament", label: "Tournament Sponsorship" },
  { id: "stage_panel", label: "Stage / Panel Sponsorship" },
  { id: "attendee_experience", label: "Attendee Experience Sponsorship" },
  { id: "naming_rights", label: "Naming Rights" },
  { id: "on_site_activation", label: "On-Site Activation" },
  { id: "promotional_materials", label: "Promotional Material Inclusion" },
  { id: "custom_partnership", label: "Custom Partnership Opportunities" },
] as const;

/**
 * Working package structure. Flip `featured` to show the featuredLabel badge.
 * Set `price` / `priceLabel` when the owner supplies amounts.
 */
export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    id: "community",
    slug: "community-partner",
    name: "Community Partner",
    price: null,
    priceLabel: null,
    shortDescription:
      "A starting place for local and regional businesses that want to help launch the inaugural weekend.",
    description:
      "Community Partner is for shops, studios, and organizations that want to be associated with Midwest Pixel Fest without a large activation. Recognition details are confirmed in the sponsorship agreement.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "Inquire about this package",
    accent: "lime",
    benefits: [
      {
        benefitId: "website_recognition",
        included: true,
        detail: "Listing on the Sponsors page once confirmed",
      },
      {
        benefitId: "directory_listing",
        included: true,
        detail: "Included when the partner directory is published",
      },
      {
        benefitId: "social_recognition",
        included: true,
        detail: "Grouped sponsor thank-you when partners are announced",
      },
    ],
  },
  {
    id: "supporting",
    slug: "supporting-sponsor",
    name: "Supporting Sponsor",
    price: null,
    priceLabel: null,
    shortDescription:
      "On-site and digital recognition for businesses that want a clear presence across the weekend.",
    description:
      "Supporting Sponsor adds logo placement and event materials on top of directory listing. Exact placements depend on the floor plan and printed or digital materials we actually produce.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "Inquire about this package",
    accent: "cyan",
    benefits: [
      {
        benefitId: "website_recognition",
        included: true,
        detail: "Sponsors page listing once confirmed",
      },
      {
        benefitId: "directory_listing",
        included: true,
        detail: "Included when the partner directory is published",
      },
      {
        benefitId: "logo_placement",
        included: true,
        detail: "Website sponsor section",
      },
      {
        benefitId: "social_recognition",
        included: true,
        detail: "Sponsor thank-you when partners are announced",
      },
      {
        benefitId: "event_signage",
        included: true,
        detail: "On-site recognition as the floor plan allows",
      },
      {
        benefitId: "program_recognition",
        included: true,
        detail: "Listed in event materials when those are published",
      },
    ],
  },
  {
    id: "featured",
    slug: "featured-sponsor",
    name: "Featured Sponsor",
    price: null,
    priceLabel: null,
    shortDescription:
      "Higher visibility plus room to discuss activations tied to the actual event floor.",
    description:
      "Featured Sponsor is for partners who want stronger recognition and a conversation about on-site presence. Area-specific sponsorships (gaming, cosplay, stage) are discussed separately and are not automatic.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "Inquire about this package",
    accent: "magenta",
    benefits: [
      {
        benefitId: "website_recognition",
        included: true,
        detail: "Prominent Sponsors page listing once confirmed",
      },
      {
        benefitId: "directory_listing",
        included: true,
        detail: "Included when the partner directory is published",
      },
      {
        benefitId: "logo_placement",
        included: true,
        detail: "Website sponsor section",
      },
      {
        benefitId: "social_recognition",
        included: true,
        detail: "Sponsor announcement when partners are announced",
      },
      {
        benefitId: "event_signage",
        included: true,
        detail: "On-site recognition as the floor plan allows",
      },
      {
        benefitId: "program_recognition",
        included: true,
        detail: "Listed in event materials when those are published",
      },
      {
        benefitId: "on_site_activation",
        included: "custom",
        detail: "Discussed with the event team",
      },
      {
        benefitId: "promotional_materials",
        included: "custom",
        detail: "Discussed based on event needs",
      },
      {
        benefitId: "custom_partnership",
        included: "custom",
      },
    ],
  },
  {
    id: "presenting",
    slug: "presenting-sponsor",
    name: "Presenting Sponsor",
    price: null,
    priceLabel: null,
    shortDescription:
      "The lead partnership for the inaugural Midwest Pixel Fest weekend. Built around a conversation, not a menu.",
    description:
      "Presenting Sponsor is a custom lead partnership. Naming, activations, and area association are negotiated in an agreement after review. Submitting an inquiry does not reserve this role.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "contact",
    ctaLabel: "Discuss presenting partnership",
    accent: "gold",
    benefits: [
      {
        benefitId: "website_recognition",
        included: true,
        detail: "Lead recognition on the Sponsors page once confirmed",
      },
      {
        benefitId: "directory_listing",
        included: true,
        detail: "Lead listing when the partner directory is published",
      },
      {
        benefitId: "logo_placement",
        included: true,
        detail: "Prominent website placement; on-site details in the agreement",
      },
      {
        benefitId: "social_recognition",
        included: true,
        detail: "Dedicated sponsor announcement when partners are announced",
      },
      {
        benefitId: "event_signage",
        included: true,
        detail: "Priority on-site recognition as the floor plan allows",
      },
      {
        benefitId: "program_recognition",
        included: true,
        detail: "Lead listing in event materials when those are published",
      },
      {
        benefitId: "naming_rights",
        included: "custom",
        detail: "Discussed in the sponsorship agreement",
      },
      {
        benefitId: "on_site_activation",
        included: "custom",
        detail: "Discussed with the event team",
      },
      {
        benefitId: "vendor_activation",
        included: "custom",
      },
      {
        benefitId: "custom_partnership",
        included: "custom",
      },
    ],
  },
];

/** Opportunity categories — not priced packages and not guaranteed inventory. */
export const sponsorshipOpportunities: SponsorshipOpportunity[] = [
  {
    id: "gaming",
    name: "Gaming",
    description:
      "Association with retro play, console space, tabletop, or free play — shaped around the floor we actually build.",
  },
  {
    id: "cosplay",
    name: "Cosplay",
    description:
      "Support for contest, meetup, or photo-friendly programming once those details are published.",
  },
  {
    id: "tournament",
    name: "Tournament / Organized Play",
    description:
      "Brackets and organized play once formats, titles, and signup rules are locked.",
  },
  {
    id: "stage",
    name: "Stage & Panels",
    description:
      "Stages, screens, and featured conversations as the programming grid comes together.",
  },
  {
    id: "community",
    name: "Community Activities",
    description:
      "Meetups, community tables, and weekend moments that are not a retail booth.",
  },
  {
    id: "attendee",
    name: "Attendee Experiences",
    description:
      "Wayfinding, comfort, and on-site moments that make the weekend easier to attend.",
  },
  {
    id: "areas",
    name: "Event Areas",
    description:
      "Named association with a hall, lounge, or feature area after the venue and floor plan exist.",
  },
  {
    id: "local",
    name: "Local Partnerships",
    description:
      "Emporia and surrounding businesses that want to welcome visitors during the weekend.",
  },
];

export const sponsorshipFaqs: SponsorshipFaq[] = [
  {
    question: "How do I become a Midwest Pixel Fest sponsor?",
    answer:
      "Start with the sponsor inquiry form. The event team reviews interest, follows up using the contact information you provide, and only then moves to an agreement if both sides want to proceed. Submitting the form does not create a sponsorship.",
  },
  {
    question: "What sponsorship opportunities are available?",
    answer:
      "Working package names are Community Partner, Supporting Sponsor, Featured Sponsor, and Presenting Sponsor. We also discuss custom associations with parts of the weekend such as gaming, cosplay, or stage programming. Final inclusions and prices are confirmed in writing after review.",
  },
  {
    question: "Can my business sponsor a specific area or activity?",
    answer:
      "Yes — that is a conversation, not an automatic add-on. Tell us what you want to be associated with on the inquiry form. Area sponsorships depend on the venue, floor plan, and programming that actually exist.",
  },
  {
    question: "Can local businesses participate?",
    answer:
      "Yes. Midwest Pixel Fest is being built in Emporia for a regional audience. Local and regional businesses are a core part of who we want to work with.",
  },
  {
    question: "Are custom sponsorships available?",
    answer:
      "Yes. If a listed package is close but not right, choose Custom Partnership on the inquiry form and describe what you have in mind.",
  },
  {
    question: "Does submitting an inquiry guarantee sponsorship?",
    answer:
      "No. An inquiry is interest only. It does not reserve a package, lock a price, or create an agreement.",
  },
  {
    question: "When is payment due?",
    answer:
      "Payment terms are provided after a sponsorship is approved and finalized. This website does not collect sponsorship payments.",
  },
  {
    question: "Can sponsors also become vendors?",
    answer:
      "Possibly, but those are separate processes. Vendor and artist applications will run through the Vendors page. A sponsorship inquiry is not a booth application.",
  },
  {
    question: "Can businesses provide products or services instead of cash sponsorship?",
    answer:
      "Product, service, or promotional partnerships may be considered depending on event needs. Describe what you can offer on the inquiry form. In-kind details are confirmed only in an agreement.",
  },
  {
    question: "Can sponsors provide giveaway items?",
    answer:
      "Giveaway and promotional items may be considered depending on event needs, venue rules, and logistics. Nothing is automatic. Mention it on the inquiry form if that is part of how you want to participate.",
  },
];

/** Empty until real partners are confirmed. Do not add placeholders. */
export const confirmedSponsors: ConfirmedSponsor[] = [];

/** Set to a real PDF path or URL when the prospectus exists. */
export const sponsorshipGuideUrl: string | null = null;

/** Future invoice or payment URL. Do not collect cards on this site. */
export const sponsorshipPaymentUrl: string | null = null;

export function getPublishedSponsors() {
  return confirmedSponsors.filter((sponsor) => sponsor.published);
}

export function getPackageBySlug(slug: string): SponsorshipPackage | undefined {
  return sponsorshipPackages.find((item) => item.slug === slug);
}

export function isPackageSelectable(pkg: SponsorshipPackage): boolean {
  return pkg.availability !== "sold_out";
}

export function packagePriceDisplay(pkg: SponsorshipPackage): string {
  if (pkg.priceLabel) return pkg.priceLabel;
  if (pkg.price == null) return "Contact Us";
  return `$${pkg.price}`;
}

export function availabilityLabel(status: PackageAvailability): string | null {
  if (status === "sold_out") return "Sold Out";
  if (status === "limited") return "Limited Availability";
  if (status === "contact") return "By Inquiry";
  return null;
}

export function getSponsorshipInterestOptions(): string[] {
  return [
    ...sponsorshipPackages.filter(isPackageSelectable).map((item) => item.name),
    ...EXTRA_INQUIRY_OPTIONS,
  ];
}

export type ComparisonStatus = "included" | "not_included" | "custom";

export type ComparisonCell = {
  status: ComparisonStatus;
  label: string;
  detail?: string;
};

export function getPackageBenefit(
  pkg: SponsorshipPackage,
  benefitId: BenefitId,
): ComparisonCell {
  const match = pkg.benefits.find((item) => item.benefitId === benefitId);
  if (!match || match.included === false) {
    return { status: "not_included", label: "Not included" };
  }
  if (match.included === "custom") {
    return {
      status: "custom",
      label: "Custom / Contact us",
      detail: match.detail,
    };
  }
  return {
    status: "included",
    label: "Included",
    detail: match.detail,
  };
}

/** Comparison rows are derived from package benefits — not a second list. */
export function getComparisonBenefits(): BenefitDefinition[] {
  const used = new Set(
    sponsorshipPackages.flatMap((pkg) => pkg.benefits.map((item) => item.benefitId)),
  );
  return BENEFIT_CATALOG.filter((item) => used.has(item.id));
}

export function inquiryHrefForPackage(pkg: SponsorshipPackage): string {
  return `/sponsors/inquiry?interest=${encodeURIComponent(pkg.slug)}`;
}

export function interestFromQuery(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const bySlug = getPackageBySlug(value);
  if (bySlug && isPackageSelectable(bySlug)) return bySlug.name;
  const options = getSponsorshipInterestOptions();
  if (options.includes(value)) return value;
  return undefined;
}

export function benefitCatalogLabel(id: BenefitId): string {
  return BENEFIT_CATALOG.find((item) => item.id === id)?.label ?? id;
}
