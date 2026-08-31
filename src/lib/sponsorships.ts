/**
 * Central sponsorship configuration for Midwest Pixel Fest.
 *
 * Package names, prices, availability, and featured status live here.
 * Cards, inquiry options, and CTAs all read this file.
 *
 * Exact benefit matrix is NOT finalized. Keep package `benefits` empty until
 * the owner supplies inclusions. Do not invent booth space, naming rights,
 * social posts, signage, tickets, exclusivity, or logo-level promises.
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
  /** When true, inquiry can include an optional proposed amount. */
  customAmount: boolean;
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

export type SponsorshipProcessStep = {
  step: number;
  title: string;
  body: string;
};

export const NOT_SURE_LEVEL = "Not Sure Yet";

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
 * Official levels and prices. Leave `benefits` empty until the owner supplies
 * the matrix. Flip `featured` only when a package should show featuredLabel.
 */
export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    id: "community",
    slug: "community-sponsor",
    name: "Community Sponsor",
    price: 250,
    priceLabel: null,
    shortDescription:
      "A starting place for local and regional businesses that want to support the inaugural Midwest Pixel Fest.",
    description:
      "Community Sponsor is for shops, studios, and organizations that want to be associated with the weekend. Exact recognition is confirmed after a sponsorship is accepted and finalized.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "I'm Interested",
    accent: "lime",
    customAmount: false,
    benefits: [],
  },
  {
    id: "bronze",
    slug: "bronze-sponsor",
    name: "Bronze Sponsor",
    price: 500,
    priceLabel: null,
    shortDescription:
      "A partnership level for businesses that want a clear association with Midwest Pixel Fest.",
    description:
      "Bronze Sponsor is a listed partnership level. What is included is determined by the selected package after acceptance — not by this inquiry.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "I'm Interested",
    accent: "cyan",
    customAmount: false,
    benefits: [],
  },
  {
    id: "silver",
    slug: "silver-sponsor",
    name: "Silver Sponsor",
    price: 1000,
    priceLabel: null,
    shortDescription:
      "A stronger partnership for businesses ready to stand with the inaugural weekend.",
    description:
      "Silver Sponsor is a listed partnership level. Benefits begin after the sponsorship is accepted, payment is received, and required marketing materials are provided.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "I'm Interested",
    accent: "magenta",
    customAmount: false,
    benefits: [],
  },
  {
    id: "gold",
    slug: "gold-sponsor",
    name: "Gold Sponsor",
    price: 2500,
    priceLabel: null,
    shortDescription:
      "A higher partnership level for businesses making a more visible commitment to the event.",
    description:
      "Gold Sponsor is a listed partnership level. Package details are confirmed in writing after Midwest Pixel Fest accepts the sponsorship.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "I'm Interested",
    accent: "gold",
    customAmount: false,
    benefits: [],
  },
  {
    id: "presenting",
    slug: "presenting-sponsor",
    name: "Presenting Sponsor",
    price: 5000,
    priceLabel: "$5,000+",
    shortDescription:
      "The lead partnership level for Midwest Pixel Fest. Built around a conversation after we review your inquiry.",
    description:
      "Presenting Sponsor starts at $5,000+. Specifics are confirmed after review and acceptance. Submitting an inquiry does not reserve this role or create an agreement.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "I'm Interested",
    accent: "magenta",
    customAmount: false,
    benefits: [],
  },
  {
    id: "custom",
    slug: "custom-event-sponsorship",
    name: "Custom / Event Sponsorship",
    price: null,
    priceLabel: "Let's Talk",
    shortDescription:
      "For businesses that want to sponsor a specific part of the weekend or propose an amount that is not one of the listed levels.",
    description:
      "Custom and event-area sponsorships are reviewed individually. Tell us what you have in mind. An inquiry is interest only.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "I'm Interested",
    accent: "cyan",
    customAmount: true,
    benefits: [],
  },
];

/**
 * Hide the public comparison table until the owner supplies real benefits.
 * The comparison component still reads from package benefits when this is true.
 */
export const showBenefitComparison = false;

/** Opportunity / interest categories — not priced packages. */
export const sponsorshipInterestAreas = [
  "General Event Sponsorship",
  "Cosplay",
  "Gaming / Tournaments",
  "Trading Card Games",
  "Kids / Family Activities",
  "Guests / Creators",
  "Other",
] as const;

export type SponsorshipInterestArea = (typeof sponsorshipInterestAreas)[number];

export const OTHER_INTEREST_VALUE: SponsorshipInterestArea = "Other";

export const sponsorshipOpportunities: SponsorshipOpportunity[] = [
  {
    id: "general",
    name: "General Event Sponsorship",
    description:
      "Support the weekend as a whole rather than one programming area.",
  },
  {
    id: "cosplay",
    name: "Cosplay",
    description:
      "For businesses interested in being associated with cosplay programming as those details are published.",
  },
  {
    id: "gaming",
    name: "Gaming / Tournaments",
    description:
      "For businesses interested in play spaces, tournaments, or organized play as formats are locked.",
  },
  {
    id: "tcg",
    name: "Trading Card Games",
    description:
      "For businesses interested in trading-card play and community tables as those programs take shape.",
  },
  {
    id: "kids",
    name: "Kids / Family Activities",
    description:
      "For businesses interested in family-friendly activities once those offerings are confirmed.",
  },
  {
    id: "guests",
    name: "Guests / Creators",
    description:
      "For businesses interested in being associated with guest and creator programming as announcements land.",
  },
];

export const sponsorshipProcessSteps: SponsorshipProcessStep[] = [
  {
    step: 1,
    title: "Choose an opportunity.",
    body: "Review the available sponsorship levels or tell us about a custom partnership.",
  },
  {
    step: 2,
    title: "Submit your interest.",
    body: "Tell us about your business and how you'd like to be involved. The website form is an inquiry, not a sponsorship agreement.",
  },
  {
    step: 3,
    title: "We review the partnership.",
    body: "Sponsorships are subject to acceptance by Midwest Pixel Fest. Submitting the form does not reserve a level.",
  },
  {
    step: 4,
    title: "Finalize sponsorship.",
    body: "Approved sponsors receive sponsorship confirmation and payment instructions. The organizer can send the formal Sponsorship Commitment Form at that stage.",
  },
  {
    step: 5,
    title: "Send marketing materials.",
    body: "Approved sponsors provide their logo and any required promotional materials. Sponsorship benefits begin after the sponsorship is finalized, payment is received, and required materials are provided.",
  },
];

export const sponsorshipPaymentMethods = [
  "Square Invoice — Credit / Debit Card",
  "Square Invoice — ACH / Bank Transfer",
  "Business Check",
  "Other approved arrangements",
] as const;

export const localBusinessExamples = [
  "locally owned businesses",
  "restaurants",
  "hotels",
  "banks / financial institutions",
  "automotive businesses",
  "technology companies",
  "professional services",
  "retailers",
  "entertainment businesses",
  "regional brands",
  "community organizations",
] as const;

export const sponsorshipFaqs: SponsorshipFaq[] = [
  {
    question: "How much does it cost to sponsor Midwest Pixel Fest?",
    answer:
      "Listed levels are Community Sponsor — $250, Bronze Sponsor — $500, Silver Sponsor — $1,000, Gold Sponsor — $2,500, and Presenting Sponsor — $5,000+. Custom / event sponsorship opportunities are also available.",
  },
  {
    question: "How do I become a sponsor?",
    answer:
      "Start with the website inquiry. Midwest Pixel Fest reviews your interest, then — if the partnership is accepted — you receive confirmation and payment instructions. After payment and required marketing materials are received, sponsorship benefits begin. The online form is not the legally operative sponsorship commitment.",
  },
  {
    question: "How can sponsorship be paid?",
    answer:
      "Approved sponsorships may be invoiced through Square for credit/debit card or ACH / bank transfer, or handled by business check or another approved arrangement. This website does not collect card or bank details.",
  },
  {
    question: "Can I sponsor a particular activity?",
    answer:
      "Yes. You can note interest in Cosplay, Gaming / Tournaments, Trading Card Games, Kids / Family Activities, Guests / Creators, general event sponsorship, or another area. Area association is discussed during review and is not automatic.",
  },
  {
    question: "Does submitting the online form guarantee my sponsorship?",
    answer:
      "No. Submitting a sponsorship inquiry does not guarantee acceptance or reserve a sponsorship opportunity. It does not create a sponsorship agreement.",
  },
  {
    question: "Can I create a custom sponsorship?",
    answer:
      "Yes. Choose Custom / Event Sponsorship on the inquiry form and describe what you have in mind. Custom inquiries are reviewed; they are not automatically accepted.",
  },
  {
    question: "When do sponsorship benefits begin?",
    answer:
      "After the sponsorship is accepted and finalized, payment is received, and required marketing materials have been provided. The selected package determines benefits once those are confirmed in writing.",
  },
  {
    question: "Can local businesses participate?",
    answer:
      "Yes. Locally owned businesses, restaurants, hotels, banks, shops, professional services, and community organizations in Emporia and the surrounding region are a core part of who this weekend is for.",
  },
  {
    question: "Can sponsors also become vendors?",
    answer:
      "Possibly, but those are separate processes. Vendor and artist applications run through the Vendors page. A sponsorship inquiry is not a booth application.",
  },
];

/** Empty until real partners are confirmed. Do not add placeholders. */
export const confirmedSponsors: ConfirmedSponsor[] = [];

/** Set to a real PDF path or URL when the prospectus exists. */
export const sponsorshipGuideUrl: string | null = null;

/**
 * Public URL for the official Sponsorship Commitment Form.
 * Keep null unless a real file exists in /public or another confirmed location.
 */
export const sponsorshipCommitmentFormUrl: string | null = null;

/** Future invoice or payment URL. Do not collect cards on this site. */
export const sponsorshipPaymentUrl: string | null = null;

export function getPublishedSponsors() {
  return confirmedSponsors.filter((sponsor) => sponsor.published);
}

export function getPackageById(id: string): SponsorshipPackage | undefined {
  return sponsorshipPackages.find((item) => item.id === id);
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
  return `$${pkg.price.toLocaleString("en-US")}`;
}

/** Label used in the inquiry select. Prices come from the same package config. */
export function packageInquiryLabel(pkg: SponsorshipPackage): string {
  if (pkg.customAmount) return pkg.name;
  return `${pkg.name} — ${packagePriceDisplay(pkg)}`;
}

export function availabilityLabel(status: PackageAvailability): string | null {
  if (status === "sold_out") return "Sold Out";
  if (status === "limited") return "Limited Availability";
  if (status === "contact") return "Custom";
  return null;
}

export function getSponsorshipLevelOptions(): string[] {
  return [
    ...sponsorshipPackages.filter(isPackageSelectable).map(packageInquiryLabel),
    NOT_SURE_LEVEL,
  ];
}

/** @deprecated Use getSponsorshipLevelOptions */
export function getSponsorshipInterestOptions(): string[] {
  return getSponsorshipLevelOptions();
}

export function findPackageByInquiryLabel(label: string): SponsorshipPackage | undefined {
  return sponsorshipPackages.find((item) => packageInquiryLabel(item) === label);
}

export function isCustomSponsorshipSelection(value: string): boolean {
  return findPackageByInquiryLabel(value)?.customAmount === true;
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
  return `/sponsors/inquiry?level=${encodeURIComponent(pkg.id)}`;
}

/**
 * Accepts package id, slug, or a known inquiry label.
 * Never returns untrusted query values.
 */
export function levelFromQuery(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  const lowered = trimmed.toLowerCase();
  const pkg = sponsorshipPackages.find(
    (item) => item.id === lowered || item.slug === lowered || item.id === trimmed || item.slug === trimmed,
  );
  if (pkg && isPackageSelectable(pkg)) return packageInquiryLabel(pkg);
  const options = getSponsorshipLevelOptions();
  if (options.includes(trimmed)) return trimmed;
  return undefined;
}

export function benefitCatalogLabel(id: BenefitId): string {
  return BENEFIT_CATALOG.find((item) => item.id === id)?.label ?? id;
}
