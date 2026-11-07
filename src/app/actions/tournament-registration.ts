"use server";

import { randomBytes } from "node:crypto";
import { checkFormRateLimit } from "@/lib/forms/rate-limit";
import { isHoneypotTriggered, readString, validateEmail, stripControlChars } from "@/lib/forms/validate";
import { parseIdempotencyKey } from "@/lib/persistence/fields";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { tournamentRegistrationAvailable, validatePlayerEligibility } from "@/lib/tournaments/model";
import type { TournamentRecord } from "@/lib/tournaments/model";

export type TournamentSignupState={
 status:"idle"|"error"|"success";message:string;
 fieldErrors:Record<string,string>;reference?:string;
 registrationStatus?:"registered"|"waitlisted";
};
const fail=(message:string,fieldErrors:Record<string,string>={}):TournamentSignupState=>({
 status:"error",message,fieldErrors,
});
const safeText=(f:FormData,key:string,max:number):string=>{
 const raw=readString(f,key);
 return stripControlChars(raw).trim().slice(0,max+1);
};
export async function registerForTournament(
 _prev:TournamentSignupState,form:FormData,
):Promise<TournamentSignupState>{
 if(isHoneypotTriggered(form))return {status:"success",message:"Thank you.",fieldErrors:{}};
 const errors:Record<string,string>={};
 const tournamentId=safeText(form,"tournamentId",36);
 const idempotency=parseIdempotencyKey(readString(form,"submissionId"));
 const contactName=safeText(form,"contactName",120);
 const email=safeText(form,"contactEmail",254).toLowerCase();
 const playerName=safeText(form,"playerName",100);
 const roster=safeText(form,"rosterNotes",900);
 const ageBand=safeText(form,"ageBand",20);
 const adultConfirmed=readString(form,"adultAck")==="on";
 const guardianConfirmed=readString(form,"guardianAck")==="on";
 const nameConsent=readString(form,"publicNameConsent")==="on";
 const rulesAck=readString(form,"rulesAck")==="on";
 const privacyAck=readString(form,"privacyAck")==="on";
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(tournamentId)||!idempotency)
  return fail("Refresh the page and try again.");
 if(contactName.length<2||contactName.length>120)errors.contactName="Enter the adult contact's full name.";
 const emailError=validateEmail(email);
 if(emailError)errors.contactEmail=emailError;
 if(playerName.length<2||playerName.length>100)errors.playerName="Enter a player or team display name (2–100 characters).";
 if(roster.length>900)errors.rosterNotes="Shorten the roster notes.";
 if(!adultConfirmed)errors.adultAck="An adult must complete this registration.";
 if(!rulesAck)errors.rulesAck="Confirm that you have read the rules.";
 if(!privacyAck)errors.privacyAck="Agree to event registration contact and the privacy policy.";
 if(!["adult","minor","under_13"].includes(ageBand))errors.ageBand="Choose an age range.";
 if(Object.keys(errors).length)return fail("Please correct the highlighted fields.",errors);
 const rate=await checkFormRateLimit();
 if(!rate.ok)return fail("Too many registrations. Please try again in a few minutes.");
 const service=createSupabaseServiceClient();
 if(!service)return fail("Registration is temporarily unavailable.");
 // Idempotent retry before the live signup window check: a lost response
 // must not become a misleading "registration closed" after brackets start.
 const {data:prior,error:priorError}=await service.from("tournament_registrations")
  .select("tournament_id,reference,status").eq("idempotency_key",idempotency)
  .maybeSingle();
 if(priorError)return fail("We couldn't verify a previous submission. Please try again.");
 if(prior){
  if(prior.tournament_id!==tournamentId)
   return fail("This registration attempt is already associated with another tournament. Refresh and retry.");
  if(prior.status==="registered"||prior.status==="checked_in"||prior.status==="waitlisted"){
   return {
    status:"success",
    message:prior.status==="waitlisted"
      ?"Your waitlist request was already saved. Keep your original reference; a place is not guaranteed."
      :"This registration was already recorded. Keep your original reference for event-day check-in.",
    fieldErrors:{},
    reference:prior.reference,
    registrationStatus:prior.status==="waitlisted"?"waitlisted":"registered",
   };
  }
  return fail("This registration has been withdrawn or disqualified. Contact organizers if you need to discuss reinstatement.");
 }
 const response=await service.from("tournament_events")
  .select("id,age_policy,entry_type,status,is_published,registration_open,registration_deadline")
  .eq("id",tournamentId).maybeSingle();
 if(response.error||!response.data)return fail("This tournament is not available for registration.");
 const tournament=response.data as Pick<TournamentRecord,"age_policy"|"entry_type"|"status"|"is_published"|"registration_open"|"registration_deadline">;
 if(!tournamentRegistrationAvailable(tournament,new Date()))return fail("Registration for this tournament is currently closed.");
 const eligibility=validatePlayerEligibility(ageBand,tournament.age_policy,guardianConfirmed);
 if(eligibility)return fail("Check age and guardian requirements.",{ageBand:eligibility,guardianAck:eligibility});
 if(tournament.entry_type==="team"&&roster.length<2)return fail("Provide your team's roster.",{rosterNotes:"List team members or their display names."});
 const reference="MPF-TM-"+randomBytes(5).toString("hex").toUpperCase();
 try {
  const {data,error}=await service.rpc("register_tournament_entry",{
   p_tournament_id:tournamentId,p_reference:reference,
   p_idempotency_key:idempotency,p_contact_name:contactName,
   p_contact_email:email,p_player_name:playerName,p_roster_notes:roster,
   p_age_band:ageBand,p_guardian_confirmed:guardianConfirmed,
   p_public_name_consent:nameConsent,
  });
  if(error){
   const message=error.message??"";
   if(/registration_closed|tournament_unavailable/.test(message))return fail("Tournament registration has closed.");
   if(/tournament_full/.test(message))return fail("This tournament is full and the waitlist is not open.");
   if(/age_restriction|guardian_required/.test(message))return fail("Check this tournament's age and guardian eligibility.");
   if(error.code==="23505")return fail("This player or team already has a registration under that contact email.");
   console.error("tournament_registration_error",{code:error.code});
   return fail("We couldn't save the registration. Please try again.");
  }
  const row=Array.isArray(data)?data[0]:null;
  if(!row?.result_reference||!["registered","waitlisted"].includes(row.result_status))
   return fail("We couldn't confirm the registration was saved.");
  return {
   status:"success",
   message:row.result_status==="registered"
     ?"Your registration is recorded. You still need to check in on event day to compete."
     :"You're on the waitlist. This is not a guaranteed tournament spot; the organizers will review openings.",
   reference:row.result_reference,
   registrationStatus:row.result_status,
   fieldErrors:{},
  };
 }catch{
  console.error("tournament_registration_exception");
  return fail("Registration is temporarily unavailable. Please try again later.");
 }
}
