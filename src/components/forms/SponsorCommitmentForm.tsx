"use client";

import { Checkbox } from "@/components/forms/Checkbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import { sponsorshipPackages } from "@/lib/sponsorships";

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

export function SponsorCommitmentForm() {
  return (
    <InquiryForm
      kind="sponsor_commitment"
      submitLabel="Submit Sponsorship Commitment"
      successTitle="Commitment Received"
      successNote="Midwest Pixel Fest will follow up with invoice or next-step instructions. This website does not collect payment."
      successLinks={[
        { href: "/sponsors", label: "Return to Sponsors" },
        { href: "/contact", label: "Contact" },
      ]}
    >
      <p className="text-sm text-muted">
        This commitment confirms the sponsorship package and benefits agreed
        upon between the sponsor and Midwest Pixel Fest, subject to the final
        sponsorship agreement and applicable event policies. It does not replace
        an attorney-reviewed contract and does not collect card or bank details.
      </p>

      <FormSection title="Business / Organization">
        <TextInput
          id="commit-business"
          name="businessName"
          label="Business / Organization Name"
          required
          autoComplete="organization"
          maxLength={FIELD_LIMITS.medium}
        />
        <TextInput
          id="commit-rep"
          name="representativeName"
          label="Authorized Representative"
          required
          autoComplete="name"
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="commit-title"
          name="representativeTitle"
          label="Title / Role"
          required
          autoComplete="organization-title"
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="commit-email"
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
        />
        <TextInput
          id="commit-phone"
          name="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          maxLength={FIELD_LIMITS.phone}
        />
        <TextInput
          id="commit-address"
          name="businessAddress"
          label="Business Address"
          required
          autoComplete="street-address"
          maxLength={FIELD_LIMITS.medium}
        />
      </FormSection>

      <FormSection title="Agreed sponsorship">
        <Select
          id="commit-level"
          name="agreedLevel"
          label="Agreed Sponsorship Level"
          required
          options={sponsorshipPackages.map((pkg) => pkg.name)}
        />
        <TextInput
          id="commit-amount"
          name="agreedAmount"
          label="Agreed Sponsorship Amount"
          required
          hint="Enter the amount Midwest Pixel Fest confirmed in writing. Do not enter card or bank numbers."
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="commit-area"
          name="approvedArea"
          label="Approved Sponsorship Area"
          hint="Optional. Only if Midwest Pixel Fest approved an area or activity."
          maxLength={FIELD_LIMITS.medium}
        />
        <TextArea
          id="commit-benefits"
          name="includedBenefitsSummary"
          label="Summary of Included Benefits"
          required
          rows={5}
          maxLength={FIELD_LIMITS.message}
        />
        <TextArea
          id="commit-custom"
          name="customBenefitsSummary"
          label="Approved Custom Benefits"
          hint="Optional. List only benefits Midwest Pixel Fest approved. Custom opportunities are not self-selected guarantees."
          rows={4}
          maxLength={FIELD_LIMITS.message}
        />
      </FormSection>

      <FormSection title="Acknowledgments">
        <Checkbox
          id="commit-payment"
          name="paymentTermsAck"
          required
          label="I acknowledge the payment terms confirmed with Midwest Pixel Fest. Payment is due by the date set for this sponsorship. This website does not collect payment."
        />
        <Checkbox
          id="commit-assets"
          name="marketingAssetsAck"
          required
          label="I acknowledge that required marketing assets (including a logo and public description) will be provided after payment instructions are issued."
        />
        <Checkbox
          id="commit-agreement"
          name="agreementAck"
          required
          label="I understand this commitment is subject to the final sponsorship agreement and applicable event policies, and that it does not replace attorney-reviewed terms."
        />
        <TextInput
          id="commit-signature"
          name="electronicSignature"
          label="Electronic Signature"
          required
          hint="Type your full name as the authorized representative."
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="commit-date"
          name="signatureDate"
          label="Date"
          type="date"
          required
        />
      </FormSection>
    </InquiryForm>
  );
}
