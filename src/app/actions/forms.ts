"use server";

import { createApplicationReference } from "@/lib/forms/vendor-application";
import { deliverSubmission, isFormDeliveryConfigured } from "@/lib/forms/deliver";
import { DEFAULT_NOTIFICATION_EMAIL } from "@/lib/forms/mail-addresses";
import {
  errorState,
  parseAndValidate,
  successState,
} from "@/lib/forms/parse";
import { checkFormRateLimit } from "@/lib/forms/rate-limit";
import type { FormState } from "@/lib/forms/validate";
import { readString } from "@/lib/forms/validate";

const SUCCESS_COPY: Record<string, string> = {
  newsletter: "You're on the list. We'll share official Midwest Pixel Fest updates as they land.",
  contact: "Your message has been received. We'll reply as planning allows.",
  vendor_interest:
    "Your vendor interest has been received. We'll share official application details when they open — this is not an application or a booth offer.",
  vendor_application:
    "Thank you for applying to Midwest Pixel Fest 2027. Your application has been received for review. Submission does not guarantee acceptance. If approved, you'll receive next-step and payment information separately.",
  sponsor_inquiry:
    "Thanks for your interest in partnering with Midwest Pixel Fest. We'll review your sponsorship inquiry and contact you using the information you provided.",
  volunteer_interest:
    "Your volunteer interest has been received. This is not a shift assignment, and selection is not guaranteed.",
  guest_inquiry:
    "Your inquiry has been received. Submission does not guarantee an invitation or appearance.",
  press_inquiry:
    "Your press inquiry has been received. Official media credentials are not open yet.",
};

const NOT_CONFIGURED_MESSAGE =
  "This form is not connected to a delivery provider yet, so we did not record your submission. Try again after the inquiry inbox is live, or check News for updates.";

const DELIVERY_FAILED_MESSAGE =
  `We couldn't send your submission right now. Please try again or contact ${DEFAULT_NOTIFICATION_EMAIL}.`;

const RATE_LIMITED_MESSAGE =
  "Too many submissions. Please wait a few minutes and try again.";

export async function submitForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseAndValidate(formData);

  if (!parsed.ok) {
    return errorState(parsed.message, parsed.fieldErrors);
  }

  if (parsed.spam) {
    const kind = readString(formData, "kind");
    return successState(SUCCESS_COPY[kind] ?? SUCCESS_COPY.contact);
  }

  const rate = await checkFormRateLimit();
  if (!rate.ok) {
    return errorState(RATE_LIMITED_MESSAGE);
  }

  const kind = parsed.data.kind;

  if (kind === "vendor_application") {
    const reference = createApplicationReference();
    parsed.data.fields.applicationReference = reference;
    parsed.data.fields.applicationStatus = "submitted";
  }

  if (!isFormDeliveryConfigured(kind)) {
    return errorState(NOT_CONFIGURED_MESSAGE);
  }

  const result = await deliverSubmission({
    kind,
    submittedAt: new Date().toISOString(),
    fields: parsed.data.fields,
  });

  if (!result.ok) {
    if (result.code === "not_configured") {
      return errorState(NOT_CONFIGURED_MESSAGE);
    }
    return errorState(DELIVERY_FAILED_MESSAGE);
  }

  if (kind === "vendor_application") {
    const reference = parsed.data.fields.applicationReference;
    const referenceText =
      typeof reference === "string" && reference
        ? ` Application reference: ${reference}.`
        : "";
    return successState(`${SUCCESS_COPY.vendor_application}${referenceText}`);
  }

  return successState(SUCCESS_COPY[kind] ?? SUCCESS_COPY.contact);
}
