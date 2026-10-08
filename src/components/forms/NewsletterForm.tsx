"use client";

import { Checkbox } from "@/components/forms/Checkbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { TextInput } from "@/components/forms/TextInput";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function NewsletterForm() {
  return (
    <InquiryForm
      kind="newsletter"
      submitLabel="Join the List"
      successTitle="Thanks for signing up"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <TextInput
          id="newsletter-email"
          name="email"
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
        />
        <TextInput
          id="newsletter-first-name"
          name="firstName"
          label="First Name"
          autoComplete="given-name"
          maxLength={FIELD_LIMITS.short}
        />
      </div>
      <Checkbox
        id="updatesConsent"
        name="updatesConsent"
        required
        label="I want updates about Midwest Pixel Fest."
      />
      <p className="text-sm text-muted">
        Read our <a href="/privacy" className="underline">Privacy Policy</a> for how we use your information.
      </p>
    </InquiryForm>
  );
}
