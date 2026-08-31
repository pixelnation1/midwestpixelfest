/**
 * Analytics is not installed.
 *
 * When a real measurement ID exists, set NEXT_PUBLIC_GA_MEASUREMENT_ID
 * and mount a provider from `src/app/layout.tsx`. Do not add tracking
 * scripts, fake IDs, or third-party pixels until then.
 */
export const analytics = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? null,
} as const;
