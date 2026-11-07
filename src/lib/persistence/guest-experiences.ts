import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import type {
  PublicGuestExperience, PublicGuestSession, GuestSessionType,
} from "@/lib/guest-experiences/model";

const SELECT_PUBLIC_GUEST = [
 "id","slug","display_name","role_label","bio","image_url",
 "autograph_available","autograph_price_cents",
 "selfie_available","selfie_price_cents","photo_op_available",
 "photo_op_price_cents","combo_price_cents","autograph_details",
 "photo_details","sales_notes","purchase_url",
 "location_notes","public_schedule_notes",
].join(",");
const SELECT_PUBLIC_SESSION = [
 "id","guest_id","session_type","session_date","start_time","end_time",
 "location_label","public_note","sort_order",
].join(",");

type RawGuest = Omit<PublicGuestExperience,"sessions">;
type RawSession = PublicGuestSession;
const publicUrl=(value:string|null):string|null=>{
 if(!value)return null;
 return parseAllowedHttpUrl(value)?.href??null;
};

/** Server-side whitelist prevents exposing negotiation status, internal notes or pricing drafts. */
export async function listPublicGuestExperiences():Promise<PublicGuestExperience[]> {
 const client=createSupabaseServiceClient();
 if(!client)return [];
 const {data:guestRows,error}=await client.from("guest_experiences")
  .select(SELECT_PUBLIC_GUEST).eq("booking_status","contracted")
  .eq("is_published",true).order("sort_order",{ascending:true})
  .order("display_name",{ascending:true}).limit(100);
 if(error){
  console.error("guest_public_list_failed",{code:error.code});
  return [];
 }
 const guests=(guestRows??[]) as unknown as RawGuest[];
 if(!guests.length)return [];
 const {data:sessionRows,error:sessionError}=await client.from("guest_experience_sessions")
  .select(SELECT_PUBLIC_SESSION).in("guest_id",guests.map(guest=>guest.id))
  .eq("is_published",true)
  .order("session_date",{ascending:true})
  .order("start_time",{ascending:true})
  .order("sort_order",{ascending:true}).limit(600);
 if(sessionError)console.error("guest_public_sessions_failed",{code:sessionError.code});
 const sessions=(sessionRows??[]) as unknown as RawSession[];
 return guests.map(guest=>({
  ...guest,
  image_url:publicUrl(guest.image_url),
  purchase_url:publicUrl(guest.purchase_url),
  sessions:sessions.filter(session=>session.guest_id===guest.id),
 }));
}

export async function getPublicGuestExperienceBySlug(slug:string):Promise<PublicGuestExperience|null>{
 if(!/^[a-z0-9][a-z0-9-]{1,79}$/.test(slug))return null;
 const all=await listPublicGuestExperiences();
 return all.find(guest=>guest.slug===slug)??null;
}

export const guestSessionLabel=(type:GuestSessionType):string=>{
 switch(type){
  case "autograph":return "Autograph signing";
  case "photo_op":return "Professional photo op";
  case "selfie":return "Selfie opportunity";
  case "meet_and_greet":return "Meet & greet";
 }
};

export function formatGuestSessionTime(value:string):string {
 const trimmed=value.slice(0,5);
 const [h,m]=trimmed.split(":").map(Number);
 if(!Number.isInteger(h)||!Number.isInteger(m))return value;
 const hour=h%12||12;
 return hour+":"+String(m).padStart(2,"0")+" "+(h<12?"AM":"PM");
}
