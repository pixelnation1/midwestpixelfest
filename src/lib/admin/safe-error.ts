export function publicErrorMessage(fallback: string, error?: { message?: string } | null): string {
  if (!error?.message) return fallback;
  const message = error.message.toLowerCase();
  if (message.includes("fetch") || message.includes("network") || message.includes("failed to connect")) {
    return "The organizer database is unavailable. Try again in a few minutes.";
  }
  if (message.includes("jwt") || message.includes("session") || message.includes("auth")) {
    return "Your session expired. Sign in again.";
  }
  return fallback;
}

const INFRASTRUCTURE_ERROR =
  /unavailable|permission denied|row-level|rls|postgres|supabase|stack|syntax error/i;

export function organizerActionError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  const mapped = publicErrorMessage(fallback, error);
  if (mapped !== fallback) return mapped;
  if (INFRASTRUCTURE_ERROR.test(error.message)) return fallback;
  return error.message;
}
