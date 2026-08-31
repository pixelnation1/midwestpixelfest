import "server-only";

import { Resend } from "resend";
import type { DeliveryPayload, DeliveryResult } from "@/lib/forms/types";
import type { FormKind } from "@/lib/forms/validate";
import { validateEmail } from "@/lib/forms/validate";

const OPERATIONAL_KINDS = [
  "contact",
  "vendor_interest",
  "sponsor_inquiry",
  "volunteer_interest",
  "guest_inquiry",
  "press_inquiry",
] as const satisfies readonly FormKind[];

type OperationalKind = (typeof OPERATIONAL_KINDS)[number];

const SUBJECTS: Record<OperationalKind, string> = {
  contact: "[Midwest Pixel Fest] General Contact",
  vendor_interest: "[Midwest Pixel Fest] Vendor Interest",
  sponsor_inquiry: "[Midwest Pixel Fest] New Sponsorship Inquiry",
  volunteer_interest: "[Midwest Pixel Fest] Volunteer Interest",
  guest_inquiry: "[Midwest Pixel Fest] Guest Inquiry",
  press_inquiry: "[Midwest Pixel Fest] Press Inquiry",
};

function emailSubject(payload: DeliveryPayload, kind: OperationalKind): string {
  if (kind === "sponsor_inquiry") {
    const company =
      typeof payload.fields.company === "string"
        ? payload.fields.company.replace(/[\r\n]+/g, " ").trim().slice(0, 80)
        : "";
    return company
      ? `[Midwest Pixel Fest] New Sponsorship Inquiry — ${company}`
      : SUBJECTS.sponsor_inquiry;
  }
  return SUBJECTS[kind];
}

const KIND_LABELS: Record<OperationalKind, string> = {
  contact: "General Contact",
  vendor_interest: "Vendor Interest",
  sponsor_inquiry: "New Sponsorship Inquiry",
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
  vendorType: "Vendor type",
  whatYouSell: "What you sell",
  notifyApplications: "Notify when applications open",
  company: "Business / organization",
  phone: "Phone",
  location: "Business location",
  partnership: "Package interest",
  interest: "Partnership interest",
  involvement: "Desired involvement",
  notes: "Notes",
  ageRange: "Age range",
  areas: "Areas of interest",
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
      html: buildHtml(payload, kind),
      text: buildText(payload, kind),
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
