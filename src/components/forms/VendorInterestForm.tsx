"use client";

import { useCallback, useState } from "react";
import { Checkbox, CheckboxGroup } from "@/components/forms/Checkbox";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { formOptionLists } from "@/lib/forms/options";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import {
  COSPLAY_INTEREST_SELL_TYPES,
  COSPLAY_PROGRAMMING_INTEREST,
  COSPLAY_SOCIAL_PLATFORMS,
  applicantTypeAnalyticsId,
  showsCosplayVendorFields,
} from "@/lib/vendors";

export function VendorInterestForm() {
  const [applicantType, setApplicantType] = useState("");
  const [primaryCategory, setPrimaryCategory] = useState("");
  const showCosplayFields = showsCosplayVendorFields(applicantType, primaryCategory);

  const getAnalyticsPayload = useCallback(() => {
    const applicantTypeId = applicantTypeAnalyticsId(applicantType);
    return applicantTypeId ? { applicant: applicantTypeId, applicant_type: applicantTypeId } : undefined;
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
        onValueChange={setPrimaryCategory}
      />
      {showCosplayFields ? (
        <>
          <TextInput
            id="vendor-cosplay-name"
            name="cosplayCreatorName"
            label="Cosplay / Creator Name"
            hint="Optional if you only use your business name. What name do you use publicly as a cosplayer or creator?"
            maxLength={FIELD_LIMITS.medium}
          />
          <CheckboxGroup
            legend="What do you plan to sell?"
            name="cosplaySellTypes"
            options={COSPLAY_INTEREST_SELL_TYPES}
            hint="Choose every option that applies. This is for people who want vendor or Artist Alley space to sell products."
          />
          <CheckboxGroup
            legend="Social presence"
            name="socialPlatforms"
            options={COSPLAY_SOCIAL_PLATFORMS}
            required={false}
            hint="Optional. Select the public profiles you use. You do not need every platform."
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
            label="Primary social URL or handle"
            type="text"
            hint="Optional. Instagram, TikTok, Facebook, YouTube, Twitch, or another public profile URL or handle is fine."
            maxLength={FIELD_LIMITS.url}
          />
          <TextInput
            id="vendor-social-additional"
            name="socialAdditional"
            label="Additional social URL"
            hint="Optional."
            maxLength={FIELD_LIMITS.url}
          />
          <RadioGroup
            legend="Would you also be interested in participating in cosplay programming, panels, meetups, contests, or creator activities?"
            name="programmingInterest"
            options={COSPLAY_PROGRAMMING_INTEREST}
            required={false}
            hint="Vendor participation and guest/programming participation are separate. Checking this only tells our team you may be interested. It does not make you an official guest, and it does not include a free booth, travel, hotel, appearance fee, or featured placement."
          />
        </>
      ) : (
        <>
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
        </>
      )}
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
