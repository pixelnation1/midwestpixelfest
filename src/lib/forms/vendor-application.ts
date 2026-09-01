import { randomBytes } from "node:crypto";
import {
  APPLICATION_COUNTRIES,
  APPLICATION_PRIMARY_CATEGORIES,
  INSURANCE_STATUSES,
  MERCHANDISE_MIX_RANGES,
  OFFICIAL_APPLICATION_TYPES,
  ORIGINAL_WORK_PERCENTAGES,
  PRODUCTION_METHODS,
  VENDOR_INVENTORY_TYPES,
  DISPLAY_ELEMENTS,
  YES_NO,
  type OfficialApplicationType,
} from "@/lib/vendor-application";
import {
  artistApplicationsOpen,
  spacesForApplicationType,
  vendorApplicationsOpen,
  vendorSpaces,
} from "@/lib/vendors";
import {
  FIELD_LIMITS,
  type FieldErrors,
  optionalText,
  optionalUrl,
  readString,
  readStrings,
  requireChecked,
  requireOneOf,
  requiredDate,
  requiredInteger,
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

function checkedFlag(value: string): string {
  return value === "on" ? "yes" : "";
}

function allowedList(values: string[], options: readonly string[]): string[] {
  return values.filter((value) => options.includes(value));
}

export function createApplicationReference(): string {
  return `MPF-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function isOfficialApplicationType(
  value: string,
): value is OfficialApplicationType {
  return (OFFICIAL_APPLICATION_TYPES as readonly string[]).includes(value);
}

/**
 * Parse and validate an official vendor/artist application.
 * Does not persist records. Delivery happens through the existing form pipeline.
 */
export function parseVendorApplication(formData: FormData): {
  errors: FieldErrors;
  fields: Record<string, string | string[]>;
} {
  const errors: FieldErrors = {};
  const fields: Record<string, string | string[]> = {};

  const applicationType = clean(readString(formData, "applicationType"));
  addError(
    errors,
    "applicationType",
    requireOneOf(applicationType, OFFICIAL_APPLICATION_TYPES, "an application type"),
  );

  if (isOfficialApplicationType(applicationType)) {
    if (applicationType === "Vendor Hall" && !vendorApplicationsOpen) {
      errors.applicationType =
        "Vendor Hall applications are not open yet. Register interest to be notified.";
    }
    if (applicationType === "Artist Alley" && !artistApplicationsOpen) {
      errors.applicationType =
        "Artist Alley applications are not open yet. Register interest to be notified.";
    }
  }

  const contactName = clean(readString(formData, "contactName"));
  const businessName = clean(readString(formData, "businessName"));
  const email = clean(readString(formData, "email"));
  const phone = clean(readString(formData, "phone"));
  const website = clean(readString(formData, "website"));
  const socialPrimary = clean(readString(formData, "socialPrimary"));
  const socialAdditional = clean(readString(formData, "socialAdditional"));
  const street = clean(readString(formData, "street"));
  const city = clean(readString(formData, "city"));
  const state = clean(readString(formData, "state"));
  const zip = clean(readString(formData, "zip"));
  const country = clean(readString(formData, "country"));

  addError(errors, "contactName", requiredText(contactName, "a contact name"));
  addError(
    errors,
    "businessName",
    requiredText(businessName, "a business or artist name", FIELD_LIMITS.medium),
  );
  addError(errors, "email", validateEmail(email));
  addError(errors, "phone", requiredText(phone, "a phone number", FIELD_LIMITS.phone));
  addError(errors, "website", optionalUrl(website));
  addError(errors, "socialPrimary", optionalText(socialPrimary, "Primary social media", FIELD_LIMITS.url));
  addError(
    errors,
    "socialAdditional",
    optionalText(socialAdditional, "Additional social media", FIELD_LIMITS.url),
  );
  addError(errors, "street", requiredText(street, "a street address", FIELD_LIMITS.medium));
  addError(errors, "city", requiredText(city, "a city"));
  addError(errors, "state", requiredText(state, "a state, province, or region"));
  addError(errors, "zip", requiredText(zip, "a ZIP or postal code", 20));
  addError(errors, "country", requireOneOf(country, APPLICATION_COUNTRIES, "a country"));

  const businessDescription = clean(readString(formData, "businessDescription"));
  const yearsActive = clean(readString(formData, "yearsActive"));
  const vendedBefore = clean(readString(formData, "vendedBefore"));
  const priorEvents = clean(readString(formData, "priorEvents"));
  addError(
    errors,
    "businessDescription",
    requiredText(businessDescription, "a business, artwork, or brand description", FIELD_LIMITS.message),
  );
  addError(errors, "yearsActive", optionalText(yearsActive, "Years in business / creating"));
  addError(errors, "vendedBefore", requireOneOf(vendedBefore, YES_NO, "whether you have vended at conventions before"));
  addError(errors, "priorEvents", optionalText(priorEvents, "Events you've participated in", FIELD_LIMITS.message));

  const primaryCategory = clean(readString(formData, "primaryCategory"));
  const secondaryCategories = allowedList(
    readStrings(formData, "secondaryCategories"),
    APPLICATION_PRIMARY_CATEGORIES,
  );
  const whatYouSell = clean(readString(formData, "whatYouSell"));
  const mixOriginal = clean(readString(formData, "mixOriginal"));
  const mixLicensed = clean(readString(formData, "mixLicensed"));
  const mixSecondhand = clean(readString(formData, "mixSecondhand"));
  const mixOther = clean(readString(formData, "mixOther"));

  addError(
    errors,
    "primaryCategory",
    requireOneOf(primaryCategory, APPLICATION_PRIMARY_CATEGORIES, "a primary category"),
  );
  addError(
    errors,
    "whatYouSell",
    requiredText(whatYouSell, "what you plan to sell", FIELD_LIMITS.message),
  );
  addError(errors, "mixOriginal", requireOneOf(mixOriginal, MERCHANDISE_MIX_RANGES, "an original / self-created range"));
  addError(
    errors,
    "mixLicensed",
    requireOneOf(mixLicensed, MERCHANDISE_MIX_RANGES, "a licensed retail merchandise range"),
  );
  addError(
    errors,
    "mixSecondhand",
    requireOneOf(mixSecondhand, MERCHANDISE_MIX_RANGES, "a secondhand / vintage / collectible range"),
  );
  addError(errors, "mixOther", requireOneOf(mixOther, MERCHANDISE_MIX_RANGES, "an other merchandise range"));

  const ownWorkMajority = clean(readString(formData, "ownWorkMajority"));
  const ownWorkPercent = clean(readString(formData, "ownWorkPercent"));
  const offersCommissions = clean(readString(formData, "offersCommissions"));
  const productionMethod = clean(readString(formData, "productionMethod"));
  const inventoryTypes = allowedList(readStrings(formData, "inventoryTypes"), VENDOR_INVENTORY_TYPES);
  const mysteryMerchandise = clean(readString(formData, "mysteryMerchandise"));
  const mysteryDescription = clean(readString(formData, "mysteryDescription"));

  if (applicationType === "Artist Alley") {
    addError(
      errors,
      "ownWorkMajority",
      requireOneOf(
        ownWorkMajority,
        YES_NO,
        "whether the majority of the work you plan to sell is created or designed by you",
      ),
    );
    addError(
      errors,
      "ownWorkPercent",
      requireOneOf(ownWorkPercent, ORIGINAL_WORK_PERCENTAGES, "the percentage of original work"),
    );
    addError(
      errors,
      "offersCommissions",
      requireOneOf(offersCommissions, YES_NO, "whether you offer commissions"),
    );
    addError(
      errors,
      "productionMethod",
      requireOneOf(productionMethod, PRODUCTION_METHODS, "how you create your products"),
    );
  } else {
    addError(errors, "ownWorkMajority", optionalText(ownWorkMajority, "Own-work majority"));
    addError(errors, "ownWorkPercent", optionalText(ownWorkPercent, "Original work percentage"));
    addError(errors, "offersCommissions", optionalText(offersCommissions, "Commissions"));
    addError(errors, "productionMethod", optionalText(productionMethod, "Production method"));
  }

  if (applicationType === "Vendor Hall") {
    if (inventoryTypes.length === 0) {
      errors.inventoryTypes = "Choose at least one inventory type.";
    }
    addError(
      errors,
      "mysteryMerchandise",
      requireOneOf(
        mysteryMerchandise,
        YES_NO,
        "whether you sell mystery boxes, packs, repacks, or randomized merchandise",
      ),
    );
    if (mysteryMerchandise === "Yes") {
      addError(
        errors,
        "mysteryDescription",
        requiredText(mysteryDescription, "a description of your mystery or randomized merchandise", FIELD_LIMITS.message),
      );
    } else {
      addError(
        errors,
        "mysteryDescription",
        optionalText(mysteryDescription, "Mystery merchandise description", FIELD_LIMITS.message),
      );
    }
  } else {
    addError(errors, "mysteryMerchandise", optionalText(mysteryMerchandise, "Mystery merchandise"));
    addError(
      errors,
      "mysteryDescription",
      optionalText(mysteryDescription, "Mystery merchandise description", FIELD_LIMITS.message),
    );
  }

  const spaceRequest = clean(readString(formData, "spaceRequest"));
  const allowedSpaces = isOfficialApplicationType(applicationType)
    ? spacesForApplicationType(applicationType).map((space) => space.id)
    : [];
  addError(errors, "spaceRequest", requireOneOf(spaceRequest, allowedSpaces, "a preferred space"));
  const selectedSpace = vendorSpaces.find((space) => space.id === spaceRequest);
  const spaceRequestLabel = selectedSpace
    ? `${selectedSpace.name}${selectedSpace.dimensions ? ` — ${selectedSpace.dimensions}` : ""}`
    : spaceRequest;

  const additionalSpace = clean(readString(formData, "additionalSpace"));
  const additionalSpaceDetails = clean(readString(formData, "additionalSpaceDetails"));
  addError(
    errors,
    "additionalSpace",
    requireOneOf(additionalSpace, YES_NO, "whether you would like to request additional space"),
  );
  if (additionalSpace === "Yes") {
    addError(
      errors,
      "additionalSpaceDetails",
      requiredText(additionalSpaceDetails, "details about the additional space request", FIELD_LIMITS.message),
    );
  } else {
    addError(
      errors,
      "additionalSpaceDetails",
      optionalText(additionalSpaceDetails, "Additional space details", FIELD_LIMITS.message),
    );
  }

  const extraBadges = clean(readString(formData, "extraBadges"));
  const extraTables = clean(readString(formData, "extraTables"));
  const electricityRequested = clean(readString(formData, "electricityRequested"));
  addError(errors, "extraBadges", requiredInteger(extraBadges, "extra vendor badges requested", 0, 20));
  addError(errors, "extraTables", requiredInteger(extraTables, "extra tables requested", 0, 10));
  addError(
    errors,
    "electricityRequested",
    requireOneOf(electricityRequested, YES_NO, "whether you are requesting electricity"),
  );

  const primaryRepName = clean(readString(formData, "primaryRepName"));
  const additionalRepNames = clean(readString(formData, "additionalRepNames"));
  addError(errors, "primaryRepName", requiredText(primaryRepName, "the primary booth representative name"));
  addError(
    errors,
    "additionalRepNames",
    optionalText(additionalRepNames, "Additional representative names", FIELD_LIMITS.medium),
  );

  const tallDisplays = clean(readString(formData, "tallDisplays"));
  const tallDisplayDescription = clean(readString(formData, "tallDisplayDescription"));
  const displayElements = allowedList(readStrings(formData, "displayElements"), DISPLAY_ELEMENTS);
  const boothSetupNotes = clean(readString(formData, "boothSetupNotes"));
  addError(
    errors,
    "tallDisplays",
    requireOneOf(tallDisplays, YES_NO, "whether you plan to use displays taller than 8 feet"),
  );
  if (tallDisplays === "Yes") {
    addError(
      errors,
      "tallDisplayDescription",
      requiredText(tallDisplayDescription, "a description of displays taller than 8 feet", FIELD_LIMITS.message),
    );
  } else {
    addError(
      errors,
      "tallDisplayDescription",
      optionalText(tallDisplayDescription, "Tall display description", FIELD_LIMITS.message),
    );
  }
  addError(errors, "boothSetupNotes", optionalText(boothSetupNotes, "Planned booth setup", FIELD_LIMITS.message));

  const merchandisePolicy = readString(formData, "merchandisePolicy");
  addError(
    errors,
    "merchandisePolicy",
    requireChecked(merchandisePolicy, "Confirm you will not sell prohibited or unlawful merchandise."),
  );

  const aiGenerated = clean(readString(formData, "aiGenerated"));
  const aiDescription = clean(readString(formData, "aiDescription"));
  addError(
    errors,
    "aiGenerated",
    requireOneOf(
      aiGenerated,
      YES_NO,
      "whether any artwork or merchandise will include primarily AI-generated imagery",
    ),
  );
  if (aiGenerated === "Yes") {
    addError(
      errors,
      "aiDescription",
      requiredText(aiDescription, "a brief explanation of AI-generated imagery", FIELD_LIMITS.message),
    );
  } else {
    addError(errors, "aiDescription", optionalText(aiDescription, "AI-generated imagery explanation", FIELD_LIMITS.message));
  }

  const sellsFood = clean(readString(formData, "sellsFood"));
  addError(
    errors,
    "sellsFood",
    requireOneOf(sellsFood, YES_NO, "whether you intend to sell food or beverages"),
  );

  const taxAcknowledgment = readString(formData, "taxAcknowledgment");
  addError(
    errors,
    "taxAcknowledgment",
    requireChecked(
      taxAcknowledgment,
      "Acknowledge that vendors are responsible for applicable Kansas and local tax, licensing, permit, and business requirements.",
    ),
  );

  const insuranceStatus = clean(readString(formData, "insuranceStatus"));
  addError(
    errors,
    "insuranceStatus",
    requireOneOf(insuranceStatus, INSURANCE_STATUSES, "current insurance status"),
  );

  const boothSharing = clean(readString(formData, "boothSharing"));
  const shareBusinessName = clean(readString(formData, "shareBusinessName"));
  const shareContactName = clean(readString(formData, "shareContactName"));
  const shareEmail = clean(readString(formData, "shareEmail"));
  const shareDescription = clean(readString(formData, "shareDescription"));
  addError(
    errors,
    "boothSharing",
    requireOneOf(boothSharing, YES_NO, "whether you will share your booth"),
  );
  if (boothSharing === "Yes") {
    addError(
      errors,
      "shareBusinessName",
      requiredText(shareBusinessName, "the other business or artist name", FIELD_LIMITS.medium),
    );
    addError(errors, "shareContactName", requiredText(shareContactName, "a contact person for the other business or artist"));
    addError(errors, "shareEmail", validateEmail(shareEmail));
    addError(
      errors,
      "shareDescription",
      requiredText(shareDescription, "what they will sell", FIELD_LIMITS.message),
    );
  } else {
    addError(errors, "shareBusinessName", optionalText(shareBusinessName, "Shared business / artist name", FIELD_LIMITS.medium));
    addError(errors, "shareContactName", optionalText(shareContactName, "Shared contact person"));
    addError(errors, "shareEmail", optionalText(shareEmail, "Shared contact email"));
    addError(errors, "shareDescription", optionalText(shareDescription, "Shared merchandise description", FIELD_LIMITS.message));
  }

  const hoursCommitment = clean(readString(formData, "hoursCommitment"));
  const hoursExplanation = clean(readString(formData, "hoursExplanation"));
  addError(
    errors,
    "hoursCommitment",
    requireOneOf(
      hoursCommitment,
      YES_NO,
      "whether you can commit to required hours for both event days",
    ),
  );
  if (hoursCommitment === "No") {
    addError(
      errors,
      "hoursExplanation",
      requiredText(hoursExplanation, "an explanation of your hours limitation", FIELD_LIMITS.message),
    );
  } else {
    addError(errors, "hoursExplanation", optionalText(hoursExplanation, "Hours explanation", FIELD_LIMITS.message));
  }

  addError(
    errors,
    "cancellationAck",
    requireChecked(
      readString(formData, "cancellationAck"),
      "Acknowledge that cancellation and refund terms will be provided with the acceptance offer before payment is required.",
    ),
  );
  addError(
    errors,
    "noPaymentAck",
    requireChecked(
      readString(formData, "noPaymentAck"),
      "Acknowledge that submitting this application does not require payment and does not reserve a booth.",
    ),
  );
  addError(
    errors,
    "paymentIfApprovedAck",
    requireChecked(
      readString(formData, "paymentIfApprovedAck"),
      "Acknowledge that if approved, you must complete payment by the deadline provided to secure your space.",
    ),
  );

  addError(
    errors,
    "ackAccurate",
    requireChecked(readString(formData, "ackAccurate"), "Certify that the information in this application is accurate."),
  );
  addError(
    errors,
    "ackNoGuarantee",
    requireChecked(
      readString(formData, "ackNoGuarantee"),
      "Acknowledge that submitting an application does not guarantee acceptance.",
    ),
  );
  addError(
    errors,
    "ackSpaceAssignment",
    requireChecked(
      readString(formData, "ackSpaceAssignment"),
      "Acknowledge that space assignments are determined by Midwest Pixel Fest.",
    ),
  );
  addError(
    errors,
    "ackEventRules",
    requireChecked(readString(formData, "ackEventRules"), "Agree to follow event and venue rules."),
  );
  addError(
    errors,
    "ackProhibitedRemoval",
    requireChecked(
      readString(formData, "ackProhibitedRemoval"),
      "Acknowledge that prohibited merchandise may be required to be removed.",
    ),
  );
  addError(
    errors,
    "ackLegal",
    requireChecked(
      readString(formData, "ackLegal"),
      "Acknowledge that vendors are responsible for applicable legal, licensing, and tax obligations.",
    ),
  );
  addError(
    errors,
    "ackBoothShare",
    requireChecked(
      readString(formData, "ackBoothShare"),
      "Acknowledge that booth sharing requires approval.",
    ),
  );
  addError(
    errors,
    "ackLaterDetails",
    requireChecked(
      readString(formData, "ackLaterDetails"),
      "Acknowledge that final load-in, setup, insurance, furniture, electricity, and operational requirements will be provided later.",
    ),
  );

  const legalName = clean(readString(formData, "legalName"));
  const signatureBusinessName = clean(readString(formData, "signatureBusinessName"));
  const electronicSignature = clean(readString(formData, "electronicSignature"));
  const signatureDate = clean(readString(formData, "signatureDate"));
  addError(errors, "legalName", requiredText(legalName, "your full legal name"));
  addError(
    errors,
    "signatureBusinessName",
    requiredText(signatureBusinessName, "the business or artist name", FIELD_LIMITS.medium),
  );
  addError(errors, "electronicSignature", requiredText(electronicSignature, "an electronic signature"));
  addError(errors, "signatureDate", requiredDate(signatureDate, "the signature date"));
  addError(
    errors,
    "signatureAuthAck",
    requireChecked(
      readString(formData, "signatureAuthAck"),
      "Confirm that you are authorized to submit this application and that the information provided is accurate.",
    ),
  );

  Object.assign(fields, {
    applicationType,
    contactName,
    businessName,
    email,
    phone,
    website,
    socialPrimary,
    socialAdditional,
    street,
    city,
    state,
    zip,
    country,
    businessDescription,
    yearsActive,
    vendedBefore,
    priorEvents,
    primaryCategory,
    secondaryCategories,
    whatYouSell,
    mixOriginal,
    mixLicensed,
    mixSecondhand,
    mixOther,
    ownWorkMajority,
    ownWorkPercent,
    offersCommissions,
    productionMethod,
    inventoryTypes,
    mysteryMerchandise,
    mysteryDescription,
    spaceRequest,
    spaceRequestLabel,
    additionalSpace,
    additionalSpaceDetails,
    extraBadges,
    extraTables,
    electricityRequested,
    primaryRepName,
    additionalRepNames,
    tallDisplays,
    tallDisplayDescription,
    displayElements,
    boothSetupNotes,
    merchandisePolicy: checkedFlag(merchandisePolicy),
    aiGenerated,
    aiDescription,
    sellsFood,
    taxAcknowledgment: checkedFlag(taxAcknowledgment),
    insuranceStatus,
    boothSharing,
    shareBusinessName,
    shareContactName,
    shareEmail,
    shareDescription,
    hoursCommitment,
    hoursExplanation,
    cancellationAck: checkedFlag(readString(formData, "cancellationAck")),
    noPaymentAck: checkedFlag(readString(formData, "noPaymentAck")),
    paymentIfApprovedAck: checkedFlag(readString(formData, "paymentIfApprovedAck")),
    ackAccurate: checkedFlag(readString(formData, "ackAccurate")),
    ackNoGuarantee: checkedFlag(readString(formData, "ackNoGuarantee")),
    ackSpaceAssignment: checkedFlag(readString(formData, "ackSpaceAssignment")),
    ackEventRules: checkedFlag(readString(formData, "ackEventRules")),
    ackProhibitedRemoval: checkedFlag(readString(formData, "ackProhibitedRemoval")),
    ackLegal: checkedFlag(readString(formData, "ackLegal")),
    ackBoothShare: checkedFlag(readString(formData, "ackBoothShare")),
    ackLaterDetails: checkedFlag(readString(formData, "ackLaterDetails")),
    legalName,
    signatureBusinessName,
    electronicSignature,
    signatureDate,
    signatureAuthAck: checkedFlag(readString(formData, "signatureAuthAck")),
  });

  return { errors, fields };
}
