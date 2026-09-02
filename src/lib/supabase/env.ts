import "server-only";

import { getSupabaseUrl } from "@/lib/supabase/public-env";

export { getSupabaseAnonKey, getSupabaseUrl, isSupabaseBrowserConfigured } from "@/lib/supabase/public-env";

function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

/**
 * Service role must never be imported into Client Components.
 */
export function getSupabaseServiceRoleKey(): string | null {
  const key = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!key) return null;
  return key;
}

export function isSupabaseServiceRoleConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

export function isSupabasePersistenceConfigured(): boolean {
  return isSupabaseServiceRoleConfigured();
}
