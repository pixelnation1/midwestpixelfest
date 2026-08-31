import "server-only";

import { isResendConfigured, sendOperationalEmail } from "@/lib/forms/email";
import {
  deliverNewsletterSignup,
  isNewsletterConfigured,
} from "@/lib/forms/newsletter";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import type { FormKind } from "@/lib/forms/validate";
import type { DeliveryPayload, DeliveryResult } from "@/lib/forms/types";

export type { DeliveryPayload, DeliveryResult };

function formWebhookUrl(): string | null {
  const parsed = parseAllowedHttpUrl(process.env.FORM_WEBHOOK_URL);
  return parsed ? parsed.toString() : null;
}

export function isFormWebhookConfigured(): boolean {
  return Boolean(formWebhookUrl());
}

export function isFormDeliveryConfigured(kind: FormKind): boolean {
  if (kind === "newsletter") return isNewsletterConfigured();
  return isResendConfigured() || isFormWebhookConfigured();
}

async function postFormWebhook(payload: DeliveryPayload): Promise<DeliveryResult> {
  const webhook = formWebhookUrl();
  if (!webhook) return { ok: false, code: "not_configured" };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.EMAIL_PROVIDER_API_KEY
          ? { Authorization: `Bearer ${process.env.EMAIL_PROVIDER_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        kind: payload.kind,
        submittedAt: payload.submittedAt,
        fields: payload.fields,
        notify: process.env.CONTACT_NOTIFICATION_EMAIL ?? null,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      console.error("form_webhook_failed", { status: response.status, kind: payload.kind });
      return { ok: false, code: "delivery_failed" };
    }

    return { ok: true };
  } catch {
    console.error("form_webhook_failed", { kind: payload.kind });
    return { ok: false, code: "delivery_failed" };
  }
}

/**
 * Delivers a sanitized submission.
 *
 * Newsletter: NEWSLETTER_WEBHOOK_URL only (never the ops inbox).
 * Operational forms: Resend when configured, plus optional FORM_WEBHOOK_URL.
 * Success if at least one configured channel succeeds.
 * Do not log payload field contents.
 */
export async function deliverSubmission(
  payload: DeliveryPayload,
): Promise<DeliveryResult> {
  if (payload.kind === "newsletter") {
    return deliverNewsletterSignup(payload);
  }

  const resendReady = isResendConfigured();
  const webhookReady = isFormWebhookConfigured();

  if (!resendReady && !webhookReady) {
    return { ok: false, code: "not_configured" };
  }

  const attempts: Promise<DeliveryResult>[] = [];
  if (resendReady) attempts.push(sendOperationalEmail(payload));
  if (webhookReady) attempts.push(postFormWebhook(payload));

  const results = await Promise.all(attempts);
  if (results.some((result) => result.ok)) return { ok: true };

  if (results.every((result) => !result.ok && result.code === "not_configured")) {
    return { ok: false, code: "not_configured" };
  }

  return { ok: false, code: "delivery_failed" };
}
