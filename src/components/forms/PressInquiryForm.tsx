"use client";

import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function PressInquiryForm() {
  return (
    <InquiryForm
      kind="press_inquiry"
      submitLabel="Send Press Inquiry"
      successTitle="Your interest has been received"
    >
      <TextInput
        id="press-name"
        name="name"
        label="Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="press-outlet"
        name="outlet"
        label="Outlet / Channel"
        required
        maxLength={FIELD_LIMITS.medium}
      />
      <TextInput
        id="press-email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
      />
      <TextInput
        id="press-website"
        name="website"
        label="Website / Channel URL"
        type="text"
        required
        autoComplete="url"
        maxLength={FIELD_LIMITS.url}
      />
      <Select
        id="press-coverage"
        name="coverageType"
        label="Coverage Type"
        required
        options={formOptionLists.coverageTypes}
      />
      <TextInput
        id="press-audience"
        name="audience"
        label="Audience / Reach"
        hint="Optional. A general sense of audience is enough — we are not asking for audited numbers."
        maxLength={FIELD_LIMITS.medium}
      />
      <TextArea
        id="press-notes"
        name="notes"
        label="Notes"
        rows={5}
        maxLength={FIELD_LIMITS.message}
      />
      <ConsentCheckbox />
    </InquiryForm>
  );
}
