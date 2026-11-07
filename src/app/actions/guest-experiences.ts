"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizer } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import {
  GUEST_BOOKING_STATUSES, validGuestSlug, validGuestTime,
  validGuestEventDate, validSessionType, dollarsToCents,
  type GuestBookingStatus,
} from "@/lib/guest-experiences/model";
import type { AdminActionState } from "@/app/actions/admin";

const success=(message:string):AdminActionState=>({status:"success",message});
const fail=(message:string):AdminActionState=>({status:"error",message});
const text=(f:FormData,key:string,max=4000)=>{
 const value=f.get(key);
 return typeof value==="string"?value.trim().slice(0,max+1):"";
};
const uuid=(v:string)=>/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(v);
const checked=(f:FormData,key:string)=>f.get(key)==="yes";
function safeUrl(value:string):string|null|undefined{
 if(!value)return null;
 return parseAllowedHttpUrl(value)?.href??undefined;
}
function refreshGuest(slug?:string){
 revalidatePath("/guests");
 revalidatePath("/guests/autographs");
 revalidatePath("/schedule");
 revalidatePath("/admin/guest-experiences");
 revalidatePath("/admin");
 revalidatePath("/sitemap.xml");
 if(slug)revalidatePath("/guests/"+slug);
}

async function admin(){
 const actor=await requireOrganizer();
 const db=await createSupabaseServerClient();
 return db?{actor,db}:null;
}

export async function createGuestExperienceAction(
 _state:AdminActionState,form:FormData,
):Promise<AdminActionState>{
 const session=await admin();
 if(!session)return fail("Please sign in again.");
 const slug=text(form,"slug",80).toLowerCase();
 const name=text(form,"displayName",160);
 const role=text(form,"roleLabel",140);
 if(!validGuestSlug(slug)||name.length<2||name.length>160||role.length>140){
  return fail("Enter a valid public name, role and lowercase URL slug.");
 }
 const {data,error}=await session.db.from("guest_experiences")
  .insert({slug,display_name:name,role_label:role,booking_status:"inquiry",is_published:false})
  .select("id").single();
 if(error)return fail(error.code==="23505"?"That guest slug already exists.":"Could not create the private guest draft.");
 await recordOrganizerAudit({action:"guest_experience_draft_created",entityType:"guest_experience",
  entityId:data.id,actor:session.actor});
 refreshGuest();
 return success("Private guest draft created. Open it below to prepare pricing, schedules and approved public details.");
}

export async function updateGuestExperienceAction(
 _state:AdminActionState,form:FormData,
):Promise<AdminActionState>{
 const session=await admin();
 if(!session)return fail("Please sign in again.");
 const id=text(form,"guestId",36);
 if(!uuid(id))return fail("Invalid guest.");
 const {data:current,error:readError}=await session.db.from("guest_experiences")
  .select("slug,booking_status,is_published").eq("id",id).maybeSingle();
 if(readError||!current)return fail("Guest draft not found.");

 const name=text(form,"displayName",160),role=text(form,"roleLabel",140);
 const bio=text(form,"bio",3500), imageRaw=text(form,"imageUrl",600);
 const purchaseRaw=text(form,"purchaseUrl",600);
 const imageUrl=safeUrl(imageRaw),purchaseUrl=safeUrl(purchaseRaw);
 const status=text(form,"bookingStatus",20);
 const publish=checked(form,"publish");
 const priceKeys=["autographPrice","selfiePrice","photoOpPrice","comboPrice"] as const;
 const prices=priceKeys.map(key=>dollarsToCents(text(form,key,20)));
 const autographAvailable=checked(form,"autographAvailable");
 const selfieAvailable=checked(form,"selfieAvailable");
 const photoAvailable=checked(form,"photoOpAvailable");
 const sortOrder=Number(text(form,"sortOrder",6));
 const autographDetails=text(form,"autographDetails",2000);
 const photoDetails=text(form,"photoDetails",2000);
 const salesNotes=text(form,"salesNotes",2000);
 const locationNotes=text(form,"locationNotes",400);
 const scheduleNotes=text(form,"publicScheduleNotes",1200);
 const internalNotes=text(form,"internalNotes",4000);

 if(name.length<2||name.length>160||role.length>140||bio.length>3500||
  imageRaw.length>600||purchaseRaw.length>600||
  autographDetails.length>2000||photoDetails.length>2000||
  salesNotes.length>2000||locationNotes.length>400||
  scheduleNotes.length>1200||internalNotes.length>4000||
  !GUEST_BOOKING_STATUSES.includes(status as GuestBookingStatus) ||
  !Number.isInteger(sortOrder)||sortOrder<0||sortOrder>9999||
  prices.some(n=>n===undefined)||(imageRaw&&!imageUrl)||(purchaseRaw&&!purchaseUrl)){
  return fail("Check guest details, HTTPS links, sorting and prices (USD, at most two decimal places).");
 }
 if(status==="contracted"&&!checked(form,"contractVerified")){
  return fail("Confirm an executed guest agreement exists before selecting Signed agreement.");
 }
 if(publish && (status!=="contracted" || !checked(form,"approvePublication"))){
  return fail("Only guests with a signed agreement and explicit announcement approval can be published.");
 }
 if(publish && (!role||!bio)){
  return fail("Add the public role and biography before publishing.");
 }
 // Price boxes are deliberately omitted for services not explicitly available.
 const fields={
  display_name:name,role_label:role,bio,image_url:imageUrl,
  booking_status:status,is_published:publish,sort_order:sortOrder,
  autograph_available:autographAvailable,
  autograph_price_cents:autographAvailable?prices[0]:null,
  selfie_available:selfieAvailable,
  selfie_price_cents:selfieAvailable?prices[1]:null,
  photo_op_available:photoAvailable,
  photo_op_price_cents:photoAvailable?prices[2]:null,
  combo_price_cents:autographAvailable && (photoAvailable || selfieAvailable)?prices[3]:null,
  autograph_details:autographDetails,photo_details:photoDetails,
  sales_notes:salesNotes,purchase_url:purchaseUrl,
  location_notes:locationNotes,public_schedule_notes:scheduleNotes,
  internal_notes:internalNotes,
 };
 const {error}=await session.db.from("guest_experiences").update(fields).eq("id",id);
 if(error)return fail("Unable to save guest experience settings.");
 await recordOrganizerAudit({action:publish?"guest_appearance_published":"guest_appearance_saved_private",
  entityType:"guest_experience",entityId:id,actor:session.actor});
 refreshGuest(current.slug);
 return success(publish?"The signed guest and approved experiences are published.":"Guest details saved privately. No public announcement was made.");
}

export async function saveGuestSessionAction(
 _state:AdminActionState,form:FormData,
):Promise<AdminActionState>{
 const session=await admin();
 if(!session)return fail("Please sign in again.");
 const id=text(form,"sessionId",36),guestId=text(form,"guestId",36);
 if(!uuid(guestId)||(id&&!uuid(id)))return fail("Invalid guest session.");
 const date=text(form,"sessionDate",10),type=text(form,"sessionType",20);
 const start=text(form,"startTime",5),end=text(form,"endTime",5);
 const location=text(form,"locationLabel",120),note=text(form,"publicNote",500);
 const sortOrder=Number(text(form,"sortOrder",6)||"0");
 const published=checked(form,"published");
 if(!validGuestEventDate(date)||!validSessionType(type)||
   !validGuestTime(start)||!validGuestTime(end)||end<=start||
   location.length>120||note.length>500||
   !Number.isInteger(sortOrder)||sortOrder<0||sortOrder>9999){
   return fail("Check the date (October 16–17, 2027), start/end times, location and notes.");
 }
 const {data:guest,error:guestError}=await session.db.from("guest_experiences")
  .select("slug,autograph_available,photo_op_available,selfie_available,booking_status")
  .eq("id",guestId).maybeSingle();
 if(guestError||!guest)return fail("Guest not found.");
 if(published && guest.booking_status!=="contracted"){
  return fail("You cannot publish signing schedules until the guest agreement is signed.");
 }
 if(published && (
   (type==="autograph"&&!guest.autograph_available)||
   (type==="photo_op"&&!guest.photo_op_available)||
   (type==="selfie"&&!guest.selfie_available)
 ))return fail("Enable that experience for this guest before publishing its schedule.");
 const fields={
  guest_id:guestId,session_type:type,session_date:date,start_time:start,
  end_time:end,location_label:location,public_note:note,
  is_published:published,sort_order:sortOrder,
 };
 if(id){
   const {data,error}=await session.db.from("guest_experience_sessions")
    .update(fields).eq("id",id).eq("guest_id",guestId).select("id").maybeSingle();
   if(error||!data)return fail("Could not update this session.");
 }else{
   const {error}=await session.db.from("guest_experience_sessions").insert(fields);
   if(error)return fail("Could not create the session.");
 }
 await recordOrganizerAudit({action:id?"guest_session_updated":"guest_session_created",
  entityType:"guest_experience_session",entityId:id||null,actor:session.actor});
 refreshGuest(guest.slug);
 return success("Guest session saved. It is only public when both the session and guest are published.");
}

export async function deleteGuestSessionAction(
 _state:AdminActionState,form:FormData,
):Promise<AdminActionState>{
 const session=await admin();
 if(!session)return fail("Please sign in again.");
 const id=text(form,"sessionId",36),guestId=text(form,"guestId",36);
 if(!uuid(id)||!uuid(guestId)||!checked(form,"confirmDelete"))return fail("Confirm session removal.");
 const {data,error}=await session.db.from("guest_experience_sessions")
  .delete().eq("id",id).eq("guest_id",guestId).select("id").maybeSingle();
 if(error||!data)return fail("Could not remove this session.");
 const {data:guest}=await session.db.from("guest_experiences")
  .select("slug").eq("id",guestId).maybeSingle();
 await recordOrganizerAudit({action:"guest_session_deleted",
  entityType:"guest_experience_session",entityId:id,actor:session.actor});
 refreshGuest(guest?.slug);
 return success("Session removed.");
}
