import "server-only";

import {
  DEFAULT_FORM_FROM_EMAIL,
  DEFAULT_NOTIFICATION_EMAIL,
} from "@/lib/forms/mail-addresses";
import { validateEmail } from "@/lib/forms/validate";

function hasHeaderBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

/** Accepts a bare address or `Name <address@domain>`. */
export function isValidFromAddress(value: string): boolean {
  if (hasHeaderBreak(value)) return false;
  const trimmed = value.trim();
  const named = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  const address = named ? named[2].trim() : trimmed;
  return validateEmail(address) === null;
}

export function isSafeReplyTo(value: string): boolean {
  if (hasHeaderBreak(value)) return false;
  return validateEmail(value) === null;
}

export function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || null;
}

/**
 * Verified From address. Optional FORM_FROM_EMAIL override, otherwise
 * the centralized midwestpixelfest.com website sender.
 */
export function getFormFromAddress(): string | null {
  const override = process.env.FORM_FROM_EMAIL?.trim();
  const value = override || DEFAULT_FORM_FROM_EMAIL;
  if (!isValidFromAddress(value)) {
    console.error("form_from_email_invalid");
    return null;
  }
  return value;
}

/**
 * Ops inbox. Optional CONTACT_NOTIFICATION_EMAIL override, otherwise
 * hello@midwestpixelfest.com.
 */
export function getNotificationToAddress(): string | null {
  const override = process.env.CONTACT_NOTIFICATION_EMAIL?.trim();
  const value = override || DEFAULT_NOTIFICATION_EMAIL;
  if (hasHeaderBreak(value) || validateEmail(value) !== null) {
    console.error("contact_notification_email_invalid");
    return null;
  }
  return value;
}

/** True when Resend can send (API key + valid From). */
export function isResendConfigured(): boolean {
  return Boolean(getResendApiKey() && getFormFromAddress());
}

/** True when operational form notifications can go through Resend. */
export function isOperationalResendConfigured(): boolean {
  return isResendConfigured() && Boolean(getNotificationToAddress());
}

/**
 * When Resend is configured, the webhook is not used unless this is set.
 * Accepts true / 1 / yes.
 */
export function shouldSendFormWebhookWithResend(): boolean {
  const raw = process.env.FORM_WEBHOOK_WITH_RESEND?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}
