"use client";

import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function GuestInquiryForm() {
  return (
    <InquiryForm
      kind="guest_inquiry"
      submitLabel="Send Guest Inquiry"
      successTitle="Your interest has been received"
    >
      <TextInput
        id="guest-name"
        name="name"
        label="Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="guest-stage"
        name="stageName"
        label="Professional / Stage Name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="guest-email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
      />
      <TextInput
        id="guest-website"
        name="website"
        label="Website"
        type="text"
        autoComplete="url"
        maxLength={FIELD_LIMITS.url}
      />
      <TextInput
        id="guest-social"
        name="social"
        label="Primary Social Link"
        type="text"
        maxLength={FIELD_LIMITS.url}
      />
      <Select
        id="guest-category"
        name="category"
        label="Category"
        required
        options={formOptionLists.guestCategories}
      />
      <TextArea
        id="guest-bio"
        name="bio"
        label="Short Bio"
        rows={5}
        maxLength={FIELD_LIMITS.bio}
      />
      <TextArea
        id="guest-why"
        name="why"
        label="Why are you interested in Midwest Pixel Fest?"
        required
        rows={5}
        maxLength={FIELD_LIMITS.message}
      />
      <TextArea
        id="guest-needs"
        name="needs"
        label="Expected appearance needs / notes"
        rows={4}
        maxLength={FIELD_LIMITS.message}
      />
      <ConsentCheckbox />
    </InquiryForm>
  );
}
