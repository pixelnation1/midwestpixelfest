import "server-only";

import {
  getNotificationToAddress,
  isOperationalResendConfigured,
  shouldSendFormWebhookWithResend,
} from "@/lib/forms/mail-config";
import { sendOperationalEmail } from "@/lib/forms/email";
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
  return isOperationalResendConfigured() || isFormWebhookConfigured();
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
        notify: getNotificationToAddress(),
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
 * Operational forms: Resend when configured. FORM_WEBHOOK_URL is a fallback
 * when Resend is not configured, or an extra channel only when
 * FORM_WEBHOOK_WITH_RESEND is explicitly set.
 *
 * If Resend is configured, success requires Resend to accept the send.
 * Do not log payload field contents.
 */
export async function deliverSubmission(
  payload: DeliveryPayload,
): Promise<DeliveryResult> {
  if (payload.kind === "newsletter") {
    return deliverNewsletterSignup(payload);
  }

  const resendReady = isOperationalResendConfigured();
  const webhookReady = isFormWebhookConfigured();

  if (!resendReady && !webhookReady) {
    return { ok: false, code: "not_configured" };
  }

  if (resendReady) {
    const emailResult = await sendOperationalEmail(payload);
    if (webhookReady && shouldSendFormWebhookWithResend()) {
      const webhookResult = await postFormWebhook(payload);
      if (!webhookResult.ok) {
        console.error("form_webhook_alongside_resend_failed", {
          kind: payload.kind,
          code: webhookResult.code,
        });
      }
    }
    return emailResult;
  }

  return postFormWebhook(payload);
}
