import { parseVendorApplication } from "@/lib/forms/vendor-application";
import {
  AGE_RANGES,
  CONTACT_TYPES,
  COVERAGE_TYPES,
  GUEST_CATEGORIES,
  VENDOR_CATEGORIES,
  VENDOR_TYPES,
  VOLUNTEER_AREAS,
} from "@/lib/forms/options";
import {
  FIELD_LIMITS,
  FORM_KINDS,
  type FieldErrors,
  type FormKind,
  type FormState,
  idleFormState,
  isHoneypotTriggered,
  optionalText,
  optionalEmail,
  optionalProposedAmount,
  optionalUrl,
  readString,
  readStrings,
  requireOneOf,
  requiredText,
  stripControlChars,
  validateEmail,
} from "@/lib/forms/validate";
import {
  getSponsorshipLevelOptions,
  sponsorshipInterestAreas,
} from "@/lib/sponsorships";

function clean(value: string): string {
  return stripControlChars(value).trim();
}

function addError(errors: FieldErrors, key: string, message: string | null) {
  if (message) errors[key] = message;
}

export type ParsedSubmission = {
  kind: FormKind;
  fields: Record<string, string | string[]>;
};

export function parseAndValidate(
  formData: FormData,
):
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: ParsedSubmission }
  | { ok: false; fieldErrors: FieldErrors; message: string } {
  if (isHoneypotTriggered(formData)) {
    return { ok: true, spam: true };
  }

  const kindRaw = readString(formData, "kind");
  if (!FORM_KINDS.includes(kindRaw as FormKind)) {
    return {
      ok: false,
      fieldErrors: {},
      message: "This form could not be submitted. Refresh and try again.",
    };
  }
  const kind = kindRaw as FormKind;
  const errors: FieldErrors = {};
  const fields: Record<string, string | string[]> = {};

  if (kind === "newsletter") {
    const email = clean(readString(formData, "email"));
    const firstName = clean(readString(formData, "firstName"));
    const updates = readString(formData, "updatesConsent");
    addError(errors, "email", validateEmail(email));
    addError(errors, "firstName", optionalText(firstName, "First name"));
    if (updates !== "on") {
      errors.updatesConsent = "Confirm that you want updates.";
    }
    fields.email = email;
    fields.firstName = firstName;
    fields.updatesConsent = "yes";
  }

  if (kind === "contact") {
    const name = clean(readString(formData, "name"));
    const email = clean(readString(formData, "email"));
    const inquiryType = clean(readString(formData, "inquiryType"));
    const message = clean(readString(formData, "message"));
    addError(errors, "name", requiredText(name, "your name"));
    addError(errors, "email", validateEmail(email));
    addError(errors, "inquiryType", requireOneOf(inquiryType, CONTACT_TYPES, "an inquiry type"));
    addError(errors, "message", requiredText(message, "a message", FIELD_LIMITS.message));
    fields.name = name;
    fields.email = email;
    fields.inquiryType = inquiryType;
    fields.message = message;
  }

  if (kind === "vendor_interest") {
    const businessName = clean(readString(formData, "businessName"));
    const contactName = clean(readString(formData, "contactName"));
    const email = clean(readString(formData, "email"));
    const phone = clean(readString(formData, "phone"));
    const website = clean(readString(formData, "website"));
    const socialMedia = clean(readString(formData, "socialMedia"));
    const vendorType = clean(readString(formData, "vendorType"));
    const vendorCategory = clean(readString(formData, "vendorCategory"));
    const whatYouSell = clean(readString(formData, "whatYouSell"));
    const city = clean(readString(formData, "city"));
    const state = clean(readString(formData, "state"));
    const notify = readString(formData, "notifyApplications");
    addError(errors, "contactName", requiredText(contactName, "a contact name"));
    addError(errors, "businessName", requiredText(businessName, "a business or artist name", FIELD_LIMITS.medium));
    addError(errors, "email", validateEmail(email));
    addError(errors, "phone", optionalText(phone, "Phone", FIELD_LIMITS.phone));
    addError(errors, "website", optionalUrl(website));
    addError(errors, "socialMedia", optionalText(socialMedia, "Social media", FIELD_LIMITS.url));
    addError(errors, "vendorType", requireOneOf(vendorType, VENDOR_TYPES, "an applicant type"));
    addError(errors, "vendorCategory", requireOneOf(vendorCategory, VENDOR_CATEGORIES, "a primary category"));
    addError(errors, "whatYouSell", requiredText(whatYouSell, "what you sell or create", FIELD_LIMITS.message));
    addError(errors, "city", optionalText(city, "City"));
    addError(errors, "state", optionalText(state, "State"));
    if (notify !== "on") {
      errors.notifyApplications = "Confirm you want to be notified when applications open.";
    }
    fields.contactName = contactName;
    fields.businessName = businessName;
    fields.email = email;
    fields.phone = phone;
    fields.website = website;
    fields.socialMedia = socialMedia;
    fields.vendorType = vendorType;
    fields.vendorCategory = vendorCategory;
    fields.whatYouSell = whatYouSell;
    fields.city = city;
    fields.state = state;
    fields.notifyApplications = "yes";
  }

  if (kind === "sponsor_inquiry") {
    const company = clean(readString(formData, "company"));
    const contactName = clean(readString(formData, "contactName"));
    const title = clean(readString(formData, "title"));
    const email = clean(readString(formData, "email"));
    const phone = clean(readString(formData, "phone"));
    const website = clean(readString(formData, "website"));
    const address = clean(readString(formData, "address"));
    const city = clean(readString(formData, "city"));
    const state = clean(readString(formData, "state"));
    const zip = clean(readString(formData, "zip"));
    const partnership = clean(readString(formData, "partnership"));
    const proposedAmount = clean(readString(formData, "proposedAmount"));
    const areas = readStrings(formData, "areas").filter((area) =>
      (sponsorshipInterestAreas as readonly string[]).includes(area),
    );
    const otherInterest = clean(readString(formData, "otherInterest"));
    const displayName = clean(readString(formData, "displayName"));
    const displayLink = clean(readString(formData, "displayLink"));
    const marketingContact = clean(readString(formData, "marketingContact"));
    const marketingEmail = clean(readString(formData, "marketingEmail"));
    const notes = clean(readString(formData, "notes"));
    addError(errors, "company", requiredText(company, "a business or organization name", FIELD_LIMITS.medium));
    addError(errors, "contactName", requiredText(contactName, "a contact name"));
    addError(errors, "title", optionalText(title, "Title / position"));
    addError(errors, "email", validateEmail(email));
    addError(errors, "phone", optionalText(phone, "Phone", FIELD_LIMITS.phone));
    addError(errors, "website", optionalUrl(website));
    addError(errors, "address", optionalText(address, "Business address"));
    addError(errors, "city", optionalText(city, "City"));
    addError(errors, "state", optionalText(state, "State"));
    addError(errors, "zip", optionalText(zip, "ZIP", 20));
    addError(
      errors,
      "partnership",
      requireOneOf(partnership, getSponsorshipLevelOptions(), "a sponsorship level"),
    );
    addError(errors, "proposedAmount", optionalProposedAmount(proposedAmount));
    addError(errors, "otherInterest", optionalText(otherInterest, "Other interest"));
    addError(errors, "displayName", optionalText(displayName, "Display name"));
    addError(errors, "displayLink", optionalUrl(displayLink));
    addError(errors, "marketingContact", optionalText(marketingContact, "Marketing contact name"));
    addError(errors, "marketingEmail", optionalEmail(marketingEmail));
    addError(errors, "notes", optionalText(notes, "Notes", FIELD_LIMITS.message));
    Object.assign(fields, {
      company,
      contactName,
      title,
      email,
      phone,
      website,
      address,
      city,
      state,
      zip,
      partnership,
      proposedAmount,
      areas,
      otherInterest,
      displayName,
      displayLink,
      marketingContact,
      marketingEmail,
      notes,
    });
  }

  if (kind === "volunteer_interest") {
    const name = clean(readString(formData, "name"));
    const email = clean(readString(formData, "email"));
    const ageRange = clean(readString(formData, "ageRange"));
    const areas = readStrings(formData, "areas").filter((area) =>
      (VOLUNTEER_AREAS as readonly string[]).includes(area),
    );
    const availability = clean(readString(formData, "availability"));
    const experience = clean(readString(formData, "experience"));
    addError(errors, "name", requiredText(name, "your name"));
    addError(errors, "email", validateEmail(email));
    addError(errors, "ageRange", requireOneOf(ageRange, AGE_RANGES, "an age range"));
    if (areas.length === 0) errors.areas = "Choose at least one area of interest.";
    addError(errors, "availability", optionalText(availability, "Availability", FIELD_LIMITS.message));
    addError(errors, "experience", optionalText(experience, "Experience", FIELD_LIMITS.message));
    fields.name = name;
    fields.email = email;
    fields.ageRange = ageRange;
    fields.areas = areas;
    fields.availability = availability;
    fields.experience = experience;
  }

  if (kind === "guest_inquiry") {
    const name = clean(readString(formData, "name"));
    const stageName = clean(readString(formData, "stageName"));
    const email = clean(readString(formData, "email"));
    const website = clean(readString(formData, "website"));
    const social = clean(readString(formData, "social"));
    const category = clean(readString(formData, "category"));
    const bio = clean(readString(formData, "bio"));
    const why = clean(readString(formData, "why"));
    const needs = clean(readString(formData, "needs"));
    addError(errors, "name", requiredText(name, "your name"));
    addError(errors, "stageName", optionalText(stageName, "Professional name"));
    addError(errors, "email", validateEmail(email));
    addError(errors, "website", optionalUrl(website));
    addError(errors, "social", optionalUrl(social));
    addError(errors, "category", requireOneOf(category, GUEST_CATEGORIES, "a category"));
    addError(errors, "bio", optionalText(bio, "Bio", FIELD_LIMITS.bio));
    addError(errors, "why", requiredText(why, "why you are interested", FIELD_LIMITS.message));
    addError(errors, "needs", optionalText(needs, "Appearance notes", FIELD_LIMITS.message));
    Object.assign(fields, {
      name,
      stageName,
      email,
      website,
      social,
      category,
      bio,
      why,
      needs,
    });
  }

  if (kind === "press_inquiry") {
    const name = clean(readString(formData, "name"));
    const outlet = clean(readString(formData, "outlet"));
    const email = clean(readString(formData, "email"));
    const website = clean(readString(formData, "website"));
    const coverageType = clean(readString(formData, "coverageType"));
    const audience = clean(readString(formData, "audience"));
    const notes = clean(readString(formData, "notes"));
    addError(errors, "name", requiredText(name, "your name"));
    addError(errors, "outlet", requiredText(outlet, "an outlet or channel", FIELD_LIMITS.medium));
    addError(errors, "email", validateEmail(email));
    addError(
      errors,
      "website",
      requiredText(website, "a website or channel URL", FIELD_LIMITS.url) ??
        optionalUrl(website),
    );
    addError(errors, "coverageType", requireOneOf(coverageType, COVERAGE_TYPES, "a coverage type"));
    addError(errors, "audience", optionalText(audience, "Audience / reach", FIELD_LIMITS.medium));
    addError(errors, "notes", optionalText(notes, "Notes", FIELD_LIMITS.message));
    Object.assign(fields, {
      name,
      outlet,
      email,
      website,
      coverageType,
      audience,
      notes,
    });
  }

  if (kind === "vendor_application") {
    const parsed = parseVendorApplication(formData);
    Object.assign(errors, parsed.errors);
    Object.assign(fields, parsed.fields);
  }

  const consent = readString(formData, "contactConsent");
  if (kind !== "newsletter" && consent !== "on") {
    errors.contactConsent =
      kind === "sponsor_inquiry"
        ? "Confirm that this inquiry does not create a sponsorship agreement."
        : kind === "vendor_application"
          ? "Confirm that we may contact you about this application."
          : "Confirm that we may contact you about this inquiry.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      fieldErrors: errors,
      message: "Check the highlighted fields and try again.",
    };
  }

  const serialized = JSON.stringify(fields);
  const maxJson = kind === "vendor_application" ? 100_000 : 20_000;
  if (serialized.length > maxJson) {
    return {
      ok: false,
      fieldErrors: {},
      message: "This submission is too large. Shorten your answers and try again.",
    };
  }

  return { ok: true, spam: false, data: { kind, fields } };
}

export function errorState(message: string, fieldErrors: FieldErrors = {}): FormState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): FormState {
  return { status: "success", message, fieldErrors: {} };
}

export { idleFormState };
