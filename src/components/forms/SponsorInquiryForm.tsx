"use client";

import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function SponsorInquiryForm() {
  return (
    <InquiryForm
      kind="sponsor_inquiry"
      submitLabel="Send Sponsor Inquiry"
      successTitle="Your interest has been received"
    >
      <TextInput
        id="sponsor-company"
        name="company"
        label="Company / Organization"
        required
        autoComplete="organization"
        maxLength={FIELD_LIMITS.medium}
      />
      <TextInput
        id="sponsor-contact"
        name="contactName"
        label="Contact Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="sponsor-email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
      />
      <TextInput
        id="sponsor-phone"
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        maxLength={FIELD_LIMITS.phone}
      />
      <TextInput
        id="sponsor-website"
        name="website"
        label="Website"
        type="text"
        autoComplete="url"
        maxLength={FIELD_LIMITS.url}
      />
      <TextInput
        id="sponsor-org-type"
        name="orgType"
        label="Type of organization"
        maxLength={FIELD_LIMITS.short}
      />
      <Select
        id="sponsor-partnership"
        name="partnership"
        label="What kind of partnership are you interested in?"
        required
        options={formOptionLists.partnershipTypes}
      />
      <TextInput
        id="sponsor-budget"
        name="budget"
        label="Budget notes"
        hint="Optional. A range or general note is enough — we are not asking for an exact amount."
        maxLength={FIELD_LIMITS.medium}
      />
      <TextArea
        id="sponsor-notes"
        name="notes"
        label="Notes"
        rows={5}
        maxLength={FIELD_LIMITS.message}
      />
      <ConsentCheckbox />
    </InquiryForm>
  );
}
