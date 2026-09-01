import type { VendorApplicationStatus } from "@/lib/vendor-ops/status";
import { isConfirmedStatus } from "@/lib/vendor-ops/status";
import type { VendorDirectoryProfile } from "@/lib/vendor-ops/types";

export function isEligibleForDirectoryPublication(input: {
  status: VendorApplicationStatus;
  publishInDirectory: boolean;
}): boolean {
  return isConfirmedStatus(input.status) && input.publishInDirectory;
}

/**
 * Public directory must never receive private application contact fields.
 * Only organizer-approved display fields belong here.
 */
export function publicDirectoryFields(
  profile: VendorDirectoryProfile,
): Pick<
  VendorDirectoryProfile,
  "displayName" | "category" | "shortDescription" | "logo" | "website" | "socialUrl"
> | null {
  if (!profile.publishInDirectory) return null;
  return {
    displayName: profile.displayName,
    category: profile.category,
    shortDescription: profile.shortDescription,
    logo: profile.logo,
    website: profile.website,
    socialUrl: profile.socialUrl,
  };
}

export function emptyDirectoryProfile(displayName: string): VendorDirectoryProfile {
  return {
    publishInDirectory: false,
    displayName,
    category: "",
    shortDescription: "",
    logo: null,
    website: null,
    socialUrl: null,
  };
}
