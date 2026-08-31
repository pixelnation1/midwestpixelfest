import type { FormKind } from "@/lib/forms/validate";

export type DeliveryPayload = {
  kind: FormKind;
  submittedAt: string;
  fields: Record<string, string | string[]>;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; code: "not_configured" | "delivery_failed" };

function webhookUrl(): string | null {
  const value = process.env.FORM_WEBHOOK_URL?.trim();
  if (!value) return null;
  try {
    const parsed = new URL(value);
    const allowHttp = process.env.NODE_ENV !== "production";
    if (parsed.protocol === "https:") return value;
    if (allowHttp && parsed.protocol === "http:") return value;
  } catch {
    return null;
  }
  return null;
}

export function isFormDeliveryConfigured(): boolean {
  return Boolean(webhookUrl());
}

/**
 * Delivers a sanitized submission.
 * Primary path: FORM_WEBHOOK_URL (JSON POST).
 * Wire Mailchimp, Brevo, ConvertKit, Resend, a CRM, or a database behind that webhook.
 * Do not log payload field contents.
 */
export async function deliverSubmission(
  payload: DeliveryPayload,
): Promise<DeliveryResult> {
  const webhook = webhookUrl();

  if (!webhook) {
    return { ok: false, code: "not_configured" };
  }

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
        ...payload,
        notify: process.env.CONTACT_NOTIFICATION_EMAIL ?? null,
      }),
    });

    if (!response.ok) {
      return { ok: false, code: "delivery_failed" };
    }

    return { ok: true };
  } catch {
    return { ok: false, code: "delivery_failed" };
  }
}
