import type { OfficialApplicationType } from "@/lib/vendor-application";

export type { OfficialApplicationType };

/**
 * Central vendor / Artist Alley configuration for Midwest Pixel Fest.
 *
 * Application-open flags, CTAs, pricing, FAQs, and the future vendor
 * directory all read this file. Do not duplicate prices or flags in
 * components. Do not invent electricity prices, attendance, or
 * food-vendor opportunities. Do not add vendor fees to Event ticket schema.
 */

export const vendorApplicationsOpen = false;
export const artistApplicationsOpen = false;
export const vendorApplicationUrl: string | null = null;
export const artistApplicationUrl: string | null = null;
export const vendorPricingPublished = true;

/** Official application routes. Public CTAs must not use these while applications are closed. */
export const officialApplyHubPath = "/vendors/apply";
export const officialVendorApplyPath = "/vendors/apply/vendor";
export const officialArtistApplyPath = "/vendors/apply/artist";

/** Informational Founding Vendor deadline. Do not auto-open applications or payments from this date. */
export const foundingVendorDeadline = "2027-04-30";

/** Calendar days after an acceptance offer is issued for the vendor to pay. */
export const vendorPaymentWindowDays = 7;

/** Future reminder offsets. No scheduler is configured yet. */
export const vendorPaymentReminderDaysBeforeDue = [3, 1] as const;

export const vendorAgreementVersion = "2027-v1";

export const vendorPoliciesPath = "/vendors/policies";

/**
 * Paid-space cancellation refund schedule.
 * Eligibility uses the America/Chicago calendar date the request is received.
 * Event-cancellation / postponement policy is not defined here.
 */
export const vendorRefundPolicy = {
  timezone: "America/Chicago",
  tier1End: "2027-07-31",
  tier1Percent: 75,
  tier2Start: "2027-08-01",
  tier2End: "2027-09-15",
  tier2Percent: 50,
  afterPercent: 0,
  processingFeeLanguage:
    "Payment-processing fees that are not returned to Midwest Pixel Fest may be deducted from any applicable refund.",
  eventCancellationPolicyStatus: "pending_review" as const,
} as const;

export const vendorCancellationSelfService = false;

/**
 * Future payment is organizer-issued after acceptance.
 * Do not enable public self-service booth checkout from this config.
 * Square Invoices are the planned method; the Square API is not integrated.
 */
export const vendorPayment = {
  checkoutOpen: false,
  publicSelfService: false,
  method: "invoice" as "invoice" | "payment_link" | null,
  provider: "square" as const,
  automation: false,
};

export const vendorPricing = {
  artistAlley: {
    regular: 100,
    founding: 75,
  },
  standard10x10: {
    regular: 200,
    founding: 175,
  },
  corner10x10: {
    regular: 250,
    founding: 225,
  },
  double10x20: {
    regular: 375,
    founding: 350,
  },
  premiumDoubleCorner10x20: {
    regular: 450,
    founding: null,
  },
  extraBadge: 20,
  extraTable: 20,
  electricity: null,
} as const;

export type VendorCtaMode = "interest" | "apply";

export type VendorPrimaryCta = {
  href: string;
  label: string;
  mode: VendorCtaMode;
  external: boolean;
};

function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href);
}

function interestCta(): VendorPrimaryCta {
  return {
    href: "/vendors/interest",
    label: "Register Vendor Interest",
    mode: "interest",
    external: false,
  };
}

export function getVendorHallApplyCta(): VendorPrimaryCta {
  if (!vendorApplicationsOpen) return interestCta();
  const href = vendorApplicationUrl ?? officialVendorApplyPath;
  return {
    href,
    label: "Apply for Vendor Hall",
    mode: "apply",
    external: isExternalHref(href),
  };
}

export function getArtistAlleyApplyCta(): VendorPrimaryCta {
  if (!artistApplicationsOpen) return interestCta();
  const href = artistApplicationUrl ?? officialArtistApplyPath;
  return {
    href,
    label: "Apply for Artist Alley",
    mode: "apply",
    external: isExternalHref(href),
  };
}

/**
 * Page-level CTA. While both flags are false this stays Register Vendor Interest.
 * When a flag is turned on, the matching official apply route is used unless an
 * external URL override is set.
 */
export function getVendorPrimaryCta(): VendorPrimaryCta {
  const vendor = getVendorHallApplyCta();
  const artist = getArtistAlleyApplyCta();
  if (vendor.mode === "apply" && artist.mode === "apply") {
    return {
      href: officialApplyHubPath,
      label: "Apply for Vendor Hall or Artist Alley",
      mode: "apply",
      external: false,
    };
  }
  if (vendor.mode === "apply") return vendor;
  if (artist.mode === "apply") return artist;
  return interestCta();
}

/** CTAs for recruitment surfaces. Closed: interest only. Open: hall and/or alley apply. */
export function getVendorRecruitmentCtas(): VendorPrimaryCta[] {
  if (!vendorApplicationsOpen && !artistApplicationsOpen) {
    return [interestCta()];
  }
  const ctas: VendorPrimaryCta[] = [];
  if (vendorApplicationsOpen) ctas.push(getVendorHallApplyCta());
  if (artistApplicationsOpen) ctas.push(getArtistAlleyApplyCta());
  return ctas;
}

export function vendorApplicationsAreOpen(): boolean {
  return vendorApplicationsOpen || artistApplicationsOpen;
}

export function vendorHallApplicationsAreOpen(): boolean {
  return vendorApplicationsOpen;
}

export function artistAlleyApplicationsAreOpen(): boolean {
  return artistApplicationsOpen;
}

export function vendorApplicationStatusLabel(): string {
  return vendorApplicationsAreOpen()
    ? "Applications open"
    : "Applications opening later";
}

export function formatVendorPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatVendorPriceOrTba(amount: number | null): string {
  return amount == null ? "Pricing TBA" : formatVendorPrice(amount);
}

export function formatVendorCalendarDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Display-only label for the configured deadline. Does not change pricing or CTAs. */
export function foundingVendorDeadlineLabel(): string {
  return formatVendorCalendarDate(foundingVendorDeadline);
}

export type VendorSpaceId =
  | "artistAlley"
  | "standard10x10"
  | "corner10x10"
  | "double10x20"
  | "premiumDoubleCorner10x20";

export type VendorSpace = {
  id: VendorSpaceId;
  name: string;
  dimensions: string | null;
  regular: number;
  founding: number | null;
  description: string;
  inclusions: readonly string[];
};

export const vendorSpaces: readonly VendorSpace[] = [
  {
    id: "artistAlley",
    name: "Artist Alley Table",
    dimensions: null,
    regular: vendorPricing.artistAlley.regular,
    founding: vendorPricing.artistAlley.founding,
    description:
      "For artists and creators primarily selling their own original work, such as artwork, prints, comics, zines, handmade goods, crafts, commissions, and creator merchandise. Resale-heavy retail is not an automatic fit for Artist Alley.",
    inclusions: [
      "Weekend space for Midwest Pixel Fest 2027",
      "Up to 2 vendor/artist credentials",
    ],
  },
  {
    id: "standard10x10",
    name: "Standard Vendor Booth",
    dimensions: "10×10",
    regular: vendorPricing.standard10x10.regular,
    founding: vendorPricing.standard10x10.founding,
    description:
      "For game retailers, TCG sellers, collectibles dealers, tabletop vendors, merchandise sellers, and similar businesses.",
    inclusions: [
      "10×10 vendor space",
      "Up to 2 vendor credentials",
    ],
  },
  {
    id: "corner10x10",
    name: "Corner Vendor Booth",
    dimensions: "10×10",
    regular: vendorPricing.corner10x10.regular,
    founding: vendorPricing.corner10x10.founding,
    description:
      "10×10 Vendor Hall space with corner or end placement, subject to availability during application review.",
    inclusions: [
      "10×10 vendor space",
      "Corner/end placement",
      "Up to 2 vendor credentials",
    ],
  },
  {
    id: "double10x20",
    name: "Double Vendor Booth",
    dimensions: "10×20",
    regular: vendorPricing.double10x20.regular,
    founding: vendorPricing.double10x20.founding,
    description:
      "Larger Vendor Hall footprint for businesses that need more display or inventory space.",
    inclusions: [
      "10×20 vendor space",
      "Up to 4 vendor credentials",
    ],
  },
  {
    id: "premiumDoubleCorner10x20",
    name: "Premium Double Corner",
    dimensions: "10×20",
    regular: vendorPricing.premiumDoubleCorner10x20.regular,
    founding: vendorPricing.premiumDoubleCorner10x20.founding,
    description:
      "10×20 Vendor Hall space with premium corner or end placement. No Founding Vendor Rate is assigned to this space.",
    inclusions: [
      "10×20 vendor space",
      "Premium corner/end placement",
      "Up to 4 vendor credentials",
    ],
  },
];

export function spacesForApplicationType(
  type: OfficialApplicationType,
): readonly VendorSpace[] {
  if (type === "Artist Alley") {
    return vendorSpaces.filter((space) => space.id === "artistAlley");
  }
  return vendorSpaces.filter((space) => space.id !== "artistAlley");
}

export function formatSpacePriceLine(space: VendorSpace): string {
  if (space.founding != null) {
    return `${formatVendorPrice(space.founding)} Founding Vendor Rate / ${formatVendorPrice(space.regular)} regular`;
  }
  return `${formatVendorPrice(space.regular)} regular`;
}

export function ctaForVendorSpace(space: VendorSpace): VendorPrimaryCta {
  return space.id === "artistAlley"
    ? getArtistAlleyApplyCta()
    : getVendorHallApplyCta();
}

export type VendorAddOn = {
  id: "extraBadge" | "extraTable" | "electricity";
  name: string;
  price: number | null;
  note: string;
};

export const vendorAddOns: readonly VendorAddOn[] = [
  {
    id: "extraBadge",
    name: "Extra Vendor Badge",
    price: vendorPricing.extraBadge,
    note: "Additional vendor/artist credential beyond the number included with the approved space.",
  },
  {
    id: "extraTable",
    name: "Extra Table",
    price: vendorPricing.extraTable,
    note: "Available only if furniture and floor-plan capacity allow. Final table policy is in the vendor packet.",
  },
  {
    id: "electricity",
    name: "Electricity",
    price: vendorPricing.electricity,
    note: "Electrical access and pricing will be announced after the venue and facility requirements are finalized.",
  },
];

export const vendorPacketNote =
  "Tables, chairs, electricity, setup requirements, and final floor-plan specifications will be published with the official vendor packet.";

export const vendorBrowseCategories = [
  {
    title: "Games",
    icon: "joystick" as const,
    examples: "Retro games, consoles, video games",
  },
  {
    title: "Cards",
    icon: "cards" as const,
    examples: "Trading cards, TCG accessories",
  },
  {
    title: "Collectibles",
    icon: "star" as const,
    examples: "Figures, comics, memorabilia",
  },
  {
    title: "Art",
    icon: "mask" as const,
    examples: "Original artwork, prints",
  },
  {
    title: "Apparel",
    icon: "booth" as const,
    examples: "Clothing, convention merch",
  },
  {
    title: "Makers",
    icon: "cartridge" as const,
    examples: "Crafts, handmade goods",
  },
  {
    title: "Pop culture merchandise",
    icon: "cabinet" as const,
    examples: "Gaming and fandom merch",
  },
] as const;

export const vendorFitExamples = [
  "Retro games and consoles",
  "Video games",
  "Trading cards",
  "TCG accessories",
  "Collectibles",
  "Comics",
  "Tabletop games",
  "Board games",
  "RPG products",
  "Original artwork",
  "Prints",
  "Crafts",
  "Handmade goods",
  "Gaming accessories",
  "Apparel",
  "Convention merchandise",
  "Pop-culture merchandise",
  "Independent creators",
] as const;

export const whoThisFloorIsFor = [
  "Collectibles",
  "Gaming and retro",
  "Tabletop",
  "Trading card games",
  "Art and prints",
  "Creators and handmade goods",
  "Pop culture merchandise",
  "Independent makers",
] as const;

export const whyVendPoints = [
  {
    title: "A weekend built around the audience",
    body: "Midwest Pixel Fest is centered around gaming, cosplay, collectibles, TCGs, tabletop, creators, and pop culture — the same communities many convention vendors serve.",
  },
  {
    title: "More than a side room",
    body: "Vendor Hall and Artist Alley are intended to be part of the core event experience, not an afterthought.",
  },
  {
    title: "Two days in Emporia",
    body: "Midwest Pixel Fest 2027 takes place October 16–17 in Emporia, Kansas.",
  },
  {
    title: "Be part of year one",
    body: "Approved vendors and artists will have the opportunity to become part of the inaugural Midwest Pixel Fest.",
  },
] as const;

export const vendorHallFit = [
  "Video games",
  "Retro games",
  "Trading cards",
  "TCG accessories",
  "Collectibles",
  "Tabletop",
  "Board games",
  "RPG products",
  "Gaming accessories",
  "Apparel",
  "Pop-culture merchandise",
  "Retail inventory",
  "Specialty convention merchandise",
] as const;

export const artistAlleyFit = [
  "Original artwork",
  "Prints",
  "Comics",
  "Zines",
  "Crafts",
  "Handmade goods",
  "Commissions",
  "Creator merchandise",
] as const;

export const vendorApplicationSteps = [
  {
    step: "01",
    title: "Register interest",
    body: "Tell us about your business or creative work now so we can reach you when official applications launch. There is no payment at this step.",
  },
  {
    step: "02",
    title: "Applications open",
    body: "Interested vendors and artists are notified when the official application launches. Vendor and Artist Alley applications are free to submit.",
  },
  {
    step: "03",
    title: "Apply",
    body: "Submit the full vendor or artist application and the information requested at that time. There is no application fee.",
  },
  {
    step: "04",
    title: "Review",
    body: "Midwest Pixel Fest reviews applications for event fit and available space. Applying does not automatically guarantee acceptance.",
  },
  {
    step: "05",
    title: "Acceptance",
    body: "Approved applicants receive an acceptance offer and payment instructions. Payment is due within the published calendar-day window after the offer is issued. Approval is not the same as confirmation.",
  },
  {
    step: "06",
    title: "Payment confirms space",
    body: "A vendor is confirmed only after required payment is recorded as received. There is no public self-service booth checkout. Registering interest does not collect payment.",
  },
] as const;

export const vendorDetailsComing = [
  "Tables, chairs, and power",
  "Load-in and setup times",
  "Show rules",
  "Tax requirements",
  "Insurance requirements, if applicable",
  "Application deadlines",
  "Event cancellation / postponement policy (pending review)",
  "Badge pickup and credential logistics",
  "Booth sharing rules",
  "Display requirements",
  "Floor-plan specifications",
] as const;

export const VENDOR_APPLICANT_TYPES = [
  "Vendor",
  "Artist Alley",
  "Not Sure",
] as const;

export type VendorApplicantType = (typeof VENDOR_APPLICANT_TYPES)[number];

export const VENDOR_PRIMARY_CATEGORIES = [
  "Video Games / Retro Gaming",
  "Trading Cards / TCG",
  "Tabletop / Board Games / RPG",
  "Collectibles",
  "Art / Prints",
  "Handmade / Maker",
  "Apparel / Accessories",
  "Pop Culture Merchandise",
  "Other",
] as const;

export type VendorPrimaryCategory = (typeof VENDOR_PRIMARY_CATEGORIES)[number];

export type VendorApplicantAnalyticsId =
  | "vendor"
  | "artist_alley"
  | "not_sure";

export function applicantTypeAnalyticsId(
  value: string,
): VendorApplicantAnalyticsId | null {
  if (value === "Vendor") return "vendor";
  if (value === "Artist Alley") return "artist_alley";
  if (value === "Not Sure") return "not_sure";
  return null;
}

export type ConfirmedVendor = {
  name: string;
  slug: string;
  image: string | null;
  category: string;
  description: string;
  website: string | null;
  social: string | null;
  booth: string | null;
  published: boolean;
};

/** Confirmed, public lineup only. Do not add placeholder company names. */
export const confirmedVendors: ConfirmedVendor[] = [];

/**
 * Public directory entries. Only organizer-published records appear.
 * Future persistence should also require workflow status `confirmed`
 * before `published` can take effect.
 */
export function getPublishedVendors(): ConfirmedVendor[] {
  return confirmedVendors.filter((vendor) => vendor.published);
}

const artistAlley = vendorPricing.artistAlley;
const standard = vendorPricing.standard10x10;

export const vendorFaqs = [
  {
    question: "When do vendor applications open?",
    answer:
      "Official dates will be announced when the application launches. Applications are not open yet. Register interest to receive updates.",
  },
  {
    question: "Are applications open yet?",
    answer:
      "No. Official applications are being prepared. Register vendor interest and we will notify you when applications launch.",
  },
  {
    question: "How do I know when applications open?",
    answer:
      "Register vendor interest and we will notify you when official applications launch.",
  },
  {
    question: "Is there an application fee?",
    answer:
      "No. Vendor and Artist Alley applications are free to submit.",
  },
  {
    question: "Does registering interest guarantee a booth?",
    answer:
      "No. Registering interest does not guarantee acceptance, reserve a booth, require payment, or create a contract.",
  },
  {
    question: "Does applying guarantee a booth?",
    answer:
      "No. Midwest Pixel Fest reviews applications for event fit and available space. Acceptance is not automatic.",
  },
  {
    question: "When do I pay?",
    answer:
      `Approved applicants receive payment instructions after acceptance, typically by Square invoice. Payment is due within ${vendorPaymentWindowDays} calendar days of the offer. A vendor is confirmed only after payment is received. Approval is not confirmation. We do not collect payment during interest registration, and there is no public booth checkout.`,
  },
  {
    question: "What's the difference between Vendor Hall and Artist Alley?",
    answer:
      "Vendor Hall is for businesses selling products such as video games, retro games, trading cards, TCG accessories, collectibles, tabletop, board games, RPG products, gaming accessories, apparel, pop-culture merchandise, retail inventory, and specialty convention merchandise. Artist Alley is intended primarily for creators selling their own work, such as original artwork, prints, comics, zines, crafts, handmade goods, commissions, and creator merchandise. Resale-heavy retailers are not an automatic fit for Artist Alley. If you are not sure which fits, register interest and choose the closest option. Final placement can be determined during the application process.",
  },
  {
    question: "How much is an Artist Alley table?",
    answer: `An Artist Alley table is ${formatVendorPrice(artistAlley.founding)} at the Founding Vendor Rate, and ${formatVendorPrice(artistAlley.regular)} regular. Founding Vendor pricing is planned through ${foundingVendorDeadlineLabel()}, subject to availability. Applications are not open yet.`,
  },
  {
    question: "How much is a standard vendor booth?",
    answer: `A standard 10×10 vendor booth is ${formatVendorPrice(standard.founding)} at the Founding Vendor Rate, and ${formatVendorPrice(standard.regular)} regular. Founding Vendor pricing is planned through ${foundingVendorDeadlineLabel()}, subject to availability. Applications are not open yet.`,
  },
  {
    question: "What is the Founding Vendor Rate?",
    answer: `Founding Vendor Rate is an introductory pricing tier for the inaugural Midwest Pixel Fest marketplace. It is not permanent status, exclusive rights, special placement, a marketing package, or a guaranteed renewal. Founding rates currently apply to Artist Alley, Standard 10×10, Corner 10×10, and Double 10×20 spaces.`,
  },
  {
    question: "When does Founding Vendor pricing end?",
    answer: `Founding Vendor pricing is planned through ${foundingVendorDeadlineLabel()}, subject to availability. If an acceptance offer is issued while Founding Vendor pricing is active, that offer keeps the Founding rate through its payment window even if the Founding deadline passes before payment is due. A later replacement offer uses the pricing in effect when that new offer is issued.`,
  },
  {
    question: "How much will booths cost?",
    answer: `Published Vendor Hall and Artist Alley prices are listed on this page. Artist Alley is ${formatVendorPrice(artistAlley.founding)} founding / ${formatVendorPrice(artistAlley.regular)} regular. A standard 10×10 booth is ${formatVendorPrice(standard.founding)} founding / ${formatVendorPrice(standard.regular)} regular. Corner, double, and premium double-corner options are also listed. Extra vendor badges and extra tables are ${formatVendorPrice(vendorPricing.extraBadge)} each. Electricity pricing is TBA.`,
  },
  {
    question: "What booth sizes will be available?",
    answer:
      "Artist Alley is a table space. Vendor Hall options include 10×10 standard, 10×10 corner, 10×20 double, and 10×20 premium double corner. Final floor-plan placement is determined during application review and published with the vendor packet.",
  },
  {
    question: "Can I purchase multiple booths?",
    answer:
      "Double booth options are planned. Additional configurations may be considered based on space and availability during the application process.",
  },
  {
    question: "Can I purchase a corner?",
    answer:
      "Corner spaces are planned as a separate pricing category and will be subject to availability.",
  },
  {
    question: "Will tables and chairs be included?",
    answer:
      "Final furniture and setup details will be published with the vendor packet.",
  },
  {
    question: "How much is electricity?",
    answer:
      "Electrical availability and pricing have not been finalized and depend on the venue.",
  },
  {
    question: "Will electricity be available?",
    answer:
      "Electrical access and pricing will be announced after the venue and facility requirements are finalized.",
  },
  {
    question: "Can vendors sell trading cards?",
    answer:
      "Trading cards and TCG accessories are among the kinds of products this marketplace is being built around. Acceptance and category placement are determined during the application process.",
  },
  {
    question: "Can vendors sell retro games and consoles?",
    answer:
      "Retro games, consoles, and video games are among the kinds of products this marketplace is being built around. Acceptance is determined during the application process.",
  },
  {
    question: "Can artists take commissions?",
    answer:
      "Commission policies will be included in the vendor packet with official applications. Artists can note commissions when registering interest.",
  },
  {
    question: "Can vendors share booth space?",
    answer:
      "Booth sharing requires approval. Applicants should disclose a proposed sharing arrangement on the official application. Approved vendors may not silently sublet space.",
  },
  {
    question: "When will load-in information be available?",
    answer:
      "Load-in and setup times will be published with official applications.",
  },
  {
    question: "Do vendors need Kansas sales tax registration?",
    answer:
      "Vendors are responsible for complying with applicable Kansas and local tax and licensing requirements. Additional event-specific instructions will be included in the vendor packet where appropriate. This is not individualized legal or tax advice.",
  },
  {
    question: "Are food vendors being accepted?",
    answer: "Food vendor opportunities have not been announced yet.",
  },
  {
    question: "Do vendor booths include admission?",
    answer:
      "Each space includes vendor or artist credentials as listed with that option. Extra vendor badges are available as an add-on. Badge pickup details will be included in the vendor packet.",
  },
  {
    question: "What's the difference between approved and confirmed?",
    answer:
      "Applied means an application was submitted. Approved means Midwest Pixel Fest offered a space. Confirmed means the required payment has been received. Approved-but-unpaid vendors are not listed as confirmed and are not automatically published in the vendor directory.",
  },
  {
    question: "How long do I have to pay after approval?",
    answer: `Payment is due within ${vendorPaymentWindowDays} calendar days after the acceptance offer is issued, unless Midwest Pixel Fest provides a written deadline extension. Space is not confirmed until payment is received.`,
  },
  {
    question: "What is the vendor cancellation and refund policy?",
    answer: `Refund eligibility is based on the date Midwest Pixel Fest receives the cancellation request, using ${vendorRefundPolicy.timezone} calendar dates. Through ${formatVendorCalendarDate(vendorRefundPolicy.tier1End)}, cancellations of paid spaces are eligible for a ${vendorRefundPolicy.tier1Percent}% refund. From ${formatVendorCalendarDate(vendorRefundPolicy.tier2Start)} through ${formatVendorCalendarDate(vendorRefundPolicy.tier2End)}, paid cancellations are eligible for a ${vendorRefundPolicy.tier2Percent}% refund. After ${formatVendorCalendarDate(vendorRefundPolicy.tier2End)}, paid cancellations are not eligible for a refund. ${vendorRefundPolicy.processingFeeLanguage} Contact Midwest Pixel Fest to request cancellation; there is no anonymous self-service cancellation form. An event-cancellation or postponement refund policy has not been published and remains under review.`,
  },
];
