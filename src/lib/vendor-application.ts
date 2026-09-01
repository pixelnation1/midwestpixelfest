/**
 * Official Vendor Hall / Artist Alley application options and review types.
 *
 * Prices and space definitions stay in vendors.ts. This file is the schema
 * surface for the official application. Persistent storage can map these
 * fields later without changing the public form.
 *
 * Do not auto-reject applicants by category, AI disclosure, original-work
 * percentage, mystery merchandise, food, or duplicate merchandise types.
 */

export type OfficialApplicationType = "Vendor Hall" | "Artist Alley";

export const OFFICIAL_APPLICATION_TYPES = [
  "Vendor Hall",
  "Artist Alley",
] as const satisfies readonly OfficialApplicationType[];

export const VENDOR_APPLICATION_REVIEW_STATUSES = [
  "submitted",
  "under_review",
  "approved",
  "waitlisted",
  "declined",
  "withdrawn",
] as const;

export type VendorApplicationReviewStatus =
  (typeof VENDOR_APPLICATION_REVIEW_STATUSES)[number];

export const YES_NO = ["Yes", "No"] as const;

export const APPLICATION_PRIMARY_CATEGORIES = [
  "Video Games / Retro Gaming",
  "Trading Cards / TCG",
  "Tabletop / Board Games / RPG",
  "Collectibles",
  "Art / Prints",
  "Comics / Zines",
  "Handmade / Maker",
  "Apparel / Accessories",
  "Pop Culture Merchandise",
  "Gaming Accessories",
  "Creator Merchandise",
  "Other",
] as const;

export const MERCHANDISE_MIX_RANGES = [
  "None",
  "1–25%",
  "26–50%",
  "51–75%",
  "76–99%",
  "100%",
  "Unsure",
] as const;

export const ORIGINAL_WORK_PERCENTAGES = [
  "100%",
  "75–99%",
  "50–74%",
  "Less than 50%",
] as const;

export const PRODUCTION_METHODS = [
  "Created directly by me",
  "Created from my designs through a production partner",
  "Both",
  "Other",
] as const;

export const VENDOR_INVENTORY_TYPES = [
  "Video games",
  "Retro games/consoles",
  "TCG sealed products",
  "TCG singles",
  "Board games",
  "RPG products",
  "Collectibles",
  "Comics",
  "Apparel",
  "Accessories",
  "Licensed merchandise",
  "Vintage merchandise",
  "Handmade products",
  "Other",
] as const;

export const DISPLAY_ELEMENTS = [
  "Freestanding racks",
  "Shelving",
  "Gridwall",
  "Banners",
  "TVs / monitors",
  "Lighting",
  "Other electrical equipment",
] as const;

export const ELECTRICAL_DISPLAY_ELEMENTS = [
  "TVs / monitors",
  "Lighting",
  "Other electrical equipment",
] as const;

export const INSURANCE_STATUSES = [
  "Yes",
  "No",
  "Not Applicable / Unsure",
] as const;

export const APPLICATION_COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Ireland",
  "Australia",
  "New Zealand",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Japan",
  "South Korea",
  "Taiwan",
  "Hong Kong",
  "China",
  "Singapore",
  "India",
  "Philippines",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Puerto Rico",
  "South Africa",
  "Other",
] as const;

export const APPLICATION_FORM_SECTIONS = [
  { id: "contact", number: "01", title: "Contact" },
  { id: "business", number: "02", title: "Business" },
  { id: "sell", number: "03", title: "What you sell" },
  { id: "space", number: "04", title: "Space" },
  { id: "setup", number: "05", title: "Booth setup" },
  { id: "compliance", number: "06", title: "Compliance" },
  { id: "agreements", number: "07", title: "Agreements" },
  { id: "signature", number: "08", title: "Signature" },
] as const;

export type VendorApplicationGroups = {
  contact: {
    contactName: string;
    businessName: string;
    email: string;
    phone: string;
    website: string;
    socialPrimary: string;
    socialAdditional: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  business: {
    businessDescription: string;
    yearsActive: string;
    vendedBefore: string;
    priorEvents: string;
  };
  applicationType: OfficialApplicationType;
  merchandise: {
    primaryCategory: string;
    secondaryCategories: string[];
    whatYouSell: string;
    mixOriginal: string;
    mixLicensed: string;
    mixSecondhand: string;
    mixOther: string;
    ownWorkMajority: string;
    ownWorkPercent: string;
    offersCommissions: string;
    productionMethod: string;
    inventoryTypes: string[];
    mysteryMerchandise: string;
    mysteryDescription: string;
  };
  spaceRequest: {
    spaceRequest: string;
    additionalSpace: string;
    additionalSpaceDetails: string;
  };
  addOns: {
    extraBadges: string;
    extraTables: string;
    electricityRequested: string;
  };
  staff: {
    primaryRepName: string;
    additionalRepNames: string;
  };
  display: {
    tallDisplays: string;
    tallDisplayDescription: string;
    displayElements: string[];
    boothSetupNotes: string;
  };
  compliance: {
    aiGenerated: string;
    aiDescription: string;
    sellsFood: string;
    insuranceStatus: string;
    hoursCommitment: string;
    hoursExplanation: string;
  };
  boothSharing: {
    boothSharing: string;
    shareBusinessName: string;
    shareContactName: string;
    shareEmail: string;
    shareDescription: string;
  };
  acknowledgments: Record<string, string>;
  signature: {
    legalName: string;
    signatureBusinessName: string;
    electronicSignature: string;
    signatureDate: string;
  };
};

export function usesElectricalDisplay(values: readonly string[]): boolean {
  return values.some((value) =>
    (ELECTRICAL_DISPLAY_ELEMENTS as readonly string[]).includes(value),
  );
}
