import {
  FIELD_LIMITS, optionalText, optionalUrl, readString, requiredText,
  requiredInteger, requireOneOf, stripControlChars, validateEmail,
  type FieldErrors,
} from "@/lib/forms/validate";

export const PANEL_CATEGORIES = [
  "Video Games & Retro Gaming", "Tabletop & RPGs", "Trading Card Games",
  "Anime & Fandom", "Cosplay & Costuming", "Comics & Art",
  "Content Creation & Streaming", "Community & Inclusion", "Other",
] as const;
export const PANEL_FORMATS = [
  "Presentation / Talk", "Panel Discussion", "Interactive Workshop",
  "Q&A Session", "Meetup / Community Discussion", "Live Demonstration",
] as const;
export const PANEL_AUDIENCES = [
  "All Ages", "Teens & Adults", "Adults Only (18+)",
] as const;
export const PANEL_ATTENDANCE = [
  "Under 25", "25–50", "51–100", "More than 100", "Not sure",
] as const;
export const PANEL_DURATIONS = ["30", "45", "60"] as const;
export const PANEL_STATUSES = [
  "submitted", "under_review", "shortlisted", "accepted",
  "waitlisted", "declined", "withdrawn",
] as const;
export type PanelStatus = (typeof PANEL_STATUSES)[number];
export const PANEL_STATUS_LABELS: Record<PanelStatus,string> = {
  submitted: "New", under_review: "Under review", shortlisted: "Shortlisted",
  accepted: "Accepted", waitlisted: "Waitlisted", declined: "Declined",
  withdrawn: "Withdrawn",
};

export type PanelFields = {
  contactName: string; displayName: string; email: string; phone: string;
  socialUrl: string; panelTitle: string; topicCategory: string;
  panelFormat: string; durationMinutes: string; description: string;
  audience: string; estimatedAttendance: string; coPresenters: string;
  pastExperience: string; avNeeds: string; schedulingNotes: string;
  accessibilityNeeds: string;
};

const labels: Record<keyof PanelFields, string> = {
  contactName: "your name", displayName: "the public presenter name",
  email: "email", phone: "phone", socialUrl: "social link",
  panelTitle: "a panel title", topicCategory: "a topic category",
  panelFormat: "a format", durationMinutes: "a duration",
  description: "a panel description", audience: "an audience",
  estimatedAttendance: "an attendance estimate",
  coPresenters: "co-presenters", pastExperience: "experience",
  avNeeds: "equipment needs", schedulingNotes: "schedule notes",
  accessibilityNeeds: "accommodation details",
};
const fieldNames = Object.keys(labels) as (keyof PanelFields)[];
export function parsePanelSubmission(formData: FormData):
  | { ok: true; fields: PanelFields }
  | { ok: false; errors: FieldErrors } {
  const fields = Object.fromEntries(fieldNames.map((key) => [
    key, stripControlChars(readString(formData, key)).trim(),
  ])) as PanelFields;
  const errors: FieldErrors = {};
  const check = (key: keyof PanelFields, error: string | null) => {
    if (error) errors[key] = error;
  };
  check("contactName", requiredText(fields.contactName, labels.contactName));
  check("displayName", optionalText(fields.displayName, labels.displayName));
  check("email", validateEmail(fields.email));
  check("phone", optionalText(fields.phone, labels.phone, FIELD_LIMITS.phone));
  check("socialUrl", optionalUrl(fields.socialUrl));
  check("panelTitle", requiredText(fields.panelTitle, labels.panelTitle, FIELD_LIMITS.medium));
  check("topicCategory", requireOneOf(fields.topicCategory, PANEL_CATEGORIES, labels.topicCategory));
  check("panelFormat", requireOneOf(fields.panelFormat, PANEL_FORMATS, labels.panelFormat));
  check("durationMinutes", requiredInteger(fields.durationMinutes, labels.durationMinutes, 30, 60));
  if (!PANEL_DURATIONS.includes(fields.durationMinutes as (typeof PANEL_DURATIONS)[number])) {
    errors.durationMinutes = "Choose 30, 45 or 60 minutes.";
  }
  check("description", requiredText(fields.description, labels.description, FIELD_LIMITS.message));
  check("audience", requireOneOf(fields.audience, PANEL_AUDIENCES, labels.audience));
  check("estimatedAttendance", requireOneOf(fields.estimatedAttendance, PANEL_ATTENDANCE, labels.estimatedAttendance));
  for (const key of ["coPresenters", "pastExperience", "avNeeds", "schedulingNotes", "accessibilityNeeds"] as const) {
    check(key, optionalText(fields[key], labels[key], FIELD_LIMITS.message));
  }
  if (readString(formData, "contactConsent") !== "on") errors.contactConsent = "Confirm we may contact you about this proposal.";
  if (readString(formData, "panelAck") !== "on") errors.panelAck = "Confirm you understand that a submission is not an acceptance.";
  const totalSize = JSON.stringify(fields).length;
  if (totalSize > 16000) errors.description = "Please shorten your responses.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, fields };
}
