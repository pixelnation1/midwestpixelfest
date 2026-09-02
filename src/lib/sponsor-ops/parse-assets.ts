import { canUseSponsorshipAssetForm } from "@/lib/sponsorships";
import {
  FIELD_LIMITS,
  type FieldErrors,
  optionalText,
  optionalUrl,
  readString,
  requiredText,
  stripControlChars,
  validateEmail,
} from "@/lib/forms/validate";
import { SPONSOR_PUBLIC_DESCRIPTION_MAX } from "@/lib/sponsor-ops/assets";

function clean(value: string): string {
  return stripControlChars(value).trim();
}

function addError(errors: FieldErrors, key: string, message: string | null) {
  if (message) errors[key] = message;
}

export function parseSponsorAssets(formData: FormData): {
  errors: FieldErrors;
  fields: Record<string, string | string[]>;
} {
  const errors: FieldErrors = {};
  const fields: Record<string, string | string[]> = {};

  if (!canUseSponsorshipAssetForm()) {
    errors.form = "Sponsor asset collection is not open for public upload yet.";
    return { errors, fields };
  }

  const publicBusinessName = clean(readString(formData, "publicBusinessName"));
  const website = clean(readString(formData, "website"));
  const primarySocialUrl = clean(readString(formData, "primarySocialUrl"));
  const additionalSocialUrl = clean(readString(formData, "additionalSocialUrl"));
  const publicDescription = clean(readString(formData, "publicDescription"));
  const marketingContactName = clean(readString(formData, "marketingContactName"));
  const marketingContactEmail = clean(readString(formData, "marketingContactEmail"));
  const marketingContactPhone = clean(readString(formData, "marketingContactPhone"));
  const preferredPublicUrl = clean(readString(formData, "preferredPublicUrl"));
  const brandGuidelinesUrl = clean(readString(formData, "brandGuidelinesUrl"));

  addError(
    errors,
    "publicBusinessName",
    requiredText(publicBusinessName, "an official public business name", FIELD_LIMITS.medium),
  );
  addError(errors, "website", requiredText(website, "a website", FIELD_LIMITS.url) ?? optionalUrl(website));
  addError(errors, "primarySocialUrl", optionalUrl(primarySocialUrl));
  addError(errors, "additionalSocialUrl", optionalUrl(additionalSocialUrl));
  addError(
    errors,
    "publicDescription",
    requiredText(publicDescription, "a public sponsor description", SPONSOR_PUBLIC_DESCRIPTION_MAX),
  );
  addError(errors, "marketingContactName", requiredText(marketingContactName, "a primary marketing contact"));
  addError(errors, "marketingContactEmail", validateEmail(marketingContactEmail));
  addError(errors, "marketingContactPhone", optionalText(marketingContactPhone, "Marketing contact phone", FIELD_LIMITS.phone));
  addError(
    errors,
    "preferredPublicUrl",
    requiredText(preferredPublicUrl, "a preferred public URL", FIELD_LIMITS.url) ?? optionalUrl(preferredPublicUrl),
  );
  addError(errors, "brandGuidelinesUrl", optionalUrl(brandGuidelinesUrl));

  Object.assign(fields, {
    publicBusinessName,
    website,
    primarySocialUrl,
    additionalSocialUrl,
    publicDescription,
    marketingContactName,
    marketingContactEmail,
    marketingContactPhone,
    preferredPublicUrl,
    brandGuidelinesUrl,
  });

  return { errors, fields };
}
