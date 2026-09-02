import "server-only";

import {
  SPONSOR_LOGO_MAX_BYTES,
  isAllowedLogoFileName,
  isAllowedLogoMimeType,
  isAllowedLogoSize,
} from "@/lib/sponsor-ops/assets";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { getSupabaseUrl } from "@/lib/supabase/public-env";

const PRIVATE_BUCKET = "sponsor-assets";
const PUBLIC_BUCKET = "public-sponsor-logos";

const PUBLIC_SAFE_MIME = new Set(["image/png", "image/jpeg"]);

export function isSponsorStorageReady(): boolean {
  return Boolean(createSupabaseServiceClient());
}

export async function uploadSponsorLogo(input: {
  reference: string;
  variant: string;
  file: File;
}): Promise<{ storageKey: string }> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) throw new Error("storage_unavailable");

  const mimeType = input.file.type;
  if (!isAllowedLogoMimeType(mimeType)) {
    throw new Error("invalid_type");
  }
  if (!isAllowedLogoFileName(input.file.name)) {
    throw new Error("invalid_type");
  }
  if (!isAllowedLogoSize(input.file.size) || input.file.size > SPONSOR_LOGO_MAX_BYTES) {
    throw new Error("invalid_size");
  }

  const ext = input.file.name.trim().toLowerCase().split(".").pop() ?? "bin";
  const safeRef = input.reference.replaceAll(/[^A-Z0-9-]/gi, "");
  const storageKey = `${safeRef}/${input.variant}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await input.file.arrayBuffer());

  const { error } = await supabase.storage.from(PRIVATE_BUCKET).upload(storageKey, buffer, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw new Error("upload_failed");
  return { storageKey };
}

export async function publishSponsorLogo(storageKey: string): Promise<string | null> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return null;

  const { data: file, error: downloadError } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .download(storageKey);
  if (downloadError || !file) return null;
  if (!PUBLIC_SAFE_MIME.has(file.type) && !/\.(png|jpe?g)$/i.test(storageKey)) {
    return null;
  }

  const publicKey = storageKey.replace(/[^\w./-]/g, "");
  const { error: uploadError } = await supabase.storage.from(PUBLIC_BUCKET).upload(publicKey, file, {
    upsert: true,
    contentType: file.type || "image/png",
  });
  if (uploadError) return null;
  const url = getSupabaseUrl();
  if (!url) return null;
  return `${url}/storage/v1/object/public/${PUBLIC_BUCKET}/${publicKey}`;
}

export async function signedPrivateAssetUrl(storageKey: string): Promise<string | null> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .createSignedUrl(storageKey, 60 * 10);
  if (error) return null;
  return data.signedUrl;
}
