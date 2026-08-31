import type { FormKind } from "@/lib/forms/validate";

export type DeliveryPayload = {
  kind: FormKind;
  submittedAt: string;
  fields: Record<string, string | string[]>;
};

export type DeliveryResult =
  | { ok: true }
  | { ok: false; code: "not_configured" | "delivery_failed" };
