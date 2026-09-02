import {
  canUseSponsorshipCommitmentForm,
  getSponsorshipLevelOptions,
  sponsorshipPackages,
} from "@/lib/sponsorships";
import {
  FIELD_LIMITS,
  type FieldErrors,
  optionalProposedAmount,
  optionalText,
  readString,
  requireChecked,
  requiredDate,
  requiredText,
  stripControlChars,
  validateEmail,
} from "@/lib/forms/validate";

function clean(value: string): string {
  return stripControlChars(value).trim();
}

function addError(errors: FieldErrors, key: string, message: string | null) {
  if (message) errors[key] = message;
}

const PACKAGE_NAMES = sponsorshipPackages.map((pkg) => pkg.name);

export function parseSponsorCommitment(formData: FormData): {
  errors: FieldErrors;
  fields: Record<string, string | string[]>;
} {
  const errors: FieldErrors = {};
  const fields: Record<string, string | string[]> = {};

  if (!canUseSponsorshipCommitmentForm()) {
    errors.form = "The sponsorship commitment form is not available yet.";
    return { errors, fields };
  }

  const businessName = clean(readString(formData, "businessName"));
  const representativeName = clean(readString(formData, "representativeName"));
  const representativeTitle = clean(readString(formData, "representativeTitle"));
  const email = clean(readString(formData, "email"));
  const phone = clean(readString(formData, "phone"));
  const businessAddress = clean(readString(formData, "businessAddress"));
  const agreedLevel = clean(readString(formData, "agreedLevel"));
  const agreedAmount = clean(readString(formData, "agreedAmount"));
  const approvedArea = clean(readString(formData, "approvedArea"));
  const includedBenefitsSummary = clean(readString(formData, "includedBenefitsSummary"));
  const customBenefitsSummary = clean(readString(formData, "customBenefitsSummary"));
  const signature = clean(readString(formData, "electronicSignature"));
  const signatureDate = clean(readString(formData, "signatureDate"));

  addError(errors, "businessName", requiredText(businessName, "a business or organization name", FIELD_LIMITS.medium));
  addError(errors, "representativeName", requiredText(representativeName, "an authorized representative name"));
  addError(errors, "representativeTitle", requiredText(representativeTitle, "a title or role"));
  addError(errors, "email", validateEmail(email));
  addError(errors, "phone", optionalText(phone, "Phone", FIELD_LIMITS.phone));
  addError(errors, "businessAddress", requiredText(businessAddress, "a business address", FIELD_LIMITS.medium));
  const levelOptions = [...PACKAGE_NAMES, ...getSponsorshipLevelOptions()];
  if (!PACKAGE_NAMES.includes(agreedLevel) && !levelOptions.includes(agreedLevel)) {
    errors.agreedLevel = "Choose the agreed sponsorship level.";
  }
  addError(errors, "agreedAmount", optionalProposedAmount(agreedAmount) ?? (agreedAmount ? null : "Enter the agreed sponsorship amount."));
  addError(errors, "approvedArea", optionalText(approvedArea, "Approved sponsorship area"));
  addError(
    errors,
    "includedBenefitsSummary",
    requiredText(includedBenefitsSummary, "a summary of included benefits", FIELD_LIMITS.message),
  );
  addError(errors, "customBenefitsSummary", optionalText(customBenefitsSummary, "Approved custom benefits", FIELD_LIMITS.message));
  addError(errors, "paymentTermsAck", requireChecked(readString(formData, "paymentTermsAck"), "Confirm the payment terms."));
  addError(
    errors,
    "marketingAssetsAck",
    requireChecked(readString(formData, "marketingAssetsAck"), "Confirm that marketing assets will be provided."),
  );
  addError(
    errors,
    "agreementAck",
    requireChecked(
      readString(formData, "agreementAck"),
      "Confirm this commitment is subject to the final sponsorship agreement.",
    ),
  );
  addError(errors, "electronicSignature", requiredText(signature, "an electronic signature"));
  addError(errors, "signatureDate", requiredDate(signatureDate, "signature date"));

  Object.assign(fields, {
    businessName,
    representativeName,
    representativeTitle,
    email,
    phone,
    businessAddress,
    agreedLevel,
    agreedAmount,
    approvedArea,
    includedBenefitsSummary,
    customBenefitsSummary,
    electronicSignature: signature,
    signatureDate,
    paymentTermsAck: "yes",
    marketingAssetsAck: "yes",
    agreementAck: "yes",
  });

  return { errors, fields };
}
