import "server-only";

import { Resend } from "resend";
import { isResendConfigured } from "@/lib/forms/email";
import type { DeliveryResult } from "@/lib/forms/types";
import { validateEmail } from "@/lib/forms/validate";
import type { VendorLifecycleEmail } from "@/lib/vendor-ops/emails";

function hasHeaderBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

function isSafeRecipient(value: string): boolean {
  if (hasHeaderBreak(value)) return false;
  return validateEmail(value) === null;
}

export function isVendorLifecycleEmailConfigured(): boolean {
  return isResendConfigured();
}

/**
 * Sends a vendor lifecycle email to the applicant.
 * Does not log the recipient address or email body.
 * Does not pretend success when Resend is not configured.
 */
export async function sendVendorLifecycleEmail(input: {
  to: string;
  email: VendorLifecycleEmail;
}): Promise<DeliveryResult> {
  if (!isVendorLifecycleEmailConfigured()) {
    return { ok: false, code: "not_configured" };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FORM_FROM_EMAIL?.trim();
  const to = input.to.trim();

  if (!apiKey || !from || !isSafeRecipient(to) || hasHeaderBreak(input.email.subject)) {
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
      console.error("vendor_lifecycle_email_failed", {
        provider: "resend",
        kind: input.email.kind,
        name: errorName,
      });
      return { ok: false, code: "delivery_failed" };
    }

    return { ok: true };
  } catch {
    console.error("vendor_lifecycle_email_failed", {
      provider: "resend",
      kind: input.email.kind,
      name: "network_or_sdk",
    });
    return { ok: false, code: "delivery_failed" };
  }
}
