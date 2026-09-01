"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox, CheckboxGroup } from "@/components/forms/Checkbox";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { RadioGroup } from "@/components/forms/RadioGroup";
import { Select } from "@/components/forms/Select";
import { TextArea } from "@/components/forms/TextArea";
import { TextInput } from "@/components/forms/TextInput";
import { useFieldError } from "@/components/forms/FormContext";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { FIELD_LIMITS } from "@/lib/forms/validate";
import {
  APPLICATION_COUNTRIES,
  APPLICATION_FORM_SECTIONS,
  APPLICATION_PRIMARY_CATEGORIES,
  DISPLAY_ELEMENTS,
  INSURANCE_STATUSES,
  MERCHANDISE_MIX_RANGES,
  ORIGINAL_WORK_PERCENTAGES,
  PRODUCTION_METHODS,
  VENDOR_INVENTORY_TYPES,
  YES_NO,
  usesElectricalDisplay,
  type OfficialApplicationType,
} from "@/lib/vendor-application";
import {
  formatSpacePriceLine,
  formatVendorPrice,
  spacesForApplicationType,
  vendorPricing,
} from "@/lib/vendors";

type VendorApplicationFormProps = {
  applicationType: OfficialApplicationType;
};

function ApplicationSection({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      id={id}
      className="scroll-mt-24 space-y-6 border border-line bg-panel p-5 sm:p-6"
    >
      <legend className="px-2">
        <span className="font-pixel text-[10px] uppercase tracking-[0.18em] text-cyan">
          {number}
        </span>{" "}
        <span className="font-display text-lg uppercase tracking-wide text-paper">
          {title}
        </span>
      </legend>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
      {children}
    </fieldset>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="border border-gold/50 bg-ink p-4 text-sm leading-relaxed text-paper"
      role="note"
    >
      {children}
    </p>
  );
}

function SpaceRequestField({
  applicationType,
}: {
  applicationType: OfficialApplicationType;
}) {
  const spaces = spacesForApplicationType(applicationType);
  const fieldError = useFieldError("spaceRequest");
  const errorId = fieldError ? "spaceRequest-error" : undefined;

  return (
    <fieldset aria-describedby={errorId} className="flex flex-col gap-3">
      <legend className="font-display text-sm uppercase tracking-[0.14em]">
        Preferred space
        <span className="text-magenta" aria-hidden="true">
          {" "}
          *
        </span>
        <span className="sr-only"> (required)</span>
      </legend>
      <p className="text-sm text-muted">
        Space requests are preferences and are subject to approval and
        availability.
      </p>
      <div className="flex min-w-0 flex-col gap-3">
        {spaces.map((space) => (
          <label
            key={space.id}
            className="flex min-h-11 min-w-0 items-start gap-3 border border-line bg-ink p-4"
          >
            <input
              type="radio"
              name="spaceRequest"
              value={space.id}
              required
              className="mt-1 h-5 min-h-5 w-5 min-w-5 shrink-0 accent-magenta"
            />
            <span className="min-w-0">
              <span className="block font-display text-base uppercase tracking-wide text-paper">
                {space.name}
                {space.dimensions ? ` — ${space.dimensions}` : ""}
              </span>
              <span className="mt-1 block text-sm text-gold">
                {formatSpacePriceLine(space)}
              </span>
            </span>
          </label>
        ))}
      </div>
      {fieldError ? (
        <p id={errorId} className="text-sm text-gold" role="alert">
          {fieldError}
        </p>
      ) : null}
    </fieldset>
  );
}

export function VendorApplicationForm({
  applicationType,
}: VendorApplicationFormProps) {
  const [vendedBefore, setVendedBefore] = useState("");
  const [mysteryMerchandise, setMysteryMerchandise] = useState("");
  const [additionalSpace, setAdditionalSpace] = useState("");
  const [electricityRequested, setElectricityRequested] = useState("");
  const [tallDisplays, setTallDisplays] = useState("");
  const [displayElements, setDisplayElements] = useState<string[]>([]);
  const [aiGenerated, setAiGenerated] = useState("");
  const [sellsFood, setSellsFood] = useState("");
  const [boothSharing, setBoothSharing] = useState("");
  const [hoursCommitment, setHoursCommitment] = useState("");

  const artist = applicationType === "Artist Alley";
  const showElectricalNote = usesElectricalDisplay(displayElements);
  const extraBadgePrice = formatVendorPrice(vendorPricing.extraBadge);
  const extraTablePrice = formatVendorPrice(vendorPricing.extraTable);

  return (
    <InquiryForm
      kind="vendor_application"
      submitLabel="Submit Application"
      successTitle="Application Received"
      successNote="This application is not the final vendor agreement. If approved, you'll receive an acceptance offer and payment instructions separately."
      successLinks={[
        { href: "/vendors", label: "Return to Vendor Info" },
        { href: "/", label: "Explore Midwest Pixel Fest" },
      ]}
      submitEventName={
        artist
          ? ANALYTICS_EVENTS.artist_application_submit
          : ANALYTICS_EVENTS.vendor_application_submit
      }
    >
      <input type="hidden" name="applicationType" value={applicationType} />

      <nav aria-label="Application sections" className="border border-line bg-ink p-4">
        <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-cyan">
          Sections
        </p>
        <ol className="mt-3 flex min-w-0 flex-wrap gap-2">
          {APPLICATION_FORM_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#apply-${section.id}`}
                className="inline-flex min-h-11 items-center border border-line px-3 py-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-muted hover:border-cyan hover:text-cyan"
              >
                {section.number} {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ApplicationSection
        id="apply-contact"
        number="01"
        title="Contact"
        description="We'll use this information to follow up on your application."
      >
        <p className="text-sm text-paper">
          Application type:{" "}
          <span className="text-cyan">{applicationType}</span>
        </p>
        <TextInput
          id="apply-contact-name"
          name="contactName"
          label="Contact Name"
          required
          autoComplete="name"
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="apply-business-name"
          name="businessName"
          label="Business / Artist Name"
          required
          autoComplete="organization"
          maxLength={FIELD_LIMITS.medium}
        />
        <TextInput
          id="apply-email"
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          maxLength={FIELD_LIMITS.email}
        />
        <TextInput
          id="apply-phone"
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          maxLength={FIELD_LIMITS.phone}
        />
        <TextInput
          id="apply-website"
          name="website"
          label="Website"
          type="text"
          autoComplete="url"
          hint="Optional."
          maxLength={FIELD_LIMITS.url}
        />
        <TextInput
          id="apply-social-primary"
          name="socialPrimary"
          label="Primary Social Media"
          hint="Optional. A profile URL or handle is fine."
          maxLength={FIELD_LIMITS.url}
        />
        <TextInput
          id="apply-social-additional"
          name="socialAdditional"
          label="Additional Social Media"
          hint="Optional."
          maxLength={FIELD_LIMITS.url}
        />
        <TextInput
          id="apply-street"
          name="street"
          label="Street Address"
          required
          autoComplete="street-address"
          maxLength={FIELD_LIMITS.medium}
        />
        <div className="grid min-w-0 gap-6 sm:grid-cols-2">
          <TextInput
            id="apply-city"
            name="city"
            label="City"
            required
            autoComplete="address-level2"
            maxLength={FIELD_LIMITS.short}
          />
          <TextInput
            id="apply-state"
            name="state"
            label="State / Province / Region"
            required
            autoComplete="address-level1"
            maxLength={FIELD_LIMITS.short}
          />
        </div>
        <div className="grid min-w-0 gap-6 sm:grid-cols-2">
          <TextInput
            id="apply-zip"
            name="zip"
            label="ZIP / Postal Code"
            required
            autoComplete="postal-code"
            maxLength={20}
          />
          <Select
            id="apply-country"
            name="country"
            label="Country"
            required
            options={APPLICATION_COUNTRIES}
            defaultValue="United States"
          />
        </div>
        <TextInput
          id="apply-primary-rep"
          name="primaryRepName"
          label="Primary Booth Representative Name"
          required
          hint="Do not include government ID numbers, Social Security numbers, or dates of birth."
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="apply-additional-reps"
          name="additionalRepNames"
          label="Additional Representative Names"
          hint="Optional. Separate names with commas."
          maxLength={FIELD_LIMITS.medium}
        />
      </ApplicationSection>

      <ApplicationSection
        id="apply-business"
        number="02"
        title="Business"
        description="Tell us about your business, artwork, or brand."
      >
        <TextArea
          id="apply-business-description"
          name="businessDescription"
          label="Business / Artist Description"
          required
          hint="Tell us about your business, artwork, or brand."
          rows={6}
          maxLength={FIELD_LIMITS.message}
        />
        <TextInput
          id="apply-years"
          name="yearsActive"
          label="Years in Business / Creating"
          hint="Optional."
          maxLength={FIELD_LIMITS.short}
        />
        <RadioGroup
          legend="Have you vended at conventions before?"
          name="vendedBefore"
          options={YES_NO}
          onValueChange={setVendedBefore}
        />
        {vendedBefore === "Yes" ? (
          <TextArea
            id="apply-prior-events"
            name="priorEvents"
            label="Events you've participated in"
            hint="Optional. Convention experience is not required."
            rows={4}
            maxLength={FIELD_LIMITS.message}
          />
        ) : null}
      </ApplicationSection>

      <ApplicationSection id="apply-sell" number="03" title="What you sell">
        <Select
          id="apply-primary-category"
          name="primaryCategory"
          label="Primary Category"
          required
          options={APPLICATION_PRIMARY_CATEGORIES}
        />
        <CheckboxGroup
          legend="Secondary Categories"
          name="secondaryCategories"
          options={APPLICATION_PRIMARY_CATEGORIES}
          required={false}
          hint="Optional. Select any additional categories that apply."
        />
        <TextArea
          id="apply-what-you-sell"
          name="whatYouSell"
          label="What do you plan to sell?"
          required
          rows={6}
          maxLength={FIELD_LIMITS.message}
        />
        <p className="text-sm text-muted">
          Approximate percentage of merchandise in each category. Exact
          accounting is not required.
        </p>
        <div className="grid min-w-0 gap-6 sm:grid-cols-2">
          <Select
            id="apply-mix-original"
            name="mixOriginal"
            label="Original / self-created"
            required
            options={MERCHANDISE_MIX_RANGES}
          />
          <Select
            id="apply-mix-licensed"
            name="mixLicensed"
            label="Licensed retail merchandise"
            required
            options={MERCHANDISE_MIX_RANGES}
          />
          <Select
            id="apply-mix-secondhand"
            name="mixSecondhand"
            label="Secondhand / vintage / collectible"
            required
            options={MERCHANDISE_MIX_RANGES}
          />
          <Select
            id="apply-mix-other"
            name="mixOther"
            label="Other"
            required
            options={MERCHANDISE_MIX_RANGES}
          />
        </div>

        {artist ? (
          <>
            <RadioGroup
              legend="Is the majority of the work you plan to sell created or designed by you?"
              name="ownWorkMajority"
              options={YES_NO}
            />
            <Select
              id="apply-own-work-percent"
              name="ownWorkPercent"
              label="What percentage of your table will consist of your own original work?"
              required
              options={ORIGINAL_WORK_PERCENTAGES}
            />
            <RadioGroup
              legend="Do you offer commissions?"
              name="offersCommissions"
              options={YES_NO}
            />
            <Select
              id="apply-production-method"
              name="productionMethod"
              label="Do you create your products yourself, work with a production partner, or both?"
              required
              options={PRODUCTION_METHODS}
            />
          </>
        ) : (
          <>
            <CheckboxGroup
              legend="What types of inventory will you bring?"
              name="inventoryTypes"
              options={VENDOR_INVENTORY_TYPES}
              required
            />
            <RadioGroup
              legend="Do you sell mystery boxes, mystery packs, repacks, or randomized merchandise?"
              name="mysteryMerchandise"
              options={YES_NO}
              onValueChange={setMysteryMerchandise}
            />
            {mysteryMerchandise === "Yes" ? (
              <TextArea
                id="apply-mystery-description"
                name="mysteryDescription"
                label="Describe your mystery or randomized merchandise"
                required
                rows={4}
                maxLength={FIELD_LIMITS.message}
              />
            ) : null}
          </>
        )}
      </ApplicationSection>

      <ApplicationSection
        id="apply-space"
        number="04"
        title="Space"
        description="Select your preferred space. Founding Vendor Rate is shown where it currently applies."
      >
        <SpaceRequestField applicationType={applicationType} />
        <RadioGroup
          legend="Would you like to request an additional booth/space?"
          name="additionalSpace"
          options={YES_NO}
          onValueChange={setAdditionalSpace}
        />
        {additionalSpace === "Yes" ? (
          <TextArea
            id="apply-additional-space-details"
            name="additionalSpaceDetails"
            label="Additional space details"
            required
            hint="Approval is subject to availability."
            rows={4}
            maxLength={FIELD_LIMITS.message}
          />
        ) : null}
        <TextInput
          id="apply-extra-badges"
          name="extraBadges"
          label="Extra Vendor Badges Requested"
          type="number"
          required
          min={0}
          max={20}
          step={1}
          inputMode="numeric"
          defaultValue="0"
          hint={`Current extra vendor badge price: ${extraBadgePrice}. Approval is subject to availability.`}
        />
        <TextInput
          id="apply-extra-tables"
          name="extraTables"
          label="Extra Tables Requested"
          type="number"
          required
          min={0}
          max={10}
          step={1}
          inputMode="numeric"
          defaultValue="0"
          hint={`Current extra table price: ${extraTablePrice}. Approval is subject to availability.`}
        />
        <RadioGroup
          legend="Electricity requested?"
          name="electricityRequested"
          options={YES_NO}
          onValueChange={setElectricityRequested}
        />
        {electricityRequested === "Yes" ? (
          <Notice>
            Electrical availability and pricing have not yet been finalized.
            Requesting electricity does not charge a fee and does not guarantee
            access.
          </Notice>
        ) : null}
      </ApplicationSection>

      <ApplicationSection id="apply-setup" number="05" title="Booth setup">
        <RadioGroup
          legend="Do you plan to use displays taller than 8 feet?"
          name="tallDisplays"
          options={YES_NO}
          onValueChange={setTallDisplays}
        />
        {tallDisplays === "Yes" ? (
          <TextArea
            id="apply-tall-display-description"
            name="tallDisplayDescription"
            label="Describe displays taller than 8 feet"
            required
            rows={4}
            maxLength={FIELD_LIMITS.message}
          />
        ) : null}
        <CheckboxGroup
          legend="Will your booth use:"
          name="displayElements"
          options={DISPLAY_ELEMENTS}
          required={false}
          hint="Optional. Select all that apply."
          onToggle={(value, checked) => {
            setDisplayElements((current) =>
              checked
                ? [...current, value]
                : current.filter((item) => item !== value),
            );
          }}
        />
        {showElectricalNote ? (
          <Notice>
            Power is not guaranteed until venue requirements are finalized.
            Electrical access and pricing will be published with the vendor
            packet.
          </Notice>
        ) : null}
        <TextArea
          id="apply-booth-setup-notes"
          name="boothSetupNotes"
          label="Describe your planned booth setup"
          hint="Optional, but recommended."
          rows={5}
          maxLength={FIELD_LIMITS.message}
        />
      </ApplicationSection>

      <ApplicationSection id="apply-compliance" number="06" title="Compliance">
        <div className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="font-display text-sm uppercase tracking-[0.14em] text-paper">
            Preliminary merchandise policy
          </p>
          <p>
            Applicants must not sell prohibited or unlawful merchandise at
            Midwest Pixel Fest, including counterfeit merchandise; bootleg
            merchandise represented as official; stolen goods; illegal items;
            recalled or knowingly unsafe products; weapons prohibited by event
            or venue policy; pornography or sexually explicit material
            inappropriate for a general-attendance convention; unlicensed food
            or beverage sales where permits are required; and merchandise that
            violates applicable law.
          </p>
          <p>
            This is not a ban on fan art or original work inspired by existing
            properties. Vendors are responsible for ensuring the merchandise
            they sell complies with applicable laws and intellectual-property
            requirements. Midwest Pixel Fest may require removal of merchandise
            that violates event rules or venue requirements.
          </p>
        </div>
        <Checkbox
          id="merchandisePolicy"
          name="merchandisePolicy"
          required
          label="I agree that I will not sell prohibited or unlawful merchandise, and I understand Midwest Pixel Fest may require removal of merchandise that violates event or venue rules."
        />
        <RadioGroup
          legend="Will any artwork or merchandise you sell include primarily AI-generated imagery?"
          name="aiGenerated"
          options={YES_NO}
          onValueChange={setAiGenerated}
        />
        {aiGenerated === "Yes" ? (
          <TextArea
            id="apply-ai-description"
            name="aiDescription"
            label="Briefly explain the AI-generated imagery"
            required
            hint="This is a disclosure for review. It is not an automatic rejection."
            rows={4}
            maxLength={FIELD_LIMITS.message}
          />
        ) : null}
        <RadioGroup
          legend="Do you intend to sell food or beverages?"
          name="sellsFood"
          options={YES_NO}
          onValueChange={setSellsFood}
        />
        {sellsFood === "Yes" ? (
          <Notice>
            Food and beverage vending opportunities have not yet been confirmed.
            Additional venue, licensing, insurance, and health requirements may
            apply. This does not guarantee acceptance.
          </Notice>
        ) : null}
        <Checkbox
          id="taxAcknowledgment"
          name="taxAcknowledgment"
          required
          label="I understand vendors are responsible for complying with applicable Kansas and local tax, licensing, permit, and business requirements. Midwest Pixel Fest does not provide individualized tax or legal advice."
        />
        <Select
          id="apply-insurance"
          name="insuranceStatus"
          label="Do you currently carry business/general liability insurance?"
          required
          options={INSURANCE_STATUSES}
          hint="Final insurance requirements, if any, will be published with the vendor packet."
        />
        <RadioGroup
          legend="Will you be sharing your booth with another business or artist?"
          name="boothSharing"
          options={YES_NO}
          hint="Booth sharing is subject to approval. Approved vendors may not silently sublet space."
          onValueChange={setBoothSharing}
        />
        {boothSharing === "Yes" ? (
          <>
            <TextInput
              id="apply-share-business"
              name="shareBusinessName"
              label="Name of business / artist"
              required
              maxLength={FIELD_LIMITS.medium}
            />
            <TextInput
              id="apply-share-contact"
              name="shareContactName"
              label="Contact person"
              required
              maxLength={FIELD_LIMITS.short}
            />
            <TextInput
              id="apply-share-email"
              name="shareEmail"
              label="Email"
              type="email"
              required
              maxLength={FIELD_LIMITS.email}
            />
            <TextArea
              id="apply-share-description"
              name="shareDescription"
              label="What they will sell"
              required
              rows={4}
              maxLength={FIELD_LIMITS.message}
            />
          </>
        ) : null}
        <p className="text-sm text-muted">
          Vendor load-in details will be published later. Exact vendor hours
          have not been finalized.
        </p>
        <RadioGroup
          legend="Can you commit to operating your booth during required Vendor Hall / Artist Alley hours for both event days?"
          name="hoursCommitment"
          options={YES_NO}
          onValueChange={setHoursCommitment}
        />
        {hoursCommitment === "No" ? (
          <TextArea
            id="apply-hours-explanation"
            name="hoursExplanation"
            label="Please explain"
            required
            rows={4}
            maxLength={FIELD_LIMITS.message}
          />
        ) : null}
        <div className="space-y-3 text-sm leading-relaxed text-muted">
          <p className="font-display text-sm uppercase tracking-[0.14em] text-paper">
            Applications, payment, and cancellation
          </p>
          <p>Applications are free. Submitting an application does not reserve space.</p>
          <p>
            Payment is due only after approval. Space is not secured until
            payment is received.
          </p>
          <p>
            Vendor cancellation and refund terms will be provided with the
            acceptance offer before payment is required.
          </p>
        </div>
        <Checkbox
          id="cancellationAck"
          name="cancellationAck"
          required
          label="I understand that vendor cancellation and refund terms will be provided with the acceptance offer before payment is required."
        />
        <Checkbox
          id="noPaymentAck"
          name="noPaymentAck"
          required
          label="I understand that submitting this application does not require payment and does not reserve a booth."
        />
        <Checkbox
          id="paymentIfApprovedAck"
          name="paymentIfApprovedAck"
          required
          label="I understand that, if approved, I will receive payment instructions and must complete payment by the deadline provided to secure my space."
        />
      </ApplicationSection>

      <ApplicationSection id="apply-agreements" number="07" title="Agreements">
        <Checkbox
          id="ackAccurate"
          name="ackAccurate"
          required
          label="I certify the information in this application is accurate."
        />
        <Checkbox
          id="ackNoGuarantee"
          name="ackNoGuarantee"
          required
          label="I understand submitting an application does not guarantee acceptance."
        />
        <Checkbox
          id="ackSpaceAssignment"
          name="ackSpaceAssignment"
          required
          label="I understand space assignments are determined by Midwest Pixel Fest."
        />
        <Checkbox
          id="ackEventRules"
          name="ackEventRules"
          required
          label="I agree to follow event and venue rules."
        />
        <Checkbox
          id="ackProhibitedRemoval"
          name="ackProhibitedRemoval"
          required
          label="I understand prohibited merchandise may be required to be removed."
        />
        <Checkbox
          id="ackLegal"
          name="ackLegal"
          required
          label="I understand vendors are responsible for applicable legal, licensing, and tax obligations."
        />
        <Checkbox
          id="ackBoothShare"
          name="ackBoothShare"
          required
          label="I understand booth sharing requires approval."
        />
        <Checkbox
          id="ackLaterDetails"
          name="ackLaterDetails"
          required
          label="I understand final load-in, setup, insurance, furniture, electricity, and operational requirements will be provided later."
        />
        <ConsentCheckbox
          label={
            <>
              By submitting this application, you agree that Midwest Pixel Fest
              may contact you regarding this application. Read our{" "}
              <Link
                href="/privacy"
                className="text-cyan underline-offset-2 hover:underline"
              >
                Privacy
              </Link>{" "}
              page for how we handle this information.
            </>
          }
        />
      </ApplicationSection>

      <ApplicationSection
        id="apply-signature"
        number="08"
        title="Signature"
        description="This application is not the final vendor agreement."
      >
        <TextInput
          id="apply-legal-name"
          name="legalName"
          label="Applicant Full Legal Name"
          required
          autoComplete="name"
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="apply-signature-business"
          name="signatureBusinessName"
          label="Business / Artist Name"
          required
          autoComplete="organization"
          maxLength={FIELD_LIMITS.medium}
        />
        <TextInput
          id="apply-electronic-signature"
          name="electronicSignature"
          label="Electronic Signature"
          required
          hint="Type your name as your electronic signature."
          maxLength={FIELD_LIMITS.short}
        />
        <TextInput
          id="apply-signature-date"
          name="signatureDate"
          label="Date"
          type="date"
          required
        />
        <Checkbox
          id="signatureAuthAck"
          name="signatureAuthAck"
          required
          label="By typing my name above, I confirm that I am authorized to submit this application and that the information provided is accurate."
        />
        <p className="text-sm text-muted">
          This application is not the final vendor agreement.
        </p>
      </ApplicationSection>
    </InquiryForm>
  );
}
