export const FORM_KINDS = [
  "newsletter",
  "contact",
  "vendor_interest",
  "sponsor_inquiry",
  "volunteer_interest",
  "guest_inquiry",
  "press_inquiry",
] as const;

export type FormKind = (typeof FORM_KINDS)[number];

export const HONEYPOT_FIELD = "fax_number";

export const FIELD_LIMITS = {
  email: 254,
  short: 120,
  medium: 200,
  url: 400,
  phone: 40,
  select: 80,
  message: 4000,
  bio: 2500,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = Record<string, string>;

export type FormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: FieldErrors;
};

export const idleFormState: FormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function readStrings(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function isHoneypotTriggered(formData: FormData): boolean {
  return readString(formData, HONEYPOT_FIELD).length > 0;
}

export function validateEmail(value: string): string | null {
  if (!value) return "Enter an email address.";
  if (value.length > FIELD_LIMITS.email) return "Email is too long.";
  if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address.";
  return null;
}

export function requiredText(
  value: string,
  label: string,
  max: number = FIELD_LIMITS.short,
): string | null {
  if (!value) return `Enter ${label}.`;
  if (value.length > max) return `${label} is too long.`;
  return null;
}

export function optionalText(
  value: string,
  label: string,
  max: number = FIELD_LIMITS.medium,
): string | null {
  if (!value) return null;
  if (value.length > max) return `${label} is too long.`;
  return null;
}

export function optionalUrl(value: string): string | null {
  if (!value) return null;
  if (value.length > FIELD_LIMITS.url) return "URL is too long.";
  try {
    const parsed = new URL(value.includes("://") ? value : `https://${value}`);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "Enter a valid http or https URL.";
    }
  } catch {
    return "Enter a valid URL.";
  }
  return null;
}

export function optionalEmail(value: string): string | null {
  if (!value) return null;
  return validateEmail(value);
}

/** Reject pasted card/account numbers. Proposed amounts stay short. */
export function optionalProposedAmount(value: string): string | null {
  if (!value) return null;
  const lengthError = optionalText(value, "Proposed sponsorship amount", FIELD_LIMITS.short);
  if (lengthError) return lengthError;
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 12) {
    return "Enter a proposed amount, not payment details.";
  }
  return null;
}

export function requireOneOf(
  value: string,
  options: readonly string[],
  label: string,
): string | null {
  if (!value) return `Choose ${label}.`;
  if (!options.includes(value)) return `Choose a valid ${label}.`;
  return null;
}

export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}
