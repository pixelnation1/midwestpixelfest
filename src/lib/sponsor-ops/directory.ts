import { getPublishedSponsors } from "@/lib/sponsorships";
import { isActiveStatus, type SponsorshipStatus } from "@/lib/sponsor-ops/status";
import type { PublicSponsorCard, SponsorDirectoryProfile, SponsorshipRecord } from "@/lib/sponsor-ops/types";

export const SPONSOR_DIRECTORY_GROUPS: ReadonlyArray<{
  id: string;
  label: string;
  packageIds: readonly string[];
}> = [
  { id: "presenting", label: "Presenting Sponsors", packageIds: ["presenting"] },
  { id: "gold", label: "Gold Sponsors", packageIds: ["gold"] },
  { id: "silver", label: "Silver Sponsors", packageIds: ["silver"] },
  { id: "bronze", label: "Bronze Sponsors", packageIds: ["bronze"] },
  { id: "community", label: "Community Sponsors", packageIds: ["community"] },
  { id: "custom", label: "Event Sponsors", packageIds: ["custom"] },
];

export function isEligibleForSponsorPublication(input: {
  status: SponsorshipStatus;
  publicDirectoryEnabled: boolean;
}): boolean {
  return isActiveStatus(input.status) && input.publicDirectoryEnabled;
}

export function publicSponsorFields(
  profile: SponsorDirectoryProfile,
): PublicSponsorCard | null {
  if (!profile.publishInDirectory) return null;
  return {
    displayName: profile.displayName,
    levelLabel: profile.levelLabel,
    packageId: profile.packageId,
    logo: profile.logo,
    website: profile.website,
    publicDescription: profile.publicDescription,
    publicSocialUrl: profile.publicSocialUrl,
    sponsoredArea: profile.sponsoredArea,
    featured: profile.featured,
    sortOrder: profile.sortOrder,
  };
}

export function emptyDirectoryProfile(
  displayName: string,
  packageId = "",
  levelLabel = "",
): SponsorDirectoryProfile {
  return {
    publishInDirectory: false,
    displayName,
    levelLabel,
    packageId,
    logo: null,
    website: null,
    publicDescription: null,
    publicSocialUrl: null,
    sponsoredArea: null,
    featured: false,
    sortOrder: 0,
  };
}

/**
 * Public cards from confirmed config plus any future persistence adapter.
 * confirmedSponsors is empty until real partners are published.
 */
export function getPublicSponsorCards(): PublicSponsorCard[] {
  return getPublishedSponsors().map((sponsor, index) => ({
    displayName: sponsor.name,
    levelLabel: sponsor.tier,
    packageId: "",
    logo: sponsor.logo,
    website: sponsor.website,
    publicDescription: sponsor.description || null,
    publicSocialUrl: null,
    sponsoredArea: null,
    featured: sponsor.featured,
    sortOrder: index,
  }));
}

export function groupPublicSponsors(
  cards: readonly PublicSponsorCard[],
): Array<{ id: string; label: string; sponsors: PublicSponsorCard[] }> {
  const sorted = [...cards].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
  return SPONSOR_DIRECTORY_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    sponsors: sorted.filter((card) => group.packageIds.includes(card.packageId)),
  })).filter((group) => group.sponsors.length > 0);
}

export function publicationCardFromRecord(
  record: SponsorshipRecord,
): PublicSponsorCard | null {
  if (!isEligibleForSponsorPublication(record)) return null;
  return publicSponsorFields({
    ...record.directory,
    publishInDirectory: record.publicDirectoryEnabled && record.directory.publishInDirectory,
  });
}
