/**
 * Central vendor / Artist Alley configuration for Midwest Pixel Fest.
 *
 * Application-open flags, CTAs, category copy, FAQs, and the future
 * vendor directory all read this file. Do not duplicate those flags in
 * components. Do not invent booth prices, attendance, or food-vendor
 * opportunities here.
 */

export const vendorApplicationsOpen = false;
export const artistApplicationsOpen = false;
export const vendorApplicationUrl: string | null = null;
export const vendorPricingPublished = false;

export type VendorCtaMode = "interest" | "apply";

export type VendorPrimaryCta = {
  href: string;
  label: string;
  mode: VendorCtaMode;
  external: boolean;
};

export function getVendorPrimaryCta(): VendorPrimaryCta {
  if (vendorApplicationsOpen && vendorApplicationUrl) {
    return {
      href: vendorApplicationUrl,
      label: "Apply Now",
      mode: "apply",
      external: /^https?:/i.test(vendorApplicationUrl),
    };
  }

  return {
    href: "/vendors/interest",
    label: "Register Vendor Interest",
    mode: "interest",
    external: false,
  };
}

export function vendorApplicationsAreOpen(): boolean {
  return vendorApplicationsOpen && Boolean(vendorApplicationUrl);
}

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
  "Games",
  "Cards",
  "Collectibles",
  "Tabletop products",
  "Apparel",
  "Accessories",
  "Gaming merchandise",
  "Pop-culture merchandise",
  "Retail inventory",
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
    body: "Tell us about your business or creative work now so we can reach you when official applications launch.",
  },
  {
    step: "02",
    title: "Applications open",
    body: "Interested vendors and artists are notified when the official application launches.",
  },
  {
    step: "03",
    title: "Apply",
    body: "Submit the full vendor or artist application and the information requested at that time.",
  },
  {
    step: "04",
    title: "Review",
    body: "Midwest Pixel Fest reviews applications for event fit and available space.",
  },
  {
    step: "05",
    title: "Acceptance",
    body: "Approved applicants receive next-step information. Applying does not automatically guarantee acceptance.",
  },
  {
    step: "06",
    title: "Payment & event details",
    body: "Approved vendors receive payment instructions and applicable setup and event information.",
  },
] as const;

export const vendorDetailsComing = [
  "Booth and table sizes",
  "Pricing",
  "Tables, chairs, and power",
  "Load-in and setup times",
  "Show rules",
  "Tax requirements",
  "Insurance requirements, if applicable",
  "Application deadlines",
  "Cancellation and refund policy",
  "Badge and admission information",
  "Booth sharing rules",
  "Display requirements",
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

export function getPublishedVendors(): ConfirmedVendor[] {
  return confirmedVendors.filter((vendor) => vendor.published);
}

export const vendorFaqs = [
  {
    question: "When do vendor applications open?",
    answer:
      "Applications for Midwest Pixel Fest 2027 are being prepared. Official dates will be announced when the application launches.",
  },
  {
    question: "How do I know when applications open?",
    answer:
      "Register vendor interest and we will notify you when official applications launch.",
  },
  {
    question: "Does registering interest guarantee a booth?",
    answer:
      "No. Registering interest does not guarantee acceptance, reserve a booth, require payment, or create a contract.",
  },
  {
    question: "What's the difference between Vendor Hall and Artist Alley?",
    answer:
      "Vendor Hall is best suited for businesses selling products such as games, cards, collectibles, tabletop products, apparel, accessories, gaming merchandise, and pop-culture merchandise. Artist Alley is best suited for creators selling primarily their own work, such as original artwork, prints, comics, zines, crafts, handmade goods, commissions, and creator merchandise. If you are not sure which fits, register interest and choose the closest option. Final placement can be determined during the application process.",
  },
  {
    question: "How much will booths cost?",
    answer:
      "Final pricing will be published with the official vendor application.",
  },
  {
    question: "What booth sizes will be available?",
    answer:
      "Booth and table sizes will be published with the official vendor application.",
  },
  {
    question: "Will tables and chairs be included?",
    answer:
      "That policy is still being finalized and will be included in the vendor packet.",
  },
  {
    question: "Will electricity be available?",
    answer:
      "Power details will be published with the official vendor application.",
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
      "Booth sharing rules will be published with official applications.",
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
      "Badge and admission information for vendors will be published with official applications.",
  },
] as const;
