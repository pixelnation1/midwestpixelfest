import type { FormKind } from "@/lib/forms/validate";

export const OPERATIONAL_FORM_KINDS = [
  "contact",
  "vendor_interest",
  "vendor_application",
  "sponsor_inquiry",
  "sponsor_commitment",
  "sponsor_assets",
  "volunteer_interest",
  "guest_inquiry",
  "press_inquiry",
] as const satisfies readonly FormKind[];

export type OperationalFormKind = (typeof OPERATIONAL_FORM_KINDS)[number];

export function isOperationalFormKind(
  kind: FormKind,
): kind is OperationalFormKind {
  return (OPERATIONAL_FORM_KINDS as readonly string[]).includes(kind);
}

function headerSafe(value: string, max = 80): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function namedSubjectSuffix(
  fields: Record<string, string | string[]>,
  key: string,
): string {
  const raw = fields[key];
  if (typeof raw !== "string") return "";
  const safe = headerSafe(raw);
  return safe ? ` — ${safe}` : "";
}

export function operationalEmailSubject(
  kind: OperationalFormKind,
  fields: Record<string, string | string[]>,
): string {
  switch (kind) {
    case "contact":
      return "[Midwest Pixel Fest] New Contact Message";
    case "vendor_interest":
      return `[Midwest Pixel Fest] New Vendor Interest${namedSubjectSuffix(fields, "businessName")}`;
    case "sponsor_inquiry":
      return `[Midwest Pixel Fest] New Sponsorship Inquiry${namedSubjectSuffix(fields, "company")}`;
    case "sponsor_commitment":
      return `[Midwest Pixel Fest] Sponsorship Commitment${namedSubjectSuffix(fields, "businessName")}`;
    case "sponsor_assets":
      return `[Midwest Pixel Fest] Sponsor Assets${namedSubjectSuffix(fields, "publicBusinessName")}`;
    case "volunteer_interest":
      return "[Midwest Pixel Fest] New Volunteer Interest";
    case "guest_inquiry":
      return "[Midwest Pixel Fest] New Guest Inquiry";
    case "press_inquiry":
      return "[Midwest Pixel Fest] New Press Inquiry";
    case "vendor_application": {
      const name =
        typeof fields.businessName === "string"
          ? headerSafe(fields.businessName)
          : "";
      const prefix =
        fields.applicationType === "Artist Alley"
          ? "[MPF 2027 Artist Application]"
          : "[MPF 2027 Vendor Application]";
      return name ? `${prefix} ${name}` : prefix;
    }
  }
}

export function operationalSourcePath(
  kind: OperationalFormKind,
  fields: Record<string, string | string[]> = {},
): string {
  switch (kind) {
    case "contact":
      return "/contact";
    case "vendor_interest":
      return "/vendors/interest";
    case "vendor_application":
      return fields.applicationType === "Artist Alley"
        ? "/vendors/apply/artist"
        : "/vendors/apply/vendor";
    case "sponsor_inquiry":
      return "/sponsors/inquiry";
    case "sponsor_commitment":
      return "/sponsors/commitment";
    case "sponsor_assets":
      return "/sponsors/assets";
    case "volunteer_interest":
      return "/volunteer/interest";
    case "guest_inquiry":
      return "/guests/inquiry";
    case "press_inquiry":
      return "/press/inquiry";
  }
}
