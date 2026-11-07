import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { createInvitedAuthorAction } from "@/app/actions/invited-authors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AUTHOR_INVITATION_LABELS, type AuthorInvitationStatus } from "@/lib/invited-authors/model";
import { formatAdminDateTime } from "@/lib/admin/time";

export const dynamic="force-dynamic";

type AuthorRow={
 id:string;author_name:string;contact_email:string|null;
 work_or_series:string;invitation_status:AuthorInvitationStatus;
 is_published:boolean;updated_at:string;
};

export default async function InvitedAuthorAdminPage(){
 const db=await createSupabaseServerClient();
 if(!db)return <p className="text-magenta">Please sign in again.</p>;
 const {data,error}=await db.from("invited_author_guests")
  .select("id,author_name,contact_email,work_or_series,invitation_status,is_published,updated_at")
  .order("updated_at",{ascending:false}).limit(200);
 if(error)return <p role="alert" className="text-magenta">The invited author records are temporarily unavailable.</p>;
 const rows=(data??[]) as AuthorRow[];
 const interested=rows.filter(r=>["interested","terms_discussion"].includes(r.invitation_status)).length;
 const confirmed=rows.filter(r=>r.invitation_status==="confirmed").length;
 const published=rows.filter(r=>r.is_published).length;
 return <div className="space-y-9">
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Organizer / Programming invitations</p>
   <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">Invited Author Guests</h1>
   <p className="mt-3 max-w-3xl leading-relaxed text-muted">
    A separate invitation pipeline for authors contributing readings, workshops,
    panels, interviews and signings. It is not a paid Artist Alley application,
    and creating a prospect never sends an invitation or makes a booking.
   </p>
  </div>
  <div className="grid gap-3 sm:grid-cols-3">
   {[
    ["Interested / in discussion",interested],
    ["Participation agreed",confirmed],
    ["Publicly announced",published],
   ].map(([name,count])=><div key={name} className="border border-line bg-panel p-5">
    <p className="font-pixel text-[10px] uppercase tracking-wide text-muted">{name}</p>
    <p className="mt-3 font-display text-4xl text-cyan">{count}</p>
   </div>)}
  </div>
  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Add a private author candidate</h2>
   <p className="mt-3 text-sm leading-relaxed text-muted">
    Keep exploratory conversations organized without committing a free booth,
    travel, payment, admission or program slot.
   </p>
   <ActionForm action={createInvitedAuthorAction} className="mt-5 space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="block text-sm text-paper">Author name *
      <input name="authorName" required maxLength={160} placeholder="Writer or pen name"
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
     </label>
     <label className="block text-sm text-paper">Contact email (private)
      <input name="contactEmail" type="email" maxLength={254}
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
     </label>
    </div>
    <label className="block text-sm text-paper">Website (HTTPS; private until approved)
     <input type="url" name="websiteUrl" placeholder="https://..." maxLength={500}
      className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
    </label>
    <label className="block text-sm text-paper">Books or series
     <input name="workOrSeries" maxLength={1200} placeholder="Genre, titles or known series"
      className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
    </label>
    <label className="block text-sm text-paper">Programming ideas (private)
     <textarea name="privateProgrammingIdeas" maxLength={4000} rows={3}
      placeholder="Writing panel, indie publishing workshop, reading, marketing talk..."
      className="mt-2 w-full border border-paper/25 bg-ink px-4 py-2"/>
    </label>
    <button type="submit" className="min-h-11 bg-magenta px-6 py-3 font-display text-sm uppercase tracking-wider text-ink">
     Save private candidate
    </button>
   </ActionForm>
  </section>

  <section>
   <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Invited author pipeline</h2>
    <Link href="/guests/authors" target="_blank" rel="noopener noreferrer"
     className="font-display text-sm uppercase tracking-wide text-cyan underline underline-offset-4">View public program ↗</Link>
   </div>
   <div className="mt-5 space-y-3">
    {rows.map(row=><article key={row.id}
      className="flex flex-col gap-4 border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
     <div className="min-w-0">
      <p className="font-pixel text-[10px] uppercase tracking-wider text-cyan">
       {AUTHOR_INVITATION_LABELS[row.invitation_status]}
      </p>
      <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-paper">{row.author_name}</h3>
      {row.work_or_series&&<p className="mt-2 text-sm text-gold">{row.work_or_series}</p>}
      <p className="mt-2 text-xs text-muted">
       {row.is_published?"Publicly announced":"Private / not announced"} · Updated {formatAdminDateTime(row.updated_at)}
      </p>
     </div>
     <Link href={"/admin/invited-authors/"+row.id} className="inline-flex min-h-11 shrink-0 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
      Review / edit →
     </Link>
    </article>)}
    {!rows.length&&<p className="border border-line bg-panel p-6 text-muted">
     No author candidates yet. You can add a private prospect without creating
     a vendor application or publishing a guest listing.
    </p>}
   </div>
  </section>
 </div>;
}
