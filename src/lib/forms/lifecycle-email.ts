import "server-only";

import { Resend } from "resend";
import {
  getFormFromAddress,
  getResendApiKey,
  isResendConfigured,
  isSafeReplyTo,
} from "@/lib/forms/mail-config";
import type { DeliveryResult } from "@/lib/forms/types";

function hasHeaderBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

export type LifecycleEmailPayload = {
  kind: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Shared Resend send path for emails to an applicant or sponsor.
 * From is never taken from user input. Does not log recipient or body.
 */
export async function sendLifecycleEmail(input: {
  to: string;
  email: LifecycleEmailPayload;
  logName: string;
}): Promise<DeliveryResult> {
  if (!isResendConfigured()) {
    return { ok: false, code: "not_configured" };
  }

  const apiKey = getResendApiKey();
  const from = getFormFromAddress();
  const to = input.to.trim();

  if (!apiKey || !from || !isSafeReplyTo(to) || hasHeaderBreak(input.email.subject)) {
    return { ok: false, code: "not_configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: input.email.subject,
      html: input.email.html,
      text: input.email.text,
    });

    if (error) {
      const errorName =
        typeof error === "object" && error && "name" in error && typeof error.name === "string"
          ? error.name
          : "unknown";
      console.error(input.logName, {
        provider: "resend",
        kind: input.email.kind,
        name: errorName,
      });
      return { ok: false, code: "delivery_failed" };
    }

    return { ok: true };
  } catch {
    console.error(input.logName, {
      provider: "resend",
      kind: input.email.kind,
      name: "network_or_sdk",
    });
    return { ok: false, code: "delivery_failed" };
  }
}
