"use server";

import { deliverSubmission, isFormDeliveryConfigured } from "@/lib/forms/deliver";
import {
  errorState,
  parseAndValidate,
  successState,
} from "@/lib/forms/parse";
import type { FormState } from "@/lib/forms/validate";
import { idleFormState } from "@/lib/forms/validate";

const SUCCESS_COPY: Record<string, string> = {
  newsletter: "You're on the list. We'll share official Midwest Pixel Fest updates as they land.",
  contact: "Your message has been received. We'll reply as planning allows.",
  vendor_interest:
    "Your vendor interest has been received. We'll share official application details when they open — this is not an application or a booth offer.",
  sponsor_inquiry:
    "Your sponsorship inquiry has been received. Submitting this form does not create a sponsorship agreement.",
  volunteer_interest:
    "Your volunteer interest has been received. This is not a shift assignment, and selection is not guaranteed.",
  guest_inquiry:
    "Your inquiry has been received. Submission does not guarantee an invitation or appearance.",
  press_inquiry:
    "Your press inquiry has been received. Official media credentials are not open yet.",
};

export async function submitForm(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = parseAndValidate(formData);

  if (!parsed.ok) {
    return errorState(parsed.message, parsed.fieldErrors);
  }

  if (parsed.spam) {
    return successState(SUCCESS_COPY.contact);
  }

  if (!isFormDeliveryConfigured()) {
    return errorState(
      "This form is not connected to a delivery provider yet, so we did not record your submission. Try again after the inquiry inbox is live, or check News for updates.",
    );
  }

  const result = await deliverSubmission({
    kind: parsed.data.kind,
    submittedAt: new Date().toISOString(),
    fields: parsed.data.fields,
  });

  if (!result.ok) {
    if (result.code === "not_configured") {
      return errorState(
        "This form is not connected to a delivery provider yet, so we did not record your submission.",
      );
    }
    return errorState(
      "We couldn't send your submission. Wait a moment and try again.",
    );
  }

  return successState(SUCCESS_COPY[parsed.data.kind] ?? SUCCESS_COPY.contact);
}

export { idleFormState };
