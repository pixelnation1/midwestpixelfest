"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { deliverSubmission } from "@/lib/forms/deliver";
import { checkFormRateLimit } from "@/lib/forms/rate-limit";
import { isHoneypotTriggered, readString } from "@/lib/forms/validate";
import { parseIdempotencyKey } from "@/lib/persistence/fields";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireOrganizer } from "@/lib/admin/auth";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import { COSPLAY_STATUSES, parseCosplayEntry, type CosplayStatus } from "@/lib/cosplay-contest/schema";

export type CosplayEntryState={
  status:"idle"|"success"|"error";
  message:string;
  reference?:string;
  fieldErrors:Record<string,string>;
};
const fail=(message:string,fieldErrors:Record<string,string>={}):CosplayEntryState=>({
  status:"error",message,fieldErrors,
});

export async function submitCosplayEntry(
  _previous:CosplayEntryState,
  data:FormData,
):Promise<CosplayEntryState>{
  if(isHoneypotTriggered(data))return {status:"success",message:"Thank you for your interest.",fieldErrors:{}};
  const parsed=parseCosplayEntry(data);
  if(!parsed.ok)return fail("Please check the highlighted fields.",parsed.errors);
  const limit=await checkFormRateLimit();
  if(!limit.ok)return fail("Too many submissions. Please wait a few minutes and try again.");
  const idempotency=parseIdempotencyKey(readString(data,"submissionId"));
  if(!idempotency)return fail("Please refresh the form and try again.");
  const supabase=createSupabaseServiceClient();
  if(!supabase)return fail("Contest registration is temporarily unavailable. Please try again later.");
  const f=parsed.fields;
  const reference="MPF-COS-"+randomBytes(4).toString("hex").toUpperCase();
  try {
    const row={
      reference,idempotency_key:idempotency,
      contact_name:f.contactName,email:f.email,phone:f.phone||null,
      public_name:f.publicName,age_band:f.ageBand,
      guardian_confirmed:parsed.guardianConfirmed,entry_type:f.entryType,
      group_size:Number(f.groupSize),division_preference:f.divisionPreference,
      character_name:f.characterName,series_name:f.seriesName||null,
      costume_description:f.costumeDescription,construction_type:f.constructionType,
      build_notes:f.buildNotes||null,props_description:f.propsDescription||null,
      reference_url:f.referenceUrl||null,day_preference:f.dayPreference,
      stage_notes:f.stageNotes||null,accessibility_needs:f.accessibilityNeeds||null,
      contact_consent:true,rules_acknowledged:true,
      status:"submitted",
    };
    const {data:created,error}=await supabase.from("cosplay_contest_entries")
      .upsert(row,{onConflict:"idempotency_key",ignoreDuplicates:true})
      .select("reference").maybeSingle();
    if(error){
      console.error("cosplay_registration_storage_failed",{code:error.code});
      return fail("We couldn't save your registration. Please try again later.");
    }
    if(!created) {
      const existing=await supabase.from("cosplay_contest_entries")
        .select("reference").eq("idempotency_key",idempotency).maybeSingle();
      if(existing.error||!existing.data?.reference)return fail("We couldn't confirm your application was saved. Please contact us.");
      return {status:"success",message:"This registration was already received for review. An entry is not confirmed until the contest team contacts you.",reference:existing.data.reference,fieldErrors:{}};
    }
    const notification=await deliverSubmission({
      kind:"cosplay_contest_entry",submittedAt:new Date().toISOString(),
      fields:{...f,contestReference:created.reference, guardianConfirmed:parsed.guardianConfirmed?"yes":"not applicable"},
    });
    if(!notification.ok)console.error("cosplay_registration_notification_failed_after_save",{code:notification.code});
    return {status:"success",message:"Your cosplay contest application is saved for organizer review. This is not a guaranteed contest slot or a confirmed division.",reference:created.reference,fieldErrors:{}};
  }catch{
    console.error("cosplay_registration_exception");
    return fail("We couldn't save your registration right now. Please try again.");
  }
}

export type CosplayReviewState={status:"idle"|"error"|"success";message:string};
export async function reviewCosplayEntry(
  _previous:CosplayReviewState,
  data:FormData,
):Promise<CosplayReviewState>{
  const organizer=await requireOrganizer();
  const supabase=await createSupabaseServerClient();
  if(!supabase)return {status:"error",message:"Please sign in again."};
  const id=readString(data,"id");
  const status=readString(data,"status");
  const notes=readString(data,"internalNotes");
  if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id) ||
    !COSPLAY_STATUSES.includes(status as CosplayStatus) || notes.length>4000){
    return {status:"error",message:"Invalid registration, status or notes."};
  }
  const existing=await supabase.from("cosplay_contest_entries")
    .select("id,reference,status").eq("id",id).maybeSingle();
  if(existing.error||!existing.data)return {status:"error",message:"Registration not found."};
  const {error}=await supabase.from("cosplay_contest_entries").update({
    status,internal_notes:notes,
  }).eq("id",id);
  if(error)return {status:"error",message:"Could not update registration."};
  await recordOrganizerAudit({
    action:"cosplay_contest_"+status,entityType:"cosplay_contest_entry",
    entityId:id,entityReference:existing.data.reference,actor:organizer,
  });
  revalidatePath("/admin/cosplay");
  revalidatePath("/admin");
  return {status:"success",message:"Registration updated. No applicant email was sent."};
}
