"use client";

import { useState } from "react";
import { Checkbox, CheckboxGroup } from "@/components/forms/Checkbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import {
  OTHER_INTEREST_VALUE,
  getSponsorshipLevelOptions,
  isCustomSponsorshipSelection,
  sponsorshipInterestAreas,
} from "@/lib/sponsorships";

type SponsorInquiryFormProps = {
  defaultLevel?: string;
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-6 border border-line p-5 sm:p-6">
      <legend className="px-2 font-display text-lg uppercase tracking-wide text-paper">
        {title}
      </legend>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
      {children}
    </fieldset>
  );
}

export function SponsorInquiryForm({ defaultLevel }: SponsorInquiryFormProps) {
  const [level, setLevel] = useState(defaultLevel ?? "");
  const [showOther, setShowOther] = useState(false);
  const showCustomAmount = isCustomSponsorshipSelection(level);

  return (
    <InquiryForm
      kind="sponsor_inquiry"
      submitLabel="Send Sponsorship Inquiry"
      successTitle="Sponsorship Inquiry Received"
      successNote="If your sponsorship is accepted, you'll receive confirmation and payment instructions before your sponsorship is finalized."
      successLinks={[
        { href: "/sponsors", label: "Return to Sponsors" },
        { href: "/", label: "Explore Midwest Pixel Fest" },
      ]}
    >
      <FormSection title="Business / Organization Information">
        <TextInput
          id="sponsor-company"
          name="company"
          label="Business / Organization Name"
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
          id="sponsor-title"
          name="title"
          label="Title / Position"
          autoComplete="organization-title"
          maxLength={FIELD_LIMITS.short}
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
          id="sponsor-email"
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
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
          id="sponsor-address"
          name="address"
          label="Business Address"
          autoComplete="street-address"
          maxLength={FIELD_LIMITS.medium}
        />
        <div className="grid gap-6 sm:grid-cols-3">
          <TextInput
            id="sponsor-city"
            name="city"
            label="City"
            autoComplete="address-level2"
            maxLength={FIELD_LIMITS.short}
          />
          <TextInput
            id="sponsor-state"
            name="state"
            label="State"
            autoComplete="address-level1"
            maxLength={FIELD_LIMITS.short}
          />
          <TextInput
            id="sponsor-zip"
            name="zip"
            label="ZIP"
            autoComplete="postal-code"
            maxLength={20}
          />
        </div>
      </FormSection>

      <FormSection
        title="Sponsorship"
        description="Choosing a level does not reserve it. Custom inquiries can include a proposed amount — not payment details."
      >
        <Select
          id="sponsor-partnership"
          name="partnership"
          label="Sponsorship Level Interested In"
          required
          options={getSponsorshipLevelOptions()}
          defaultValue={defaultLevel}
          onValueChange={setLevel}
          hint="Submitting this form expresses your interest in sponsoring Midwest Pixel Fest and does not by itself create a sponsorship agreement."
        />
        {showCustomAmount ? (
          <TextInput
            id="sponsor-proposed-amount"
            name="proposedAmount"
            label="Proposed Sponsorship Amount"
            hint="Optional. Do not enter card or bank numbers."
            maxLength={FIELD_LIMITS.short}
          />
        ) : null}
        <CheckboxGroup
          legend="Specific Sponsorship Interests"
          name="areas"
          options={sponsorshipInterestAreas}
          required={false}
          hint="Select every area that applies."
          onToggle={(value, checked) => {
            if (value === OTHER_INTEREST_VALUE) setShowOther(checked);
            if (checked) {
              trackEvent(ANALYTICS_EVENTS.sponsor_interest_area_select, { area: value });
            }
          }}
        />
        {showOther ? (
          <TextInput
            id="sponsor-other-interest"
            name="otherInterest"
            label="Other Interest"
            maxLength={FIELD_LIMITS.medium}
          />
        ) : null}
      </FormSection>

      <FormSection
        title="How should we represent your business?"
        description="This is how your business or organization may be identified in sponsorship materials if your partnership is approved. If your sponsorship is approved, we'll request a high-resolution PNG, JPG, SVG, or PDF logo for event and promotional materials. Do not upload a logo with this inquiry."
      >
        <TextInput
          id="sponsor-display-name"
          name="displayName"
          label="Display Name"
          maxLength={FIELD_LIMITS.medium}
        />
        <TextInput
          id="sponsor-display-link"
          name="displayLink"
          label="Website / Social Link"
          type="text"
          maxLength={FIELD_LIMITS.url}
        />
      </FormSection>

      <FormSection
        title="Marketing / logo contact"
        description="Optional. Use this if someone else will supply graphics after a sponsorship is approved."
      >
        <TextInput
          id="sponsor-marketing-contact"
          name="marketingContact"
          label="Marketing / Logo Contact Name"
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="sponsor-marketing-email"
          name="marketingEmail"
          label="Marketing / Logo Contact Email"
          type="email"
          maxLength={FIELD_LIMITS.email}
        />
      </FormSection>

      <FormSection title="Notes">
        <TextArea
          id="sponsor-notes"
          name="notes"
          label="Additional comments"
          rows={4}
          maxLength={FIELD_LIMITS.message}
        />
      </FormSection>

      <p className="text-sm text-muted">
        Submitting a sponsorship inquiry does not create a contract, require
        payment, reserve inventory, guarantee exclusivity, or activate benefits.
        Sponsorship recognition begins after an approved sponsorship is
        finalized, payment is received, and required marketing materials are
        provided.
      </p>

      <Checkbox
        id="contactConsent"
        name="contactConsent"
        required
        label="I understand this inquiry does not create a sponsorship agreement."
      />
    </InquiryForm>
  );
}
