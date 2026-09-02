import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/public-env";
import { isEligibleForDirectoryPublication } from "@/lib/vendor-ops/directory";
import { publishSponsorLogo } from "@/lib/persistence/storage";
import { isEligibleForSponsorPublication } from "@/lib/sponsor-ops/directory";
import type { PublicSponsorCard } from "@/lib/sponsor-ops/types";
import type { SponsorshipRecord } from "@/lib/sponsor-ops/types";
import type { VendorApplicationStatus } from "@/lib/vendor-ops/status";

function publicClient() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type PublicVendorCard = {
  displayName: string;
  category: string;
  shortDescription: string;
  logo: string | null;
  website: string | null;
  socialUrl: string | null;
  boothLocation: string | null;
};

export async function listPublishedSponsors(): Promise<PublicSponsorCard[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("public_sponsor_listings")
    .select(
      "display_name, level_label, package_id, logo_url, website, public_description, public_social_url, sponsored_area, featured, sort_order",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    displayName: row.display_name,
    levelLabel: row.level_label ?? "",
    packageId: row.package_id ?? "",
    logo: row.logo_url,
    website: row.website,
    publicDescription: row.public_description,
    publicSocialUrl: row.public_social_url,
    sponsoredArea: row.sponsored_area,
    featured: row.featured,
    sortOrder: row.sort_order,
  }));
}

export async function listPublishedVendors(): Promise<PublicVendorCard[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("public_vendor_listings")
    .select(
      "display_name, category, short_description, logo_url, website, social_url, booth_location, sort_order",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    displayName: row.display_name,
    category: row.category ?? "",
    shortDescription: row.short_description ?? "",
    logo: row.logo_url,
    website: row.website,
    socialUrl: row.social_url,
    boothLocation: row.booth_location,
  }));
}

export async function syncPublicSponsorListing(
  supabase: SupabaseClient,
  sponsorshipId: string,
  record: SponsorshipRecord,
): Promise<void> {
  const eligible = isEligibleForSponsorPublication(record);
  let logoUrl: string | null = null;
  if (eligible) {
    const primary = record.assets.logos.find((logo) => logo.variant === "primary" && logo.storageKey);
    if (primary?.storageKey) {
      logoUrl = await publishSponsorLogo(primary.storageKey);
    }
    if (!logoUrl && record.directory.logo?.startsWith("http")) {
      logoUrl = record.directory.logo;
    }
  }
  const { error } = await supabase.from("public_sponsor_listings").upsert(
    {
      sponsorship_id: sponsorshipId,
      display_name: record.directory.displayName,
      level_label: record.directory.levelLabel,
      package_id: record.directory.packageId,
      logo_url: logoUrl,
      website: record.directory.website,
      public_description: record.directory.publicDescription,
      public_social_url: record.directory.publicSocialUrl,
      sponsored_area: record.directory.sponsoredArea,
      featured: record.directory.featured,
      sort_order: record.directory.sortOrder,
      published: eligible,
    },
    { onConflict: "sponsorship_id" },
  );
  if (error) throw new Error("unavailable");
}

export async function syncPublicVendorListing(
  supabase: SupabaseClient,
  applicationId: string,
  input: {
    status: VendorApplicationStatus;
    displayName: string;
    category: string;
    shortDescription: string;
    logo: string | null;
    website: string | null;
    socialUrl: string | null;
    publishInDirectory: boolean;
  },
): Promise<void> {
  const published = isEligibleForDirectoryPublication({
    status: input.status,
    publishInDirectory: input.publishInDirectory,
  });
  const { error } = await supabase.from("public_vendor_listings").upsert(
    {
      application_id: applicationId,
      display_name: input.displayName,
      category: input.category,
      short_description: input.shortDescription,
      logo_url: input.logo,
      website: input.website,
      social_url: input.socialUrl,
      published,
    },
    { onConflict: "application_id" },
  );
  if (error) throw new Error("unavailable");
}
