"use client";

import { CheckboxGroup } from "@/components/forms/Checkbox";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function VolunteerInterestForm() {
  return (
    <InquiryForm
      kind="volunteer_interest"
      submitLabel="Register Volunteer Interest"
      successTitle="Your interest has been received"
    >
      <TextInput
        id="volunteer-name"
        name="name"
        label="Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="volunteer-email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
      />
      <Select
        id="volunteer-age"
        name="ageRange"
        label="Age Range"
        required
        options={formOptionLists.ageRanges}
      />
      <CheckboxGroup
        legend="Areas of Interest"
        name="areas"
        options={formOptionLists.volunteerAreas}
      />
      <TextArea
        id="volunteer-availability"
        name="availability"
        label="Availability"
        rows={4}
        hint="Optional. Share general weekend or setup notes if you have them."
        maxLength={FIELD_LIMITS.message}
      />
      <TextArea
        id="volunteer-experience"
        name="experience"
        label="Experience"
        rows={4}
        hint="Optional. Prior convention, event, or related work is welcome — not required."
        maxLength={FIELD_LIMITS.message}
      />
      <ConsentCheckbox />
    </InquiryForm>
  );
}
