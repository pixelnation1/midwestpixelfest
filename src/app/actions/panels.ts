"use server";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { checkFormRateLimit } from "@/lib/forms/rate-limit";
import { isHoneypotTriggered, readString } from "@/lib/forms/validate";
import { deliverSubmission } from "@/lib/forms/deliver";
import { parseIdempotencyKey } from "@/lib/persistence/fields";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireOrganizer } from "@/lib/admin/auth";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import { PANEL_STATUSES, parsePanelSubmission, type PanelStatus } from "@/lib/panels/schema";

export type PanelSubmissionState = {
  status: "idle" | "success" | "error";
  message: string;
  reference?: string;
  fieldErrors: Record<string, string>;
};
const fail = (message: string, fieldErrors: Record<string, string> = {}): PanelSubmissionState =>
  ({ status: "error", message, fieldErrors });

export async function submitPanelProposal(
  _previous: PanelSubmissionState,
  formData: FormData,
): Promise<PanelSubmissionState> {
  if (isHoneypotTriggered(formData)) {
    return { status: "success", message: "Thanks for your proposal.", fieldErrors: {} };
  }
  const parsed = parsePanelSubmission(formData);
  if (!parsed.ok) return fail("Please correct the highlighted fields.", parsed.errors);
  const rate = await checkFormRateLimit();
  if (!rate.ok) return fail("Too many submissions. Please try again in a few minutes.");
  const idempotencyKey = parseIdempotencyKey(readString(formData, "submissionId"));
  if (!idempotencyKey) return fail("Refresh this page and try again.");
  const supabase = createSupabaseServiceClient();
  if (!supabase) return fail("Submissions are temporarily unavailable. Please try again later.");

  const f = parsed.fields;
  const reference = `MPF-PNL-${randomBytes(4).toString("hex").toUpperCase()}`;
  const row = {
    reference, idempotency_key: idempotencyKey,
    contact_name: f.contactName, display_name: f.displayName || null,
    email: f.email, phone: f.phone || null, social_url: f.socialUrl || null,
    panel_title: f.panelTitle, topic_category: f.topicCategory,
    panel_format: f.panelFormat, duration_minutes: Number(f.durationMinutes),
    description: f.description, audience: f.audience,
    estimated_attendance: f.estimatedAttendance,
    co_presenters: f.coPresenters || null, past_experience: f.pastExperience || null,
    av_needs: f.avNeeds || null, scheduling_notes: f.schedulingNotes || null,
    accessibility_needs: f.accessibilityNeeds || null, status: "submitted",
  };
  try {
    const { data, error } = await supabase.from("panel_submissions")
      .upsert(row, { onConflict: "idempotency_key", ignoreDuplicates: true })
      .select("reference").maybeSingle();
    if (error) {
      console.error("panel_submission_persist_failed", { code: error.code });
      return fail("We could not save the proposal. Please try again later.");
    }
    if (!data) {
      const existing = await supabase.from("panel_submissions")
        .select("reference").eq("idempotency_key", idempotencyKey).maybeSingle();
      if (existing.error || !existing.data?.reference) {
        return fail("We could not confirm the proposal was saved. Please contact us.");
      }
      return { status: "success", message: "Your panel proposal was already received. Our programming team will review it; submission is not an acceptance.", reference: existing.data.reference, fieldErrors: {} };
    }

    const result = await deliverSubmission({
      kind: "panel_submission",
      submittedAt: new Date().toISOString(),
      fields: { ...f, panelReference: data.reference, contactConsent: "yes" },
    });
    if (!result.ok) console.error("panel_notification_failed_after_save", { code: result.code });
    return { status: "success", message: "Your panel proposal has been received for review. Submission does not guarantee a panel slot or reimbursement.", reference: data.reference, fieldErrors: {} };
  } catch {
    console.error("panel_submission_exception");
    return fail("We could not save the proposal right now. Please try again.");
  }
}

export type PanelReviewState = { status: "idle" | "error" | "success"; message: string };
export async function reviewPanelProposal(
  _previous: PanelReviewState,
  formData: FormData,
): Promise<PanelReviewState> {
  // /admin routes are guarded, but server actions must independently authorize.
  const actor = await requireOrganizer();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { status: "error", message: "Sign in again." };
  const id = readString(formData, "id");
  const status = readString(formData, "status");
  const internalNotes = readString(formData, "internalNotes").slice(0, 4000);
  if (!/^[0-9a-f-]{36}$/i.test(id) || !PANEL_STATUSES.includes(status as PanelStatus)) {
    return { status: "error", message: "Invalid proposal or status." };
  }
  const { data: existing, error: readError } = await supabase.from("panel_submissions")
    .select("id,reference,status").eq("id", id).maybeSingle();
  if (readError || !existing) return { status: "error", message: "Proposal not found." };
  const { error } = await supabase.from("panel_submissions").update({
    status, internal_notes: internalNotes,
  }).eq("id", id);
  if (error) return { status: "error", message: "Unable to update the proposal." };
  await recordOrganizerAudit({
    action: `panel_${status}`, entityType: "panel_submission",
    entityId: id, entityReference: existing.reference, actor,
  });
  revalidatePath("/admin/panels");
  revalidatePath("/admin");
  return { status: "success", message: "Proposal updated. No email was sent to the applicant." };
}
