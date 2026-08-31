/**
 * Parse an http(s) URL from configuration. Rejects javascript:, data:, and
 * other schemes that could become open redirects or injected remote targets.
 * Production requires https. Local development may use http.
 */
export function parseAllowedHttpUrl(value: string | undefined | null): URL | null {
  const raw = value?.trim();
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    const allowHttp = process.env.NODE_ENV !== "production";
    if (parsed.protocol === "https:") return parsed;
    if (allowHttp && parsed.protocol === "http:") return parsed;
  } catch {
    return null;
  }
  return null;
}
