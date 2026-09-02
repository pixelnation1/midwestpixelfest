"use client";

import { Checkbox } from "@/components/forms/Checkbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import {
  SPONSOR_LOGO_ALLOWED_EXTENSIONS,
  SPONSOR_PUBLIC_DESCRIPTION_MAX,
  isSponsorLogoStorageConfigured,
} from "@/lib/sponsor-ops/assets";

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

export function SponsorAssetForm() {
  const storageReady = isSponsorLogoStorageConfigured();

  return (
    <InquiryForm
      kind="sponsor_assets"
      submitLabel="Submit Sponsor Assets"
      successTitle="Assets Received for Review"
      successNote="Midwest Pixel Fest may edit the public description for length, formatting, and clarity without materially changing its meaning. Materials are not published automatically."
      successLinks={[
        { href: "/sponsors", label: "Return to Sponsors" },
        { href: "/contact", label: "Contact" },
      ]}
    >
      <FormSection title="Public listing">
        <TextInput
          id="asset-public-name"
          name="publicBusinessName"
          label="Official Public Business Name"
          required
          maxLength={FIELD_LIMITS.medium}
        />
        <TextInput
          id="asset-website"
          name="website"
          label="Website"
          type="url"
          required
          maxLength={FIELD_LIMITS.url}
        />
        <TextInput
          id="asset-social"
          name="primarySocialUrl"
          label="Primary Public Social URL"
          type="url"
          maxLength={FIELD_LIMITS.url}
        />
        <TextInput
          id="asset-social-2"
          name="additionalSocialUrl"
          label="Additional Social URL"
          type="url"
          maxLength={FIELD_LIMITS.url}
        />
        <TextArea
          id="asset-description"
          name="publicDescription"
          label="Public Sponsor Description"
          required
          rows={5}
          maxLength={SPONSOR_PUBLIC_DESCRIPTION_MAX}
          hint="About 300–500 characters. Midwest Pixel Fest may edit for length, formatting, and clarity without materially changing meaning. Raw text is not published automatically."
        />
        <TextInput
          id="asset-public-url"
          name="preferredPublicUrl"
          label="Preferred Public URL"
          type="url"
          required
          maxLength={FIELD_LIMITS.url}
        />
      </FormSection>

      <FormSection title="Marketing contact">
        <TextInput
          id="asset-marketing-name"
          name="marketingContactName"
          label="Primary Marketing Contact"
          required
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="asset-marketing-email"
          name="marketingContactEmail"
          label="Marketing Contact Email"
          type="email"
          required
          maxLength={FIELD_LIMITS.email}
        />
        <TextInput
          id="asset-marketing-phone"
          name="marketingContactPhone"
          label="Marketing Contact Phone"
          type="tel"
          maxLength={FIELD_LIMITS.phone}
        />
        <TextInput
          id="asset-guidelines"
          name="brandGuidelinesUrl"
          label="Brand Guidelines URL"
          type="url"
          hint="Optional."
          maxLength={FIELD_LIMITS.url}
        />
      </FormSection>

      <FormSection
        title="Logo"
        description={`Preferred formats: ${SPONSOR_LOGO_ALLOWED_EXTENSIONS.join(", ").toUpperCase()}. Transparent high-resolution artwork when available. Primary logo is the important file. Light, dark, and monochrome variants are optional.`}
      >
        {storageReady ? (
          <p className="text-sm text-muted">Upload fields will appear here when storage is connected.</p>
        ) : (
          <p className="text-sm text-muted">
            Secure logo storage is not connected yet, so this page does not
            accept file uploads. Midwest Pixel Fest will tell you how to deliver
            SVG, PNG, or PDF artwork. Do not email executable files or card
            information.
          </p>
        )}
      </FormSection>

      <Checkbox
        id="asset-consent"
        name="contactConsent"
        required
        label="I understand Midwest Pixel Fest may edit this public description for length, formatting, and clarity without materially changing its meaning, and that materials are reviewed before any public listing."
      />
    </InquiryForm>
  );
}
