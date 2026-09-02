import "server-only";

import { sendLifecycleEmail } from "@/lib/forms/lifecycle-email";
import { isResendConfigured } from "@/lib/forms/mail-config";
import type { DeliveryResult } from "@/lib/forms/types";
import type { VendorLifecycleEmail } from "@/lib/vendor-ops/emails";
import type { SponsorLifecycleEmail } from "@/lib/sponsor-ops/emails";

export function isVendorLifecycleEmailConfigured(): boolean {
  return isResendConfigured();
}

export function isSponsorLifecycleEmailConfigured(): boolean {
  return isResendConfigured();
}

export async function sendVendorLifecycleEmail(input: {
  to: string;
  email: VendorLifecycleEmail;
}): Promise<DeliveryResult> {
  return sendLifecycleEmail({
    to: input.to,
    email: input.email,
    logName: "vendor_lifecycle_email_failed",
  });
}

export async function sendSponsorLifecycleEmail(input: {
  to: string;
  email: SponsorLifecycleEmail;
}): Promise<DeliveryResult> {
  return sendLifecycleEmail({
    to: input.to,
    email: input.email,
    logName: "sponsor_lifecycle_email_failed",
  });
}
