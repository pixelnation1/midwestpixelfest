export const CONTACT_TYPES = [
  "General",
  "Vendor / Artist",
  "Sponsor",
  "Press / Media",
  "Guest / Talent",
  "Volunteer",
  "Other",
] as const;

export const VENDOR_TYPES = [
  "Vendor",
  "Artist",
  "Maker",
  "Creator",
  "TCG / Collectibles",
  "Gaming",
  "Other",
] as const;

export const PARTNERSHIP_TYPES = [
  "Presenting",
  "Gaming",
  "Cosplay",
  "Tournament",
  "Stage / Panel",
  "Community",
  "Travel / Hotel",
  "Local Business",
  "Custom Partnership",
] as const;

export const AGE_RANGES = ["Under 18", "18–20", "21+"] as const;

export const VOLUNTEER_AREAS = [
  "Registration",
  "Gaming",
  "Cosplay",
  "Panels",
  "Vendor Support",
  "Setup",
  "Teardown",
  "General Operations",
] as const;

export const GUEST_CATEGORIES = [
  "Creator",
  "Streamer",
  "Author",
  "Artist",
  "Performer",
  "Voice talent",
  "Industry professional",
  "Community personality",
  "Other",
] as const;

export const COVERAGE_TYPES = [
  "News",
  "Photography",
  "Video",
  "YouTube",
  "Podcast",
  "Livestream",
  "Blog",
  "Other",
] as const;

export const formOptionLists = {
  contactTypes: CONTACT_TYPES,
  vendorTypes: VENDOR_TYPES,
  partnershipTypes: PARTNERSHIP_TYPES,
  ageRanges: AGE_RANGES,
  volunteerAreas: VOLUNTEER_AREAS,
  guestCategories: GUEST_CATEGORIES,
  coverageTypes: COVERAGE_TYPES,
};
