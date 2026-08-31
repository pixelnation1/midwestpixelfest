export type GuestProfile = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  website?: string;
  social?: { label: string; href: string };
};

/**
 * Confirmed guests only. Empty until names are official.
 * Profiles will live at /guests/[slug].
 */
export const guests: GuestProfile[] = [];

export function getAllGuests(): GuestProfile[] {
  return guests;
}

export function getGuestBySlug(slug: string): GuestProfile | undefined {
  return guests.find((guest) => guest.slug === slug);
}

export const guestCategories = [
  "Creators",
  "Artists",
  "Streamers",
  "Authors",
  "Performers",
  "Industry and community personalities",
] as const;
