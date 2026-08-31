"use client";

import { Checkbox } from "@/components/forms/Checkbox";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";

export function VendorInterestForm() {
  return (
    <InquiryForm
      kind="vendor_interest"
      submitLabel="Register Vendor Interest"
      successTitle="Your interest has been received"
    >
      <TextInput
        id="vendor-business"
        name="businessName"
        label="Business / Artist Name"
        required
        autoComplete="organization"
        maxLength={FIELD_LIMITS.medium}
      />
      <TextInput
        id="vendor-contact"
        name="contactName"
        label="Contact Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="vendor-email"
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
        maxLength={FIELD_LIMITS.email}
      />
      <TextInput
        id="vendor-website"
        name="website"
        label="Website or Social URL"
        type="text"
        autoComplete="url"
        hint="Full URL if you have one."
        maxLength={FIELD_LIMITS.url}
      />
      <Select
        id="vendor-type"
        name="vendorType"
        label="Vendor Type"
        required
        options={formOptionLists.vendorTypes}
      />
      <TextArea
        id="vendor-sell"
        name="whatYouSell"
        label="What do you sell or create?"
        rows={5}
        maxLength={FIELD_LIMITS.message}
      />
      <Checkbox
        id="notifyApplications"
        name="notifyApplications"
        required
        label="Notify me when official applications open."
      />
      <ConsentCheckbox />
    </InquiryForm>
  );
}
