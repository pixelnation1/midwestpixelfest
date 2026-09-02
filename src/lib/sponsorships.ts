/**
 * Central sponsorship configuration for Midwest Pixel Fest.
 *
 * Package names, prices, benefits, availability, and featured status live here.
 * Cards, the comparison table, inquiry options, and CTAs all read this file.
 *
 * Do not duplicate prices in other files. Do not invent attendance, reach,
 * booth sizes, signage dimensions, or guaranteed naming/exclusivity.
 */

export type PackageAvailability = "available" | "limited" | "sold_out" | "contact";

export type AccentTone = "magenta" | "cyan" | "gold" | "lime";

export type BenefitId =
  | "sponsor_page_recognition"
  | "digital_sponsor_recognition"
  | "collective_social_thank_you"
  | "general_event_signage"
  | "dedicated_social_recognition"
  | "digital_event_materials"
  | "promotional_item_giveaway"
  | "event_area_activity_sponsorship"
  | "on_site_brand_activation"
  | "sponsor_activation_space"
  | "premier_placement"
  | "custom_partnership_planning";

export type BenefitStatus =
  | "included"
  | "available"
  | "priority"
  | "custom"
  | "not_included";

export type BenefitDefinition = {
  id: BenefitId;
  label: string;
};

export type PackageBenefit = {
  benefitId: BenefitId;
  status: BenefitStatus;
  /** Clarifying phrase. Required for Available / Priority / Custom cells. */
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
  { id: "sponsor_page_recognition", label: "Sponsor Page Recognition" },
  { id: "digital_sponsor_recognition", label: "Digital Sponsor Recognition" },
  { id: "collective_social_thank_you", label: "Collective Social Thank-You" },
  { id: "general_event_signage", label: "General Event Signage" },
  { id: "dedicated_social_recognition", label: "Dedicated Social Recognition" },
  { id: "digital_event_materials", label: "Digital Event Materials" },
  { id: "promotional_item_giveaway", label: "Promotional Item / Giveaway Opportunity" },
  {
    id: "event_area_activity_sponsorship",
    label: "Event Area / Activity Sponsorship Opportunity",
  },
  { id: "on_site_brand_activation", label: "On-Site Brand Activation" },
  { id: "sponsor_activation_space", label: "Sponsor Activation Space" },
  { id: "premier_placement", label: "Premier Placement" },
  { id: "custom_partnership_planning", label: "Custom Partnership Planning" },
] as const;

export const COMPARISON_STATUS_LABEL: Record<BenefitStatus, string> = {
  included: "Included",
  available: "Available",
  priority: "Priority",
  custom: "Custom",
  not_included: "—",
};

export const comparisonLegend = [
  {
    status: "included" as const,
    label: "Included",
    meaning: "Part of this sponsorship level after the partnership is accepted and finalized.",
  },
  {
    status: "available" as const,
    label: "Available",
    meaning:
      "Eligible or subject to approval and availability. Not guaranteed until Midwest Pixel Fest confirms it in writing.",
  },
  {
    status: "priority" as const,
    label: "Priority",
    meaning:
      "Priority consideration among eligible opportunities. Still subject to venue layout, availability, and approval.",
  },
  {
    status: "custom" as const,
    label: "Custom",
    meaning:
      "May be discussed as part of a customized agreement. Not automatically included.",
  },
  {
    status: "not_included" as const,
    label: "—",
    meaning: "Not part of this sponsorship level.",
  },
] as const;

function benefit(
  benefitId: BenefitId,
  status: BenefitStatus,
  detail?: string,
): PackageBenefit {
  return detail ? { benefitId, status, detail } : { benefitId, status };
}

function withBenefits(
  previous: PackageBenefit[] | null,
  updates: Partial<Record<BenefitId, { status: BenefitStatus; detail?: string }>>,
): PackageBenefit[] {
  const map = new Map((previous ?? []).map((item) => [item.benefitId, item]));
  for (const def of BENEFIT_CATALOG) {
    const update = updates[def.id];
    if (update) {
      map.set(def.id, benefit(def.id, update.status, update.detail));
    } else if (!map.has(def.id)) {
      map.set(def.id, benefit(def.id, "not_included"));
    }
  }
  return BENEFIT_CATALOG.map((def) => map.get(def.id)!);
}

const communityBenefits = withBenefits(null, {
  sponsor_page_recognition: {
    status: "included",
    detail: "Business name/logo listed on the Midwest Pixel Fest sponsor page",
  },
  digital_sponsor_recognition: {
    status: "included",
    detail: "Sponsor recognition on Midwest Pixel Fest digital sponsor materials",
  },
  collective_social_thank_you: {
    status: "included",
    detail: "Inclusion in a collective sponsor thank-you on Midwest Pixel Fest social media",
  },
});

const bronzeBenefits = withBenefits(communityBenefits, {
  sponsor_page_recognition: {
    status: "included",
    detail: "Enhanced logo placement on the Midwest Pixel Fest sponsor page",
  },
  digital_sponsor_recognition: {
    status: "included",
    detail: "Logo inclusion on applicable digital sponsor recognition materials",
  },
  general_event_signage: {
    status: "included",
    detail: "Logo inclusion on applicable general event sponsor signage",
  },
});

const silverBenefits = withBenefits(bronzeBenefits, {
  sponsor_page_recognition: {
    status: "included",
    detail: "More prominent logo placement on the sponsor page",
  },
  dedicated_social_recognition: {
    status: "included",
    detail: "Dedicated sponsor recognition post on Midwest Pixel Fest social media",
  },
  general_event_signage: {
    status: "included",
    detail: "Logo placement on applicable event sponsor signage",
  },
  digital_event_materials: {
    status: "included",
    detail: "Inclusion in applicable digital event materials",
  },
  promotional_item_giveaway: {
    status: "available",
    detail:
      "Opportunity to provide approved promotional items or giveaways for event distribution",
  },
  event_area_activity_sponsorship: {
    status: "available",
    detail:
      "Eligibility to discuss event-area or activity sponsorship. Opportunity does not mean guaranteed availability, and any activity sponsorship must be approved and coordinated by Midwest Pixel Fest.",
  },
});

const goldBenefits = withBenefits(silverBenefits, {
  sponsor_page_recognition: {
    status: "included",
    detail: "High-visibility logo placement on the Midwest Pixel Fest sponsor page",
  },
  general_event_signage: {
    status: "included",
    detail: "Prominent placement on applicable event sponsor signage",
  },
  dedicated_social_recognition: {
    status: "included",
    detail: "Additional dedicated social media sponsor recognition",
  },
  digital_event_materials: {
    status: "included",
    detail: "Featured recognition in applicable digital event materials",
  },
  promotional_item_giveaway: {
    status: "available",
    detail: "Opportunity for approved promotional item/giveaway distribution",
  },
  event_area_activity_sponsorship: {
    status: "available",
    detail:
      "Opportunity to sponsor an approved event area, activity, tournament, contest, or programming element",
  },
  on_site_brand_activation: {
    status: "available",
    detail: "Opportunity for an approved on-site brand activation",
  },
  sponsor_activation_space: {
    status: "available",
    detail:
      "Eligible for sponsor activation space, subject to venue layout, availability, and approval.",
  },
});

const presentingBenefits = withBenefits(goldBenefits, {
  sponsor_page_recognition: {
    status: "included",
    detail: "Highest-level sponsor recognition on the Midwest Pixel Fest website",
  },
  premier_placement: {
    status: "included",
    detail: "Premier logo placement across applicable Midwest Pixel Fest sponsor materials",
  },
  general_event_signage: {
    status: "included",
    detail: "Premier placement on applicable event sponsor signage",
  },
  dedicated_social_recognition: {
    status: "included",
    detail: "Multiple social media sponsor recognition opportunities",
  },
  digital_event_materials: {
    status: "included",
    detail: "Featured recognition in applicable digital event materials",
  },
  on_site_brand_activation: {
    status: "priority",
    detail: "Priority consideration for premium on-site brand activation opportunities",
  },
  event_area_activity_sponsorship: {
    status: "priority",
    detail: "Priority consideration for major event-area or programming sponsorship",
  },
  sponsor_activation_space: {
    status: "available",
    detail: "Premium sponsor activation space when appropriate and available",
  },
  custom_partnership_planning: {
    status: "included",
    detail: "Custom partnership planning with the Midwest Pixel Fest team",
  },
});

/**
 * Official levels and prices. Benefits are the public matrix for cards and
 * the comparison table. Do not copy these prices into other config files.
 */
export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    id: "community",
    slug: "community-sponsor",
    name: "Community Sponsor",
    price: 250,
    priceLabel: null,
    shortDescription:
      "An accessible way for local businesses and community organizations to help bring Midwest Pixel Fest to life.",
    description:
      "Community Sponsor is the local/community supporter level. It provides recognition without dedicated social posts, vendor space, premium signage, naming rights, exclusivity, or custom activations.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "Become a Community Sponsor",
    accent: "lime",
    customAmount: false,
    benefits: communityBenefits,
  },
  {
    id: "bronze",
    slug: "bronze-sponsor",
    name: "Bronze Sponsor",
    price: 500,
    priceLabel: null,
    shortDescription:
      "A stronger recognition level for businesses that want a clearer association with Midwest Pixel Fest.",
    description:
      "Bronze Sponsor includes Community Sponsor recognition plus enhanced logo placement, digital sponsor materials, and applicable general event sponsor signage. It does not include a dedicated social post, vendor booth, premium placement, exclusivity, or naming rights.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "Choose Bronze",
    accent: "cyan",
    customAmount: false,
    benefits: bronzeBenefits,
  },
  {
    id: "silver",
    slug: "silver-sponsor",
    name: "Silver Sponsor",
    price: 1000,
    priceLabel: null,
    shortDescription:
      "Where meaningful promotional exposure begins — recognition plus dedicated social and event-material presence.",
    description:
      "Silver Sponsor is the first level with dedicated social recognition and eligibility to discuss approved giveaways or activity sponsorship. Opportunity does not mean guaranteed availability. Vendor booth space is not automatically included.",
    featured: false,
    featuredLabel: "Most Popular",
    availability: "available",
    ctaLabel: "Choose Silver",
    accent: "magenta",
    customAmount: false,
    benefits: silverBenefits,
  },
  {
    id: "gold",
    slug: "gold-sponsor",
    name: "Gold Sponsor",
    price: 2500,
    priceLabel: null,
    shortDescription:
      "A major event-partner level with high-visibility recognition and eligible activation opportunities.",
    description:
      "Gold Sponsor is a major event partner. Eligible for sponsor activation space, subject to venue layout, availability, and approval. Naming rights and category exclusivity are not automatic at this level. Booth size and placement are not promised until the venue layout is finalized.",
    featured: true,
    featuredLabel: "Major Partner",
    availability: "available",
    ctaLabel: "Explore Gold",
    accent: "gold",
    customAmount: false,
    benefits: goldBenefits,
  },
  {
    id: "presenting",
    slug: "presenting-sponsor",
    name: "Presenting Sponsor",
    price: 5000,
    priceLabel: "$5,000+",
    shortDescription:
      "A premier partnership customized around the sponsor and the event — not a larger version of the same package.",
    description:
      "Presenting Sponsor is a premier partnership planned with the Midwest Pixel Fest team. Select naming, category exclusivity, and branded experience opportunities may be available through customized Presenting Sponsor agreements. They are not automatically included for $5,000.",
    featured: true,
    featuredLabel: "Premier Partnership",
    availability: "available",
    ctaLabel: "Discuss Presenting Sponsorship",
    accent: "magenta",
    customAmount: false,
    benefits: presentingBenefits,
  },
  {
    id: "custom",
    slug: "custom-event-sponsorship",
    name: "Custom / Event Sponsorship",
    price: null,
    priceLabel: "Custom",
    shortDescription:
      "Propose a partnership centered on a particular area of Midwest Pixel Fest. Not every opportunity is available.",
    description:
      "Custom and event-area sponsorships are reviewed individually. Businesses can propose partnerships around programming areas, giveaways, or branded activations. An inquiry is interest only and does not reserve an opportunity.",
    featured: false,
    featuredLabel: "Build Something With Us",
    availability: "available",
    ctaLabel: "Discuss a Custom Sponsorship",
    accent: "cyan",
    customAmount: true,
    benefits: [],
  },
];

/** Public comparison uses this flag and the package benefit matrix above. */
export const showBenefitComparison = true;

/** Opportunity / interest categories — not priced packages. */
export const sponsorshipInterestAreas = [
  "General Event Sponsorship",
  "Cosplay",
  "Gaming / Tournaments",
  "Trading Card Games",
  "Tabletop Gaming",
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
    id: "tabletop",
    name: "Tabletop Gaming",
    description:
      "For businesses interested in tabletop play and related programming as those offerings are confirmed.",
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

export const customPartnershipFocusAreas = [
  "Retro Gaming",
  "Gaming / Tournaments",
  "Trading Card Games",
  "Tabletop Gaming",
  "Cosplay",
  "Kids / Family Activities",
  "Guests / Creators",
  "Community Experiences",
  "Giveaways",
  "Branded Activations",
] as const;

export const presentingNegotiationTopics = [
  "Naming opportunities",
  "Category exclusivity",
  "Branded experiences",
  "Tournament sponsorship",
  "Cosplay sponsorship",
  "TCG sponsorship",
  "Gaming area sponsorship",
  "Family / kids activity sponsorship",
  "Guest / creator sponsorship",
  "Custom promotional activations",
] as const;

export const presentingNegotiationDisclaimer =
  "Select naming, category exclusivity, and branded experience opportunities may be available through customized Presenting Sponsor agreements. They are not automatically included.";

export const sponsorshipProcessSteps: SponsorshipProcessStep[] = [
  {
    step: 1,
    title: "Choose a sponsorship opportunity.",
    body: "Review the listed levels, compare benefits, or tell us about a custom partnership. Choosing a card does not create a contract.",
  },
  {
    step: 2,
    title: "Submit a sponsorship inquiry.",
    body: "Tell us about your business and how you'd like to be involved. The website form is an inquiry, not a sponsorship agreement.",
  },
  {
    step: 3,
    title: "Midwest Pixel Fest reviews the partnership.",
    body: "Sponsorships are subject to acceptance. Submitting the form does not reserve a level or guarantee benefits.",
  },
  {
    step: 4,
    title: "Approved sponsorship is finalized.",
    body: "If the partnership is accepted, Midwest Pixel Fest confirms the sponsorship in writing. The organizer can send the formal Sponsorship Commitment Form at that stage.",
  },
  {
    step: 5,
    title: "Payment instructions / invoice are provided.",
    body: "Approved sponsors receive payment instructions. This website does not collect card or bank details.",
  },
  {
    step: 6,
    title: "Sponsor provides required marketing materials.",
    body: "Approved sponsors provide their logo and any required promotional materials for event and digital recognition.",
  },
  {
    step: 7,
    title: "Sponsorship benefits begin.",
    body: "Benefits begin after the sponsorship is finalized, payment is received, and required marketing materials are provided.",
  },
];

export const sponsorshipPaymentMethods = [
  "Square Invoice — Credit / Debit Card",
  "Square Invoice — ACH / Bank Transfer",
  "Business Check",
  "Other approved arrangements",
] as const;

export const localBusinessExamples = [
  "restaurants",
  "hotels",
  "banks and financial institutions",
  "automotive businesses",
  "technology companies",
  "retailers",
  "professional services",
  "entertainment businesses",
  "community organizations",
  "regional brands",
] as const;

export const whySponsorPoints = [
  {
    title: "Support the Community",
    body: "Help build a new regional gaming and pop-culture event in Emporia.",
  },
  {
    title: "Connect with Fans",
    body: "Put your business in front of communities centered around gaming, cosplay, collectibles, TCGs, tabletop, and pop culture.",
  },
  {
    title: "Become Part of the Experience",
    body: "Higher-level partnerships can create opportunities for branded activities, giveaways, and event-area sponsorship — subject to approval and availability.",
  },
  {
    title: "Support Something Local",
    body: "Give Emporia and the surrounding Midwest another reason to gather, play, create, shop, and connect.",
  },
] as const;

export const sponsorshipFaqs: SponsorshipFaq[] = [
  {
    question: "What sponsorship levels are available?",
    answer:
      "Listed levels are Community Sponsor — $250, Bronze Sponsor — $500, Silver Sponsor — $1,000, Gold Sponsor — $2,500, and Presenting Sponsor — $5,000+. Custom / event sponsorship opportunities can also be discussed.",
  },
  {
    question: "What does a sponsorship include?",
    answer:
      "Each level includes recognition that grows with investment, from sponsor-page listing at Community through premier placement and custom partnership planning at Presenting. The comparison table uses Included, Available, Priority, Custom, and — so conditional opportunities are not presented as guarantees. Exact benefits are confirmed in writing after a sponsorship is accepted.",
  },
  {
    question: "Can I sponsor a specific part of Midwest Pixel Fest?",
    answer:
      "You can note interest in Cosplay, Gaming / Tournaments, Trading Card Games, Tabletop Gaming, Kids / Family Activities, Guests / Creators, general event sponsorship, or another area. Area association is discussed during review. Silver and above may be eligible to discuss event-area or activity sponsorship; availability is not guaranteed and must be approved by Midwest Pixel Fest.",
  },
  {
    question: "Can my business receive exclusivity?",
    answer:
      "Category exclusivity is not automatic at any listed price. Select category exclusivity opportunities may be available through customized higher-level partnerships, typically at the Presenting Sponsor level, and are subject to approval.",
  },
  {
    question: "Can my business have naming rights?",
    answer:
      "Naming rights are not automatically included for any listed level, including Presenting Sponsor at $5,000+. Select naming opportunities may be available through customized higher-level partnerships and are subject to approval.",
  },
  {
    question: "Can sponsors have space at the event?",
    answer:
      "Sponsor activation or vendor space is not included at Community, Bronze, or Silver. Gold sponsors are eligible for sponsor activation space, subject to venue layout, availability, and approval. Presenting Sponsors receive priority consideration for premium activation space when appropriate and available. Specific booth size and placement are not promised until the venue layout is finalized. A sponsorship inquiry is not a vendor booth application.",
  },
  {
    question: "Can I provide giveaways or promotional items?",
    answer:
      "Silver, Gold, and Presenting levels include the opportunity to provide approved promotional items or giveaways for event distribution. Items must be approved and coordinated by Midwest Pixel Fest. Opportunity does not mean guaranteed distribution of every item proposed.",
  },
  {
    question: "Can you create a custom sponsorship package?",
    answer:
      "Yes. Choose Custom / Event Sponsorship and describe the partnership you have in mind — for example a programming area, giveaway, or branded activation. Custom inquiries are reviewed; they are not automatically accepted, and not every opportunity is available.",
  },
  {
    question: "Does submitting an inquiry guarantee sponsorship?",
    answer:
      "No. Submitting a sponsorship inquiry does not guarantee acceptance, reserve a level, or create a sponsorship agreement. Clicking a sponsorship tier also does not create a contract.",
  },
  {
    question: "When do sponsorship benefits begin?",
    answer:
      "After the sponsorship is accepted and finalized, payment is received, and required marketing materials have been provided.",
  },
  {
    question: "How do I become a sponsor?",
    answer:
      "Choose a level or custom opportunity, submit the website inquiry, and wait for Midwest Pixel Fest to review the partnership. If it is accepted, you receive confirmation and payment instructions, then provide required marketing materials. Benefits begin after those steps are complete.",
  },
  {
    question: "How can sponsorship be paid?",
    answer:
      "Approved sponsorships may be invoiced through Square for credit/debit card or ACH / bank transfer, or handled by business check or another approved arrangement. This website does not collect card or bank details.",
  },
  {
    question: "Can local businesses participate?",
    answer:
      "Yes. Restaurants, hotels, banks, automotive businesses, technology companies, retailers, professional services, entertainment businesses, community organizations, and regional brands are examples of businesses that may be a good fit. These are examples of potential partners, not a list of current sponsors.",
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
 * The in-app commitment form stays closed until the contracting entity is confirmed.
 */
export const sponsorshipCommitmentFormUrl: string | null = null;

/** Future invoice or payment URL. Do not collect cards on this site. */
export const sponsorshipPaymentUrl: string | null = null;

export const sponsorshipAgreementVersion = "2027-v1";

/**
 * LEGAL TODO: confirm the contracting entity before any commitment form is
 * used publicly. Public pages currently present PixelNation as organizer.
 * Earlier paperwork used "Midwest PixelFest LLC". Do not invent or silently
 * pick one of those names here.
 */
export const sponsorshipContractingEntityStatus: "pending_legal_review" | "confirmed" =
  "pending_legal_review";
export const sponsorshipContractingEntity: string | null = null;

/** Do not open until sponsorshipContractingEntity is confirmed. */
export const sponsorshipCommitmentOpen = false;

/** Asset collection is organizer-issued after payment. Not a public CTA. */
export const sponsorshipAssetCollectionOpen = false;

/**
 * Future payment is organizer-issued after commitment.
 * Do not enable public self-service sponsorship checkout from this config.
 * Square Invoices are the planned method; the Square API is not integrated.
 */
export const sponsorshipPayment = {
  checkoutOpen: false,
  publicSelfService: false,
  method: "invoice" as "invoice" | "payment_link" | null,
  provider: "square" as const,
  automation: false,
};

/** LEGAL TODO: do not copy the vendor refund schedule onto sponsorships. */
export const sponsorshipRefundPolicyStatus = "pending_review" as const;

/** LEGAL TODO: event cancellation / postponement / force majeure terms. */
export const sponsorshipEventCancellationPolicyStatus = "pending_review" as const;

export const SPONSORSHIP_CUSTOM_BENEFIT_TYPES = [
  "area_sponsorship",
  "tournament_sponsorship",
  "cosplay_sponsorship",
  "branded_giveaway",
  "on_site_activation",
  "custom_signage",
  "premium_placement",
  "category_exclusivity",
  "naming_opportunity",
  "other",
] as const;

export type SponsorshipCustomBenefitType =
  (typeof SPONSORSHIP_CUSTOM_BENEFIT_TYPES)[number];

export const SPONSORSHIP_CUSTOM_BENEFIT_TYPE_LABELS: Record<
  SponsorshipCustomBenefitType,
  string
> = {
  area_sponsorship: "Area sponsorship",
  tournament_sponsorship: "Tournament sponsorship",
  cosplay_sponsorship: "Cosplay sponsorship",
  branded_giveaway: "Branded giveaway",
  on_site_activation: "On-site activation",
  custom_signage: "Custom signage opportunity",
  premium_placement: "Premium placement",
  category_exclusivity: "Category exclusivity",
  naming_opportunity: "Naming opportunity",
  other: "Other custom benefit",
};

export function canUseSponsorshipCommitmentForm(): boolean {
  return (
    sponsorshipCommitmentOpen &&
    sponsorshipContractingEntityStatus === "confirmed" &&
    Boolean(sponsorshipContractingEntity)
  );
}

export function canUseSponsorshipAssetForm(): boolean {
  return sponsorshipAssetCollectionOpen;
}

export function formatSponsorshipAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

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

export type ComparisonStatus = BenefitStatus;

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
  if (!match || match.status === "not_included") {
    return { status: "not_included", label: COMPARISON_STATUS_LABEL.not_included };
  }
  return {
    status: match.status,
    label: COMPARISON_STATUS_LABEL[match.status],
    detail: match.detail,
  };
}

export type VisiblePackageBenefit = PackageBenefit & {
  status: Exclude<BenefitStatus, "not_included">;
};

export function getCardBenefits(pkg: SponsorshipPackage): VisiblePackageBenefit[] {
  return pkg.benefits.filter(
    (item): item is VisiblePackageBenefit => item.status !== "not_included",
  );
}

/** Priced levels only — custom is presented separately, not as a sixth table column. */
export function getComparisonPackages(): SponsorshipPackage[] {
  return sponsorshipPackages.filter((pkg) => !pkg.customAmount);
}

export function getCustomSponsorshipPackage(): SponsorshipPackage | undefined {
  return sponsorshipPackages.find((pkg) => pkg.customAmount);
}

export function getPricedSponsorshipPackages(): SponsorshipPackage[] {
  return getComparisonPackages();
}

/** Comparison rows are derived from package benefits — not a second list. */
export function getComparisonBenefits(): BenefitDefinition[] {
  const used = new Set(
    getComparisonPackages().flatMap((pkg) => pkg.benefits.map((item) => item.benefitId)),
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
    (item) =>
      item.id === lowered ||
      item.slug === lowered ||
      item.id === trimmed ||
      item.slug === trimmed,
  );
  if (pkg && isPackageSelectable(pkg)) return packageInquiryLabel(pkg);
  const options = getSponsorshipLevelOptions();
  if (options.includes(trimmed)) return trimmed;
  return undefined;
}

export function benefitCatalogLabel(id: BenefitId): string {
  return BENEFIT_CATALOG.find((item) => item.id === id)?.label ?? id;
}
