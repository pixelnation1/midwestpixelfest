import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { createGuestExperienceAction } from "@/app/actions/guest-experiences";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GUEST_BOOKING_LABELS, type GuestBookingStatus } from "@/lib/guest-experiences/model";
import { formatAdminDateTime } from "@/lib/admin/time";

export const dynamic="force-dynamic";
type GuestRow={
 id:string;slug:string;display_name:string;role_label:string;
 booking_status:GuestBookingStatus;is_published:boolean;
 autograph_available:boolean;selfie_available:boolean;photo_op_available:boolean;
 updated_at:string;
};

export default async function GuestExperienceAdminPage(){
 const db=await createSupabaseServerClient();
 if(!db)return <p className="text-magenta">Sign in again.</p>;
 const {data,error}=await db.from("guest_experiences")
  .select("id,slug,display_name,role_label,booking_status,is_published,autograph_available,selfie_available,photo_op_available,updated_at")
  .order("updated_at",{ascending:false}).limit(200);
 if(error)return <p role="alert" className="text-magenta">Guest experience database unavailable.</p>;
 const rows=(data??[]) as GuestRow[];
 const contracted=rows.filter(g=>g.booking_status==="contracted").length;
 const published=rows.filter(g=>g.booking_status==="contracted"&&g.is_published).length;

 return <div className="space-y-9">
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Organizer / Guest experiences</p>
   <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">Autographs & Photo Ops</h1>
   <p className="mt-3 max-w-3xl leading-relaxed text-muted">
    Prepare guest signing details, prices, and scheduled photo sessions privately.
    Only signed, publication-approved appearances can become public.
    An inquiry or negotiation is never an official guest announcement.
   </p>
  </div>
  <div className="grid gap-3 sm:grid-cols-3">
   {[
    ["Guest records",rows.length],
    ["Signed agreements",contracted],
    ["Public appearances",published],
   ].map(([label,value])=><div key={label} className="border border-line bg-panel p-5">
    <p className="font-pixel text-[10px] uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-3 font-display text-4xl text-cyan">{value}</p>
   </div>)}
  </div>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Create a private guest record</h2>
   <p className="mt-3 leading-relaxed text-muted">
    Use a draft while negotiating and recording availability. Saving here does
    not book a guest, sign a contract, add a guest to the public site or create an expense.
   </p>
   <ActionForm action={createGuestExperienceAction} className="mt-5 space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="block text-sm text-paper">Guest / artist name *
      <input name="displayName" maxLength={160} required placeholder="Public display name"
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2"/>
     </label>
     <label className="block text-sm text-paper">URL slug *
      <input name="slug" required pattern="[a-z0-9][a-z0-9-]{1,79}" placeholder="guest-name"
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2"/>
     </label>
    </div>
    <label className="block text-sm text-paper">Role / recognition
     <input name="roleLabel" maxLength={140} placeholder="Voice Actor, Performer, Creator, Artist..."
      className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2"/>
    </label>
    <button type="submit" className="min-h-11 bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
     Create private draft
    </button>
   </ActionForm>
  </section>

  <section>
   <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Guest experience records</h2>
    <Link href="/guests/autographs" target="_blank" rel="noopener noreferrer"
      className="font-display text-sm uppercase tracking-wide text-cyan underline">Public experience guide ↗</Link>
   </div>
   <div className="mt-5 space-y-3">
    {rows.map(g=><article key={g.id} className="flex flex-col gap-4 border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
     <div className="min-w-0">
      <p className="font-pixel text-[10px] uppercase tracking-wider text-cyan">
       {GUEST_BOOKING_LABELS[g.booking_status]}
      </p>
      <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{g.display_name}</h3>
      <p className="mt-2 text-sm text-muted">{g.role_label||"Role not entered"} · Updated {formatAdminDateTime(g.updated_at)}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
       <span className={g.is_published?"text-lime":"text-gold"}>{g.is_published?"Published":"Private"}</span>
       {g.autograph_available&&<span className="text-muted">Autographs</span>}
       {g.selfie_available&&<span className="text-muted">Selfies</span>}
       {g.photo_op_available&&<span className="text-muted">Photo ops</span>}
      </div>
     </div>
     <Link href={"/admin/guest-experiences/"+g.id}
       className="inline-flex min-h-11 shrink-0 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
       Edit details →
     </Link>
    </article>)}
    {!rows.length&&<p className="border border-line bg-panel p-7 leading-relaxed text-muted">
      No guest experience records yet. Create a private draft when an agency or
      representative starts a conversation, and only publish after a signed agreement.
    </p>}
   </div>
  </section>
 </div>;
}
