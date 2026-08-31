import "server-only";

import { parseAllowedHttpUrl } from "@/lib/safe-url";
import type { DeliveryPayload, DeliveryResult } from "@/lib/forms/types";

export type NewsletterSignup = {
  email: string;
  consent: boolean;
  submittedAt: string;
  firstName?: string;
};

export type NewsletterProviderId = "webhook" | "none";

/**
 * Newsletter list delivery is separate from operational (Resend) email.
 * Do not subscribe newsletter signups to the transactional inbox.
 *
 * Swap or extend getNewsletterProvider() to add Brevo, Mailchimp,
 * ConvertKit, Supabase, or another CRM later. The server action and
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
  return noneProvider;
}

export function isNewsletterConfigured(): boolean {
  return getNewsletterProvider().isConfigured();
}

export async function deliverNewsletterSignup(
  payload: DeliveryPayload,
): Promise<DeliveryResult> {
  const email = payload.fields.email;
  if (typeof email !== "string" || !email) {
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
