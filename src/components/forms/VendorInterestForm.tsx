"use client";

import { useCallback, useState } from "react";
import { Checkbox } from "@/components/forms/Checkbox";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import { applicantTypeAnalyticsId } from "@/lib/vendors";

export function VendorInterestForm() {
  const [applicantType, setApplicantType] = useState("");

  const getAnalyticsPayload = useCallback(() => {
    const applicant = applicantTypeAnalyticsId(applicantType);
    return applicant ? { applicant } : undefined;
  }, [applicantType]);

  return (
    <InquiryForm
      kind="vendor_interest"
      submitLabel="Register Vendor Interest"
      successTitle="Your interest has been received"
      successNote="We'll notify you when official vendor and Artist Alley applications launch. This is not an application and does not reserve a booth."
      successLinks={[
        { href: "/vendors", label: "Back to Vendors" },
        { href: "/", label: "Explore Midwest Pixel Fest" },
      ]}
      getAnalyticsPayload={getAnalyticsPayload}
    >
      <TextInput
        id="vendor-contact"
        name="contactName"
        label="Contact Name"
        required
        autoComplete="name"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="vendor-business"
        name="businessName"
        label="Business / Artist Name"
        required
        autoComplete="organization"
        maxLength={FIELD_LIMITS.medium}
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
        id="vendor-phone"
        name="phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        hint="Optional."
        maxLength={FIELD_LIMITS.phone}
      />
      <TextInput
        id="vendor-website"
        name="website"
        label="Website"
        type="text"
        autoComplete="url"
        hint="Optional. Full URL if you have one."
        maxLength={FIELD_LIMITS.url}
      />
      <TextInput
        id="vendor-social"
        name="socialMedia"
        label="Social Media"
        type="text"
        hint="Optional. A profile URL or handle is fine."
        maxLength={FIELD_LIMITS.url}
      />
      <Select
        id="vendor-type"
        name="vendorType"
        label="Applicant Type"
        required
        options={formOptionLists.vendorTypes}
        onValueChange={setApplicantType}
      />
      <Select
        id="vendor-category"
        name="vendorCategory"
        label="Primary Category"
        required
        options={formOptionLists.vendorCategories}
      />
      <TextArea
        id="vendor-sell"
        name="whatYouSell"
        label="What do you sell or create?"
        required
        rows={5}
        maxLength={FIELD_LIMITS.message}
      />
      <TextInput
        id="vendor-city"
        name="city"
        label="City"
        autoComplete="address-level2"
        hint="Optional. Where are you located?"
        maxLength={FIELD_LIMITS.short}
      />
      <TextInput
        id="vendor-state"
        name="state"
        label="State"
        autoComplete="address-level1"
        hint="Optional."
        maxLength={FIELD_LIMITS.short}
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
