import type { DeliveryPayload } from "@/lib/forms/types";

export function fieldString(
  fields: DeliveryPayload["fields"],
  key: string,
): string {
  const value = fields[key];
  if (Array.isArray(value)) return value.join(", ");
  return typeof value === "string" ? value : "";
}

export function fieldList(
  fields: DeliveryPayload["fields"],
  key: string,
): string[] {
  const value = fields[key];
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value) return [value];
  return [];
}

export function fieldYes(fields: DeliveryPayload["fields"], key: string): boolean {
  const value = fieldString(fields, key).toLowerCase();
  return value === "yes" || value === "on" || value === "true";
}

export function parseIdempotencyKey(value: string): string | null {
  const trimmed = value.trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}

export const PERSISTED_FORM_KINDS = [
  "vendor_interest",
  "vendor_application",
  "sponsor_inquiry",
  "sponsor_commitment",
  "sponsor_assets",
] as const;

export function isPersistedFormKind(kind: string): boolean {
  return (PERSISTED_FORM_KINDS as readonly string[]).includes(kind);
}
