function readEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function getSupabaseUrl(): string | null {
  return readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

/** Anon / publishable key. Browser-visible by design. Not a secret. */
export function getSupabaseAnonKey(): string | null {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  );
}

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}
