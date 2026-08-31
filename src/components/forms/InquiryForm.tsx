"use client";

import { useActionState, useEffect } from "react";
import { submitForm } from "@/app/actions/forms";
import { FormErrorProvider } from "@/components/forms/FormContext";
import { FormSuccess } from "@/components/forms/FormSuccess";
import { FormStatus } from "@/components/forms/FormStatus";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_EVENTS, trackEvent, type AnalyticsEventName } from "@/lib/analytics";
import type { FormKind } from "@/lib/forms/validate";
import { idleFormState } from "@/lib/forms/validate";

const EVENT_BY_KIND: Record<FormKind, AnalyticsEventName> = {
  newsletter: ANALYTICS_EVENTS.newsletter_signup,
  contact: ANALYTICS_EVENTS.contact_submit,
  vendor_interest: ANALYTICS_EVENTS.vendor_interest_submit,
  sponsor_inquiry: ANALYTICS_EVENTS.sponsor_inquiry_submit,
  volunteer_interest: ANALYTICS_EVENTS.volunteer_interest_submit,
  guest_inquiry: ANALYTICS_EVENTS.guest_inquiry_submit,
  press_inquiry: ANALYTICS_EVENTS.press_inquiry_submit,
};

type InquiryFormProps = {
  kind: FormKind;
  submitLabel: string;
  successTitle: string;
  children: React.ReactNode;
};

export function InquiryForm({
  kind,
  submitLabel,
  successTitle,
  children,
}: InquiryFormProps) {
  const [state, action, pending] = useActionState(submitForm, idleFormState);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent(EVENT_BY_KIND[kind]);
    }
  }, [kind, state.status]);

  if (state.status === "success") {
    return <FormSuccess title={successTitle} message={state.message} />;
  }

  return (
    <FormErrorProvider errors={state.fieldErrors}>
      <form action={action} className="relative space-y-6">
        <input type="hidden" name="kind" value={kind} />
        <HoneypotField />
        <FormStatus status={state.status} message={state.message} />
        {children}
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Sending…" : submitLabel}
        </Button>
      </form>
    </FormErrorProvider>
  );
}
