import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { updateInvitedAuthorAction } from "@/app/actions/invited-authors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
 AUTHOR_INVITATION_STATUSES,AUTHOR_INVITATION_LABELS,
 type AuthorInvitationStatus,
} from "@/lib/invited-authors/model";

export const dynamic="force-dynamic";
type AuthorRow={
 id:string;author_name:string;contact_email:string|null;website_url:string|null;
 work_or_series:string;private_programming_ideas:string;private_terms_notes:string;
 invitation_status:AuthorInvitationStatus;guest_experience_id:string|null;
 public_name:string;public_bio:string;public_activities:string;
 public_books:string;public_signing_notes:string;image_url:string|null;
 is_published:boolean;sort_order:number;
};
type GuestOption={
 id:string;display_name:string;booking_status:string;is_published:boolean;
};
const style="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2 text-base text-paper focus:border-cyan focus:outline-none";
const label="block text-sm text-paper";

export default async function InvitedAuthorDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id))notFound();
 const db=await createSupabaseServerClient();
 if(!db)return <p className="text-magenta">Sign in again.</p>;
 const [authorResult,guestResult]=await Promise.all([
  db.from("invited_author_guests").select("*").eq("id",id).maybeSingle(),
  db.from("guest_experiences").select("id,display_name,booking_status,is_published")
   .order("display_name",{ascending:true}).limit(200),
 ]);
 if(authorResult.error||guestResult.error)
  return <p role="alert" className="text-magenta">Unable to load private author details.</p>;
 if(!authorResult.data)notFound();
 const author=authorResult.data as AuthorRow;
 const guests=(guestResult.data??[]) as GuestOption[];
 return <div className="space-y-8">
  <nav aria-label="Breadcrumb" className="font-pixel text-[11px] uppercase tracking-widest text-muted">
   <Link href="/admin/invited-authors" className="text-cyan hover:text-gold">Invited Authors</Link>
   <span className="mx-3 text-magenta">/</span>{author.author_name}
  </nav>
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">
    {AUTHOR_INVITATION_LABELS[author.invitation_status]} · {author.is_published?"Public":"Private"}
   </p>
   <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">{author.author_name}</h1>
   <p className="mt-4 max-w-3xl leading-relaxed text-muted">
    This is an invited-program relationship, separate from standard Artist Alley.
    Keep terms, author correspondence and programming ideas private until a
    written appearance agreement and publication approval are in place.
   </p>
  </div>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Private invitation & public profile</h2>
   <ActionForm action={updateInvitedAuthorAction} className="mt-6 space-y-5">
    <input type="hidden" name="authorId" value={author.id}/>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className={label}>Author name / internal label
      <input name="authorName" required maxLength={160} defaultValue={author.author_name} className={style}/>
     </label>
     <label className={label}>Author contact email (private)
      <input name="contactEmail" type="email" maxLength={254} defaultValue={author.contact_email??""} className={style}/>
     </label>
    </div>
    <label className={label}>Author website (HTTPS)
     <input type="url" name="websiteUrl" maxLength={500} defaultValue={author.website_url??""}
      className={style} placeholder="https://..."/>
    </label>
    <label className={label}>Work, titles or series (private)
     <input name="workOrSeries" maxLength={1200} defaultValue={author.work_or_series} className={style}/>
    </label>
    <label className={label}>Potential programming contributions (private)
     <textarea name="privateProgrammingIdeas" rows={4} maxLength={4000}
      defaultValue={author.private_programming_ideas} className={style}/>
    </label>
    <label className={label}>Negotiated terms / private organizer notes
     <textarea name="privateTermsNotes" rows={5} maxLength={4000}
      defaultValue={author.private_terms_notes} className={style}/>
     <p className="mt-1 text-xs leading-relaxed text-muted">
      Record table/book sales, guest badge, honorarium, travel, session commitments,
      approvals and contract conditions here. Nothing in this field is published.
     </p>
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className={label}>Program relationship
      <select name="invitationStatus" defaultValue={author.invitation_status} className={style}>
       {AUTHOR_INVITATION_STATUSES.map(value=><option key={value} value={value}>
        {AUTHOR_INVITATION_LABELS[value]}
       </option>)}
      </select>
     </label>
     <label className={label}>Link official guest profile
      <select name="guestExperienceId" defaultValue={author.guest_experience_id??""} className={style}>
       <option value="">None — remains private</option>
       {guests.map(guest=><option key={guest.id} value={guest.id}>
        {guest.display_name} · {guest.booking_status}{guest.is_published?" · public":""}
       </option>)}
      </select>
      <p className="mt-1 text-xs leading-relaxed text-muted">
       Create and publish the signed appearance via{" "}
       <Link href="/admin/guest-experiences" className="text-cyan underline">Guest Experiences</Link>.
      </p>
     </label>
    </div>
    <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
     <input type="checkbox" name="termsConfirmed" value="yes" className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
     I verify the author has agreed to their participation details in writing
     if marking this invitation as confirmed.
    </label>

    <div className="border-t border-line pt-6">
     <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Author-facing announcement</p>
     <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">Approved public information</h3>
     <p className="mt-3 text-sm leading-relaxed text-muted">
      Only these fields may appear on the official Invited Author Guest Program page.
      Do not copy contact details or private terms into public fields.
     </p>
    </div>
    <label className={label}>Public author name
     <input name="publicName" maxLength={160} defaultValue={author.public_name} className={style}/>
    </label>
    <label className={label}>Approved public biography
     <textarea name="publicBio" rows={5} maxLength={3500}
      defaultValue={author.public_bio} className={style}/>
    </label>
    <label className={label}>Approved books / series to mention
     <input name="publicBooks" maxLength={1000} defaultValue={author.public_books} className={style}/>
    </label>
    <label className={label}>Approved panels, readings or workshops
     <textarea name="publicActivities" rows={3} maxLength={1600}
      defaultValue={author.public_activities} className={style}/>
     <p className="mt-1 text-xs text-muted">Only list programming confirmed with the author and event staff.</p>
    </label>
    <label className={label}>Public signing or book sales arrangements
     <textarea name="publicSigningNotes" rows={3} maxLength={1600}
      defaultValue={author.public_signing_notes} className={style}/>
     <p className="mt-1 text-xs text-muted">Leave blank until the arrangements are approved.</p>
    </label>
    <label className={label}>Authorized author image URL (HTTPS)
     <input name="imageUrl" type="url" maxLength={500} defaultValue={author.image_url??""}
      className={style} placeholder="https://..."/>
    </label>
    <label className={label}>Display order
     <input name="sortOrder" type="number" min={0} max={9999} step={1}
      defaultValue={author.sort_order} className={style}/>
    </label>
    <div className="border-t border-gold/30 pt-6">
     <h3 className="font-display text-2xl uppercase tracking-wide text-gold">Public announcement controls</h3>
     <p className="mt-3 text-sm leading-relaxed text-muted">
      Publication requires confirmed invited-author terms, a separately contracted
      and published guest profile, an approved biography and your explicit approval.
      Other invitation statuses remain private automatically.
     </p>
     <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="publish" value="yes" defaultChecked={author.is_published}
       className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
      Publish this author as an official Invited Author Guest
     </label>
     <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="approvePublication" value="yes" className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
      I confirm the author and organizer have approved the public announcement.
     </label>
    </div>
    <button type="submit" className="min-h-12 bg-magenta px-6 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
     Save invited author guest
    </button>
   </ActionForm>
  </section>
  <div className="flex flex-wrap gap-3">
   <Link href="/guests/authors" target="_blank" rel="noopener noreferrer"
    className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
    View public program ↗
   </Link>
   <Link href="/admin/guest-experiences"
    className="inline-flex min-h-11 items-center border border-paper/30 px-5 py-3 font-display text-sm uppercase tracking-wider text-paper">
    Guest contracts and profiles
   </Link>
  </div>
 </div>;
}
