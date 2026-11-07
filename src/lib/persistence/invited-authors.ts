import "server-only";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { parseAllowedHttpUrl } from "@/lib/safe-url";
import type { PublicInvitedAuthor } from "@/lib/invited-authors/model";

/** Public guest list includes invited authors only with BOTH program confirmation
 * and separately contracted, public official guest profile.
 * Never select contact emails, private ideas or negotiated terms here.
 */
export async function listPublicInvitedAuthors():Promise<PublicInvitedAuthor[]>{
 const supabase=createSupabaseServiceClient();
 if(!supabase)return [];
 const {data:authors,error}=await supabase.from("invited_author_guests")
   .select("id,public_name,public_bio,public_activities,public_books,public_signing_notes,image_url,website_url,guest_experience_id")
   .eq("invitation_status","confirmed").eq("is_published",true)
   .not("guest_experience_id","is",null)
   .order("sort_order",{ascending:true}).order("public_name",{ascending:true})
   .limit(150);
 if(error){
   console.error("public_invited_author_fetch_failed",{code:error.code});
   return [];
 }
 const candidates=authors??[];
 if(!candidates.length)return [];
 const guestIds=[...new Set(candidates.map(a=>a.guest_experience_id).filter((id):id is string=>!!id))];
 const {data:guests,error:guestError}=await supabase.from("guest_experiences")
   .select("id,slug").in("id",guestIds)
   .eq("booking_status","contracted").eq("is_published",true);
 if(guestError){
   console.error("public_author_guest_link_fetch_failed",{code:guestError.code});
   return [];
 }
 const guestById=new Map((guests??[]).map(g=>[g.id,g.slug]));
 return candidates.filter(a=>a.guest_experience_id && guestById.has(a.guest_experience_id))
   .map(a=>({
     id:a.id,
     public_name:a.public_name,
     public_bio:a.public_bio,
     public_activities:a.public_activities,
     public_books:a.public_books,
     public_signing_notes:a.public_signing_notes,
     image_url:a.image_url?parseAllowedHttpUrl(a.image_url)?.href??null:null,
     website_url:a.website_url?parseAllowedHttpUrl(a.website_url)?.href??null:null,
     guest_slug:guestById.get(a.guest_experience_id as string)!,
   }));
}
