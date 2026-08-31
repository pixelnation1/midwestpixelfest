"use client";

import { Checkbox } from "@/components/forms/Checkbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import { getSponsorshipInterestOptions } from "@/lib/sponsorships";

type SponsorInquiryFormProps = {
  defaultInterest?: string;
};

export function SponsorInquiryForm({ defaultInterest }: SponsorInquiryFormProps) {
  return (
    <InquiryForm
      kind="sponsor_inquiry"
      submitLabel="Send Sponsorship Inquiry"
      successTitle="Sponsorship inquiry received."
      successNote={null}
      successLinks={[
        { href: "/sponsors", label: "Return to Sponsors" },
        { href: "/", label: "Explore Midwest Pixel Fest" },
      ]}
    >
      <TextInput
        id="sponsor-contact"
        name="contactName"
        label="Contact Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="sponsor-company"
        name="company"
        label="Business / Organization Name"
        required
        autoComplete="organization"
        maxLength={FIELD_LIMITS.medium}
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
        label="Business Website"
        type="text"
        autoComplete="url"
        maxLength={FIELD_LIMITS.url}
      />
      <TextInput
        id="sponsor-location"
        name="location"
        label="Business Location"
        autoComplete="address-level2"
        maxLength={FIELD_LIMITS.medium}
      />
      <Select
        id="sponsor-partnership"
        name="partnership"
        label="Sponsorship Interest"
        required
        options={getSponsorshipInterestOptions()}
        defaultValue={defaultInterest}
        hint="Working package names. Choosing one does not reserve it."
      />
      <TextArea
        id="sponsor-interest"
        name="interest"
        label="What interests you about partnering with Midwest Pixel Fest?"
        rows={4}
        maxLength={FIELD_LIMITS.message}
      />
      <TextArea
        id="sponsor-involvement"
        name="involvement"
        label="How would you like your business involved?"
        rows={4}
        maxLength={FIELD_LIMITS.message}
      />
      <TextArea
        id="sponsor-notes"
        name="notes"
        label="Additional Notes"
        rows={4}
        maxLength={FIELD_LIMITS.message}
      />
      <Checkbox
        id="contactConsent"
        name="contactConsent"
        required
        label="I understand this inquiry does not create a sponsorship agreement."
      />
    </InquiryForm>
  );
}
