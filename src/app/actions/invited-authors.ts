"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizer } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import { validAuthorEmail, validAuthorStatus, canPublishInvitedAuthor } from "@/lib/invited-authors/model";
import type { AdminActionState } from "@/app/actions/admin";

const success=(message:string):AdminActionState=>({status:"success",message});
const fail=(message:string):AdminActionState=>({status:"error",message});
function read(form:FormData,name:string):string{
 const value=form.get(name);
 return typeof value==="string"?value.trim():"";
}
const uuid=(value:string)=>/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value);
const yes=(form:FormData,name:string)=>read(form,name)==="yes";
function validHttps(value:string):string|null|undefined{
 if(!value)return null;
 return parseAllowedHttpUrl(value)?.href??undefined;
}
function refreshAuthor(guestSlug?:string){
 for(const path of ["/guests/authors","/guests","/admin/invited-authors","/admin/guest-experiences","/sitemap.xml"])
  revalidatePath(path);
 if(guestSlug)revalidatePath("/guests/"+guestSlug);
}

export async function createInvitedAuthorAction(
 _previous:AdminActionState,form:FormData,
):Promise<AdminActionState>{
 const organizer=await requireOrganizer();
 const db=await createSupabaseServerClient();
 if(!db)return fail("Your organizer session has expired.");
 const name=read(form,"authorName");
 const email=read(form,"contactEmail");
 const siteRaw=read(form,"websiteUrl");
 const site=validHttps(siteRaw);
 const works=read(form,"workOrSeries");
 const ideas=read(form,"privateProgrammingIdeas");
 if(name.length<2||name.length>160||!validAuthorEmail(email)||
  siteRaw.length>500||(siteRaw&&!site)||works.length>1200||ideas.length>4000){
  return fail("Check the author name, email, HTTPS website, books and programming notes.");
 }
 const {data,error}=await db.from("invited_author_guests")
  .insert({
   author_name:name,contact_email:email||null,website_url:site,
   work_or_series:works,private_programming_ideas:ideas,
   invitation_status:"prospect",is_published:false,
  }).select("id").single();
 if(error)return fail("Could not create this private author candidate.");
 await recordOrganizerAudit({action:"invited_author_candidate_created",
  entityType:"invited_author_guest",entityId:data.id,actor:organizer});
 refreshAuthor();
 return success("Private author candidate saved. No invitation was sent or public announcement made.");
}

export async function updateInvitedAuthorAction(
 _previous:AdminActionState,form:FormData,
):Promise<AdminActionState>{
 const organizer=await requireOrganizer();
 const db=await createSupabaseServerClient();
 if(!db)return fail("Your organizer session has expired.");
 const id=read(form,"authorId");
 if(!uuid(id))return fail("Invalid author record.");
 const {data:existing,error:readError}=await db.from("invited_author_guests")
  .select("id,guest_experience_id").eq("id",id).maybeSingle();
 if(readError||!existing)return fail("Author record not found.");

 const name=read(form,"authorName");
 const email=read(form,"contactEmail");
 const siteRaw=read(form,"websiteUrl");
 const imageRaw=read(form,"imageUrl");
 const website=validHttps(siteRaw);
 const image=validHttps(imageRaw);
 const works=read(form,"workOrSeries"),ideas=read(form,"privateProgrammingIdeas");
 const notes=read(form,"privateTermsNotes");
 const status=read(form,"invitationStatus");
 const publicName=read(form,"publicName");
 const publicBio=read(form,"publicBio");
 const activities=read(form,"publicActivities");
 const books=read(form,"publicBooks");
 const signing=read(form,"publicSigningNotes");
 const guestId=read(form,"guestExperienceId");
 const sortRaw=read(form,"sortOrder");
 const sort=Number(sortRaw);
 const published=yes(form,"publish");

 if(name.length<2||name.length>160||!validAuthorEmail(email)||
  siteRaw.length>500||imageRaw.length>500||(siteRaw&&!website)||(imageRaw&&!image)||
  works.length>1200||ideas.length>4000||notes.length>4000||
  !validAuthorStatus(status)||publicName.length>160||publicBio.length>3500||
  activities.length>1600||books.length>1000||signing.length>1600||
  (guestId&&!uuid(guestId))||!Number.isInteger(sort)||sort<0||sort>9999){
  return fail("Check the names, statuses, approved URLs, description limits and display order.");
 }

 if(status==="confirmed" && !yes(form,"termsConfirmed")){
  return fail("Mark participation as confirmed only after agreeing the author appearance and table/sales terms.");
 }
 let guestContracted=false,guestPublished=false,guestSlug="";
 if(guestId){
  const {data:guest,error}=await db.from("guest_experiences")
   .select("slug,booking_status,is_published").eq("id",guestId).maybeSingle();
  if(error||!guest)return fail("The linked guest profile was not found.");
  guestContracted=guest.booking_status==="contracted";
  guestPublished=guest.is_published===true;
  guestSlug=guest.slug;
 }
 if(published && !canPublishInvitedAuthor({
  authorConfirmed:status==="confirmed",
  guestContracted,guestPublished,
  approval:yes(form,"approvePublication"),
  hasName:!!publicName,hasBio:!!publicBio,
 })){
  return fail("Public listing requires agreed author terms, an officially contracted and published guest profile, complete public information, and explicit announcement approval.");
 }

 const {error}=await db.from("invited_author_guests").update({
  author_name:name,contact_email:email||null,website_url:website,
  work_or_series:works,private_programming_ideas:ideas,
  private_terms_notes:notes,invitation_status:status,
  guest_experience_id:guestId||null,
  public_name:publicName,public_bio:publicBio,public_activities:activities,
  public_books:books,public_signing_notes:signing,image_url:image,
  is_published:published,sort_order:sort,
 }).eq("id",id);
 if(error)return fail("Could not save the author guest record.");

 await recordOrganizerAudit({action:published?"invited_author_published":"invited_author_private_update",
  entityType:"invited_author_guest",entityId:id,actor:organizer});
 refreshAuthor(guestSlug);
 return success(published
  ?"Confirmed author guest published on the invited author lineup."
  :"Author record saved privately. No invitation or announcement was sent.");
}
