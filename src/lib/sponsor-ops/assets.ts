import type { SponsorAssetCollection, SponsorLogoFileMeta, SponsorLogoVariantId } from "@/lib/sponsor-ops/types";

export const SPONSOR_LOGO_ALLOWED_MIME_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "application/pdf",
] as const;

export const SPONSOR_LOGO_ALLOWED_EXTENSIONS = ["svg", "png", "jpg", "jpeg", "pdf"] as const;

/** 8 MB. Enforced in organizer uploads to the private sponsor-assets bucket. */
export const SPONSOR_LOGO_MAX_BYTES = 8 * 1024 * 1024;

export const SPONSOR_PUBLIC_DESCRIPTION_MAX = 500;

export const SPONSOR_LOGO_VARIANTS: readonly {
  id: SponsorLogoVariantId;
  label: string;
  required: boolean;
}[] = [
  { id: "primary", label: "Primary logo", required: true },
  { id: "light", label: "Light logo", required: false },
  { id: "dark", label: "Dark logo", required: false },
  { id: "monochrome", label: "Monochrome logo", required: false },
];

/** True when a Supabase project URL is present. Uploads still require the server service role. */
export function isSponsorLogoStorageConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
}

export function isAllowedLogoMimeType(mimeType: string): boolean {
  return (SPONSOR_LOGO_ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function isAllowedLogoFileName(fileName: string): boolean {
  const ext = fileName.trim().toLowerCase().split(".").pop();
  return Boolean(ext && (SPONSOR_LOGO_ALLOWED_EXTENSIONS as readonly string[]).includes(ext));
}

export function isAllowedLogoSize(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= SPONSOR_LOGO_MAX_BYTES;
}

export function validateLogoMeta(meta: Pick<SponsorLogoFileMeta, "fileName" | "mimeType" | "sizeBytes">): string | null {
  if (!isAllowedLogoFileName(meta.fileName)) {
    return "Use an SVG, PNG, JPG, or PDF logo.";
  }
  if (!isAllowedLogoMimeType(meta.mimeType)) {
    return "That file type is not accepted.";
  }
  if (!isAllowedLogoSize(meta.sizeBytes)) {
    return "Logo files must be 8 MB or smaller.";
  }
  return null;
}

export function emptyAssetCollection(): SponsorAssetCollection {
  return {
    status: "not_requested",
    requestedAt: null,
    receivedAt: null,
    approvedAt: null,
    publicBusinessName: null,
    website: null,
    primarySocialUrl: null,
    additionalSocialUrl: null,
    publicDescription: null,
    marketingContactName: null,
    marketingContactEmail: null,
    marketingContactPhone: null,
    preferredPublicUrl: null,
    brandGuidelinesUrl: null,
    logos: [],
    organizerEditedDescription: null,
  };
}

export function requiredAssetsArePresent(assets: SponsorAssetCollection): boolean {
  const hasPrimaryLogo = assets.logos.some((logo) => logo.variant === "primary");
  return Boolean(
    assets.publicBusinessName &&
      assets.website &&
      assets.publicDescription &&
      assets.marketingContactName &&
      assets.marketingContactEmail &&
      assets.preferredPublicUrl &&
      (hasPrimaryLogo || !isSponsorLogoStorageConfigured()),
  );
}
