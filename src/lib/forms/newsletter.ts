import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { isSupabasePersistenceConfigured } from "@/lib/supabase/env";
import { validateEmail } from "@/lib/forms/validate";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import type { DeliveryPayload, DeliveryResult } from "@/lib/forms/types";

export type NewsletterSignup = {
  email: string;
  consent: boolean;
  submittedAt: string;
  firstName?: string;
};

export type NewsletterProviderId = "webhook" | "supabase" | "none";

/**
 * Newsletter list delivery is separate from operational (Resend) email.
 * Do not subscribe newsletter signups to the transactional inbox.
 *
 * Swap or extend getNewsletterProvider() to add Brevo, Mailchimp,
 * ConvertKit, or another CRM later. The server action and
 * form UI do not need to change.
 */
export type NewsletterProvider = {
  id: NewsletterProviderId;
  isConfigured(): boolean;
  subscribe(signup: NewsletterSignup): Promise<DeliveryResult>;
};

function newsletterWebhookUrl(): string | null {
  const parsed = parseAllowedHttpUrl(process.env.NEWSLETTER_WEBHOOK_URL);
  return parsed ? parsed.toString() : null;
}

const webhookProvider: NewsletterProvider = {
  id: "webhook",
  isConfigured() {
    return Boolean(newsletterWebhookUrl());
  },
  async subscribe(signup) {
    const webhook = newsletterWebhookUrl();
    if (!webhook) return { ok: false, code: "not_configured" };

    const body: NewsletterSignup = {
      email: signup.email,
      consent: signup.consent,
      submittedAt: signup.submittedAt,
      ...(signup.firstName ? { firstName: signup.firstName } : {}),
    };

    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(12_000),
      });

      if (!response.ok) {
        console.error("newsletter_delivery_failed", {
          provider: "webhook",
          status: response.status,
        });
        return { ok: false, code: "delivery_failed" };
      }

      return { ok: true };
    } catch {
      console.error("newsletter_delivery_failed", { provider: "webhook" });
      return { ok: false, code: "delivery_failed" };
    }
  },
};

const supabaseProvider: NewsletterProvider = {
  id: "supabase",
  isConfigured: isSupabasePersistenceConfigured,
  async subscribe(signup) {
    const client = createSupabaseServiceClient();
    if (!client) return { ok: false, code: "not_configured" };
    try {
      // Ignore duplicates: never overwrite an unsubscribe or suppression.
      const { error } = await client.from("newsletter_subscribers").upsert({
        email: signup.email,
        first_name: signup.firstName ?? null,
        consent: signup.consent,
        consent_text: "I want updates about Midwest Pixel Fest.",
        consented_at: signup.submittedAt,
        source: "website_newsletter",
        status: "subscribed",
      }, { onConflict: "email", ignoreDuplicates: true })
        .abortSignal(AbortSignal.timeout(12_000));
      if (error) {
        console.error("newsletter_delivery_failed", { provider: "supabase" });
        return { ok: false, code: "delivery_failed" };
      }
      return { ok: true };
    } catch {
      console.error("newsletter_delivery_failed", { provider: "supabase" });
      return { ok: false, code: "delivery_failed" };
    }
  },
};

const noneProvider: NewsletterProvider = {
  id: "none",
  isConfigured() {
    return false;
  },
  async subscribe() {
    return { ok: false, code: "not_configured" };
  },
};

export function getNewsletterProvider(): NewsletterProvider {
  if (webhookProvider.isConfigured()) return webhookProvider;
  if (supabaseProvider.isConfigured()) return supabaseProvider;
  return noneProvider;
}

export function isNewsletterConfigured(): boolean {
  return getNewsletterProvider().isConfigured();
}

export async function deliverNewsletterSignup(
  payload: DeliveryPayload,
): Promise<DeliveryResult> {
  const email = typeof payload.fields.email === "string"
    ? payload.fields.email.trim().toLowerCase() : "";
  if (validateEmail(email) || payload.fields.updatesConsent !== "yes") {
    return { ok: false, code: "delivery_failed" };
  }

  const firstName =
    typeof payload.fields.firstName === "string" && payload.fields.firstName
      ? payload.fields.firstName
      : undefined;

  return getNewsletterProvider().subscribe({
    email,
    consent: payload.fields.updatesConsent === "yes",
    submittedAt: payload.submittedAt,
    firstName,
  });
}
