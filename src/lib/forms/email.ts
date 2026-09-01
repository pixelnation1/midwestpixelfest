import "server-only";

import { Resend } from "resend";
import type { DeliveryPayload, DeliveryResult } from "@/lib/forms/types";
import type { FormKind } from "@/lib/forms/validate";
import { validateEmail } from "@/lib/forms/validate";

const OPERATIONAL_KINDS = [
  "contact",
  "vendor_interest",
  "vendor_application",
  "sponsor_inquiry",
  "volunteer_interest",
  "guest_inquiry",
  "press_inquiry",
] as const satisfies readonly FormKind[];

type OperationalKind = (typeof OPERATIONAL_KINDS)[number];

const SUBJECTS: Record<OperationalKind, string> = {
  contact: "[Midwest Pixel Fest] General Contact",
  vendor_interest: "[Midwest Pixel Fest] Vendor Interest",
  vendor_application: "[MPF 2027 Vendor Application]",
  sponsor_inquiry: "[Midwest Pixel Fest] Sponsorship Inquiry",
  volunteer_interest: "[Midwest Pixel Fest] Volunteer Interest",
  guest_inquiry: "[Midwest Pixel Fest] Guest Inquiry",
  press_inquiry: "[Midwest Pixel Fest] Press Inquiry",
};

function headerSafe(value: string, max = 80): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function emailSubject(payload: DeliveryPayload, kind: OperationalKind): string {
  if (kind === "sponsor_inquiry") {
    const company =
      typeof payload.fields.company === "string"
        ? headerSafe(payload.fields.company)
        : "";
    return company
      ? `[Midwest Pixel Fest] Sponsorship Inquiry — ${company}`
      : SUBJECTS.sponsor_inquiry;
  }
  if (kind === "vendor_application") {
    const business =
      typeof payload.fields.businessName === "string"
        ? headerSafe(payload.fields.businessName)
        : "";
    const type =
      payload.fields.applicationType === "Artist Alley" ? "Artist Alley" : "Vendor Hall";
    const prefix =
      type === "Artist Alley"
        ? "[MPF 2027 Artist Application]"
        : "[MPF 2027 Vendor Application]";
    return business ? `${prefix} ${business} — ${type}` : `${prefix} ${type}`;
  }
  return SUBJECTS[kind];
}

const KIND_LABELS: Record<OperationalKind, string> = {
  contact: "General Contact",
  vendor_interest: "Vendor Interest",
  vendor_application: "Vendor / Artist Application",
  sponsor_inquiry: "Sponsorship Inquiry",
  volunteer_interest: "Volunteer Interest",
  guest_inquiry: "Guest Inquiry",
  press_inquiry: "Press Inquiry",
};

const FIELD_LABELS: Record<string, string> = {
  email: "Email",
  firstName: "First name",
  name: "Name",
  inquiryType: "Inquiry type",
  message: "Message",
  businessName: "Business / artist name",
  contactName: "Contact name",
  website: "Website",
  vendorType: "Applicant type",
  vendorCategory: "Primary category",
  whatYouSell: "What you sell or create",
  socialMedia: "Social media",
  notifyApplications: "Notify when applications open",
  company: "Business / organization",
  phone: "Phone",
  title: "Title",
  address: "Address",
  city: "City",
  state: "State",
  zip: "ZIP",
  partnership: "Selected level",
  proposedAmount: "Proposed custom amount",
  areas: "Areas of interest",
  otherInterest: "Other interest",
  displayName: "Preferred display name",
  displayLink: "Website / social link",
  marketingContact: "Marketing contact",
  marketingEmail: "Marketing contact email",
  notes: "Additional comments",
  ageRange: "Age range",
  availability: "Availability",
  experience: "Experience",
  stageName: "Professional name",
  social: "Social / profile URL",
  category: "Category",
  bio: "Bio",
  why: "Why they are interested",
  needs: "Appearance notes",
  outlet: "Outlet / channel",
  coverageType: "Coverage type",
  audience: "Audience / reach",
  updatesConsent: "Updates consent",
  applicationType: "Application type",
  socialPrimary: "Primary social media",
  socialAdditional: "Additional social media",
  street: "Street address",
  country: "Country",
  businessDescription: "Business / artist description",
  yearsActive: "Years in business / creating",
  vendedBefore: "Vended at conventions before",
  priorEvents: "Previous events",
  primaryCategory: "Primary category",
  secondaryCategories: "Secondary categories",
  mixOriginal: "Original / self-created merchandise",
  mixLicensed: "Licensed retail merchandise",
  mixSecondhand: "Secondhand / vintage / collectible",
  mixOther: "Other merchandise mix",
  ownWorkMajority: "Majority of work created or designed by applicant",
  ownWorkPercent: "Original work on table",
  offersCommissions: "Offers commissions",
  productionMethod: "How products are created",
  inventoryTypes: "Inventory types",
  mysteryMerchandise: "Mystery / randomized merchandise",
  mysteryDescription: "Mystery merchandise description",
  spaceRequest: "Preferred space",
  spaceRequestLabel: "Preferred space name",
  additionalSpace: "Additional space requested",
  additionalSpaceDetails: "Additional space details",
  extraBadges: "Extra vendor badges requested",
  extraTables: "Extra tables requested",
  electricityRequested: "Electricity requested",
  primaryRepName: "Primary booth representative",
  additionalRepNames: "Additional representatives",
  tallDisplays: "Displays taller than 8 feet",
  tallDisplayDescription: "Tall display description",
  displayElements: "Booth display elements",
  boothSetupNotes: "Planned booth setup",
  merchandisePolicy: "Merchandise policy agreement",
  aiGenerated: "Primarily AI-generated imagery",
  aiDescription: "AI-generated imagery explanation",
  sellsFood: "Intends to sell food or beverages",
  taxAcknowledgment: "Tax / licensing acknowledgment",
  insuranceStatus: "Business / general liability insurance",
  boothSharing: "Booth sharing",
  shareBusinessName: "Shared booth business / artist",
  shareContactName: "Shared booth contact",
  shareEmail: "Shared booth email",
  shareDescription: "Shared booth merchandise",
  hoursCommitment: "Can operate both event days",
  hoursExplanation: "Hours limitation explanation",
  cancellationAck: "Cancellation / refund terms acknowledgment",
  noPaymentAck: "No payment / no reservation acknowledgment",
  paymentIfApprovedAck: "Payment-after-approval acknowledgment",
  ackAccurate: "Information is accurate",
  ackNoGuarantee: "Acceptance not guaranteed",
  ackSpaceAssignment: "Space assignment by Midwest Pixel Fest",
  ackEventRules: "Agrees to event and venue rules",
  ackProhibitedRemoval: "Prohibited merchandise may be removed",
  ackLegal: "Legal / licensing / tax responsibility",
  ackBoothShare: "Booth sharing requires approval",
  ackLaterDetails: "Final operational details later",
  legalName: "Applicant full legal name",
  signatureBusinessName: "Signature business / artist name",
  electronicSignature: "Electronic signature",
  signatureDate: "Signature date",
  signatureAuthAck: "Authorized to submit",
  applicationReference: "Application reference",
  applicationStatus: "Review status",
  contactConsent: "Contact consent",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function hasHeaderBreak(value: string): boolean {
  return /[\r\n]/.test(value);
}

/** Accepts a bare address or `Name <address@domain>`. */
function isValidFromAddress(value: string): boolean {
  if (hasHeaderBreak(value)) return false;
  const trimmed = value.trim();
  const named = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  const address = named ? named[2].trim() : trimmed;
  return validateEmail(address) === null;
}

function isSafeReplyTo(value: string): boolean {
  if (hasHeaderBreak(value)) return false;
  return validateEmail(value) === null;
}

function formatFieldValue(value: string | string[]): string {
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function fieldRows(fields: Record<string, string | string[]>): { label: string; value: string }[] {
  return Object.entries(fields)
    .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value.length > 0))
    .map(([key, value]) => ({
      label: FIELD_LABELS[key] ?? key,
      value: formatFieldValue(value),
    }));
}

function formatSubmittedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const central = date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });
  return `${central} CT (${iso})`;
}

const VENDOR_APPLICATION_SECTIONS: Array<{ heading: string; keys: string[] }> = [
  {
    heading: "SYSTEM",
    keys: ["applicationReference", "applicationStatus", "applicationType"],
  },
  {
    heading: "CONTACT",
    keys: [
      "contactName",
      "businessName",
      "email",
      "phone",
      "website",
      "socialPrimary",
      "socialAdditional",
      "street",
      "city",
      "state",
      "zip",
      "country",
    ],
  },
  {
    heading: "BUSINESS",
    keys: ["businessDescription", "yearsActive", "vendedBefore", "priorEvents"],
  },
  {
    heading: "MERCHANDISE",
    keys: [
      "primaryCategory",
      "secondaryCategories",
      "whatYouSell",
      "mixOriginal",
      "mixLicensed",
      "mixSecondhand",
      "mixOther",
      "ownWorkMajority",
      "ownWorkPercent",
      "offersCommissions",
      "productionMethod",
      "inventoryTypes",
      "mysteryMerchandise",
      "mysteryDescription",
    ],
  },
  {
    heading: "SPACE / ADD-ONS",
    keys: [
      "spaceRequestLabel",
      "spaceRequest",
      "additionalSpace",
      "additionalSpaceDetails",
      "extraBadges",
      "extraTables",
      "electricityRequested",
    ],
  },
  {
    heading: "STAFF / SETUP",
    keys: [
      "primaryRepName",
      "additionalRepNames",
      "tallDisplays",
      "tallDisplayDescription",
      "displayElements",
      "boothSetupNotes",
    ],
  },
  {
    heading: "COMPLIANCE",
    keys: [
      "merchandisePolicy",
      "aiGenerated",
      "aiDescription",
      "sellsFood",
      "taxAcknowledgment",
      "insuranceStatus",
      "hoursCommitment",
      "hoursExplanation",
    ],
  },
  {
    heading: "BOOTH SHARING",
    keys: [
      "boothSharing",
      "shareBusinessName",
      "shareContactName",
      "shareEmail",
      "shareDescription",
    ],
  },
  {
    heading: "ACKNOWLEDGMENTS",
    keys: [
      "cancellationAck",
      "noPaymentAck",
      "paymentIfApprovedAck",
      "ackAccurate",
      "ackNoGuarantee",
      "ackSpaceAssignment",
      "ackEventRules",
      "ackProhibitedRemoval",
      "ackLegal",
      "ackBoothShare",
      "ackLaterDetails",
      "contactConsent",
    ],
  },
  {
    heading: "SIGNATURE",
    keys: [
      "legalName",
      "signatureBusinessName",
      "electronicSignature",
      "signatureDate",
      "signatureAuthAck",
    ],
  },
];

const SPONSOR_SECTIONS: Array<{ heading: string; keys: string[] }> = [
  {
    heading: "BUSINESS",
    keys: [
      "company",
      "contactName",
      "title",
      "email",
      "phone",
      "website",
      "address",
      "city",
      "state",
      "zip",
    ],
  },
  {
    heading: "SPONSORSHIP",
    keys: ["partnership", "proposedAmount", "areas", "otherInterest"],
  },
  {
    heading: "DISPLAY / MARKETING",
    keys: ["displayName", "displayLink", "marketingContact", "marketingEmail"],
  },
  {
    heading: "NOTES",
    keys: ["notes"],
  },
];

function fieldValue(
  fields: Record<string, string | string[]>,
  key: string,
): string {
  const value = fields[key];
  if (value == null) return "";
  return formatFieldValue(value);
}

function sectionRows(
  fields: Record<string, string | string[]>,
  sections: Array<{ heading: string; keys: string[] }>,
): Array<{ heading: string; rows: { label: string; value: string }[] }> {
  return sections
    .map((section) => ({
      heading: section.heading,
      rows: section.keys
        .map((key) => ({
          label: FIELD_LABELS[key] ?? key,
          value: fieldValue(fields, key),
        }))
        .filter((row) => row.value.length > 0),
    }))
    .filter((section) => section.rows.length > 0);
}

function sponsorRows(
  fields: Record<string, string | string[]>,
): Array<{ heading: string; rows: { label: string; value: string }[] }> {
  return sectionRows(fields, SPONSOR_SECTIONS);
}

function vendorApplicationRows(
  fields: Record<string, string | string[]>,
): Array<{ heading: string; rows: { label: string; value: string }[] }> {
  return sectionRows(fields, VENDOR_APPLICATION_SECTIONS);
}

function buildSectionedText(
  payload: DeliveryPayload,
  title: string,
  sections: Array<{ heading: string; rows: { label: string; value: string }[] }>,
): string {
  const lines = [
    `Midwest Pixel Fest — ${title}`,
    "",
    `Submitted: ${formatSubmittedAt(payload.submittedAt)}`,
    "",
  ];
  for (const section of sections) {
    lines.push(section.heading);
    for (const row of section.rows) {
      lines.push(`${row.label}: ${row.value}`);
    }
    lines.push("");
  }
  lines.push("SYSTEM");
  lines.push(`Submission timestamp: ${formatSubmittedAt(payload.submittedAt)}`);
  return lines.join("\n");
}

function buildSectionedHtml(
  payload: DeliveryPayload,
  title: string,
  sections: Array<{ heading: string; rows: { label: string; value: string }[] }>,
): string {
  const sectionsHtml = sections
    .map((section) => {
      const rows = section.rows
        .map(
          (row) =>
            `<tr>
              <th align="left" valign="top" style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#555;white-space:nowrap;">${escapeHtml(row.label)}</th>
              <td valign="top" style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#111;white-space:pre-wrap;">${escapeHtml(row.value)}</td>
            </tr>`,
        )
        .join("");
      return `<h2 style="margin:24px 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#666;">${escapeHtml(section.heading)}</h2>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}</table>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Georgia,'Times New Roman',serif;color:#111;">
  <div style="max-width:640px;margin:0 auto;background:#fff;padding:24px 28px;border:1px solid #e5e5e5;">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#666;">Midwest Pixel Fest</p>
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;">${escapeHtml(title)}</h1>
    <p style="margin:0 0 20px;font-size:13px;color:#555;">
      <strong>SYSTEM</strong><br />
      <strong>Submitted:</strong> ${escapeHtml(formatSubmittedAt(payload.submittedAt))}
    </p>
    ${sectionsHtml}
  </div>
</body>
</html>`;
}

function buildSponsorText(payload: DeliveryPayload): string {
  return buildSectionedText(payload, "Sponsorship Inquiry", sponsorRows(payload.fields));
}

function buildSponsorHtml(payload: DeliveryPayload): string {
  return buildSectionedHtml(payload, "Sponsorship Inquiry", sponsorRows(payload.fields));
}

function vendorApplicationTitle(payload: DeliveryPayload): string {
  return payload.fields.applicationType === "Artist Alley"
    ? "Artist Alley Application"
    : "Vendor Hall Application";
}

function buildVendorApplicationText(payload: DeliveryPayload): string {
  return buildSectionedText(
    payload,
    vendorApplicationTitle(payload),
    vendorApplicationRows(payload.fields),
  );
}

function buildVendorApplicationHtml(payload: DeliveryPayload): string {
  return buildSectionedHtml(
    payload,
    vendorApplicationTitle(payload),
    vendorApplicationRows(payload.fields),
  );
}

function buildText(payload: DeliveryPayload, kind: OperationalKind): string {
  const rows = fieldRows(payload.fields);
  const lines = [
    `Midwest Pixel Fest — ${KIND_LABELS[kind]}`,
    "",
    `Type: ${kind}`,
    `Submitted: ${formatSubmittedAt(payload.submittedAt)}`,
    "",
    ...rows.map((row) => `${row.label}: ${row.value}`),
  ];
  return lines.join("\n");
}

function buildHtml(payload: DeliveryPayload, kind: OperationalKind): string {
  const rows = fieldRows(payload.fields);
  const rowHtml = rows
    .map(
      (row) =>
        `<tr>
          <th align="left" valign="top" style="padding:8px 12px 8px 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#555;white-space:nowrap;">${escapeHtml(row.label)}</th>
          <td valign="top" style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#111;white-space:pre-wrap;">${escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Georgia,'Times New Roman',serif;color:#111;">
  <div style="max-width:640px;margin:0 auto;background:#fff;padding:24px 28px;border:1px solid #e5e5e5;">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#666;">Midwest Pixel Fest</p>
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;">${escapeHtml(KIND_LABELS[kind])}</h1>
    <p style="margin:0 0 8px;font-size:14px;color:#333;">A new form submission was received.</p>
    <p style="margin:0 0 20px;font-size:13px;color:#555;">
      <strong>Type:</strong> ${escapeHtml(kind)}<br />
      <strong>Submitted:</strong> ${escapeHtml(formatSubmittedAt(payload.submittedAt))}
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rowHtml}</table>
  </div>
</body>
</html>`;
}

export function isOperationalKind(kind: FormKind): kind is OperationalKind {
  return (OPERATIONAL_KINDS as readonly string[]).includes(kind);
}

export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FORM_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_NOTIFICATION_EMAIL?.trim();
  if (!apiKey || !from || !to) return false;
  if (!isValidFromAddress(from)) return false;
  if (validateEmail(to) !== null || hasHeaderBreak(to)) return false;
  return true;
}

/**
 * Sends an operational notification via Resend.
 * Does not log field contents. Does not handle newsletter signups.
 */
export async function sendOperationalEmail(
  payload: DeliveryPayload,
): Promise<DeliveryResult> {
  if (!isOperationalKind(payload.kind)) {
    return { ok: false, code: "not_configured" };
  }

  const kind = payload.kind;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FORM_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_NOTIFICATION_EMAIL?.trim();

  if (!apiKey || !from || !to || !isResendConfigured()) {
    return { ok: false, code: "not_configured" };
  }

  const rawReply = payload.fields.email;
  const replyTo =
    typeof rawReply === "string" && isSafeReplyTo(rawReply) ? rawReply : undefined;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: emailSubject(payload, kind),
      html:
        kind === "sponsor_inquiry"
          ? buildSponsorHtml(payload)
          : kind === "vendor_application"
            ? buildVendorApplicationHtml(payload)
            : buildHtml(payload, kind),
      text:
        kind === "sponsor_inquiry"
          ? buildSponsorText(payload)
          : kind === "vendor_application"
            ? buildVendorApplicationText(payload)
            : buildText(payload, kind),
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      const errorName =
        typeof error === "object" && error && "name" in error && typeof error.name === "string"
          ? error.name
          : "unknown";
      console.error("form_email_failed", {
        provider: "resend",
        kind,
        name: errorName,
      });
      return { ok: false, code: "delivery_failed" };
    }

    return { ok: true };
  } catch {
    console.error("form_email_failed", {
      provider: "resend",
      kind,
      name: "network_or_sdk",
    });
    return { ok: false, code: "delivery_failed" };
  }
}
