import { reviewPanelProposal } from "@/app/actions/panels";
import { ActionForm } from "@/components/admin/ActionForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatAdminDateTime } from "@/lib/admin/time";
import { PANEL_STATUSES, PANEL_STATUS_LABELS, type PanelStatus } from "@/lib/panels/schema";

export const dynamic = "force-dynamic";

type Row = {
 id:string;reference:string;contact_name:string;display_name:string|null;
 email:string;phone:string|null;social_url:string|null;
 panel_title:string;topic_category:string;panel_format:string;
 duration_minutes:number;description:string;audience:string;
 estimated_attendance:string;co_presenters:string|null;
 past_experience:string|null;av_needs:string|null;
 scheduling_notes:string|null;accessibility_needs:string|null;
 status:PanelStatus;internal_notes:string;created_at:string;
};

export default async function PanelReviewPage({searchParams}:{
 searchParams:Promise<{status?:string;q?:string}>
}){
 const {status="",q=""}=await searchParams;
 const filter=PANEL_STATUSES.includes(status as PanelStatus)?status:"";
 const query=q.trim().slice(0,120).replace(/[%_,()]/g,"");
 const supabase=await createSupabaseServerClient();
 if(!supabase)return <p className="text-magenta">Please sign in again.</p>;
 let request=supabase.from("panel_submissions").select("*").order("created_at",{ascending:false}).limit(250);
 if(filter)request=request.eq("status",filter);
 if(query)request=request.ilike("panel_title",`%${query}%`);
 const {data,error}=await request;
 if(error)return <p role="alert" className="text-magenta">Unable to load panel proposals. Please retry.</p>;
 const rows=(data??[]) as Row[];
 return <div>
  <h1 className="font-display text-4xl uppercase tracking-wide text-paper">Panel submissions</h1>
  <p className="mt-2 text-muted">Private organizer queue. Saving a review status does not contact the applicant or publish a schedule entry.</p>
  <form className="mt-6 flex flex-col gap-3 sm:flex-row">
   <select name="status" defaultValue={filter} aria-label="Filter by panel status" className="min-h-11 border border-line bg-ink px-3 py-2 text-paper">
    <option value="">All statuses</option>{PANEL_STATUSES.map(s=><option key={s} value={s}>{PANEL_STATUS_LABELS[s]}</option>)}
   </select>
   <input name="q" defaultValue={query} placeholder="Search title" aria-label="Search by panel title" className="min-h-11 min-w-0 flex-1 border border-line bg-ink px-3 py-2 text-paper"/>
   <button type="submit" className="min-h-11 border border-cyan px-5 py-2 font-display uppercase text-cyan">Filter</button>
  </form>
  <p className="mt-5 text-sm text-muted">{rows.length} proposals shown (up to 250 most recent).</p>
  <div className="mt-5 space-y-5">
   {rows.map(row=><article key={row.id} className="border border-line bg-panel p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
     <div>
      <p className="font-pixel text-[11px] uppercase tracking-wider text-cyan">{row.reference}</p>
      <h2 className="mt-3 font-display text-3xl uppercase text-paper">{row.panel_title}</h2>
      <p className="mt-2 text-sm text-muted">{row.topic_category} · {row.panel_format} · {row.duration_minutes} min</p>
      <p className="mt-2 text-sm text-muted">Submitted {formatAdminDateTime(row.created_at)}</p>
     </div>
     <span className="border border-cyan/40 px-3 py-2 font-display text-sm uppercase tracking-wide text-cyan">{PANEL_STATUS_LABELS[row.status]}</span>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
     <section className="space-y-2">
      <h3 className="font-display text-xl uppercase text-gold">Proposal</h3>
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-paper/90">{row.description}</p>
      <p className="text-sm text-muted">Audience: {row.audience} · Expected: {row.estimated_attendance}</p>
      {row.co_presenters&&<p className="whitespace-pre-wrap break-words text-sm text-muted"><strong className="text-paper">Other presenters:</strong> {row.co_presenters}</p>}
      {row.past_experience&&<p className="whitespace-pre-wrap break-words text-sm text-muted"><strong className="text-paper">Experience:</strong> {row.past_experience}</p>}
     </section>
     <section className="space-y-2">
      <h3 className="font-display text-xl uppercase text-gold">Contact & requirements</h3>
      <p className="text-sm text-paper">{row.contact_name}{row.display_name?` (${row.display_name})`:""}</p>
      <a href={`mailto:${row.email}`} className="block break-all text-sm text-cyan underline">{row.email}</a>
      {row.phone&&<p className="text-sm text-muted">{row.phone}</p>}
      {row.social_url&&<p className="break-all text-sm text-muted">{row.social_url}</p>}
      {row.av_needs&&<p className="whitespace-pre-wrap break-words text-sm text-muted">A/V: {row.av_needs}</p>}
      {row.scheduling_notes&&<p className="whitespace-pre-wrap break-words text-sm text-muted">Schedule: {row.scheduling_notes}</p>}
      {row.accessibility_needs&&<p className="whitespace-pre-wrap break-words text-sm text-muted">Accommodation: {row.accessibility_needs}</p>}
     </section>
    </div>
    <ActionForm action={reviewPanelProposal} className="mt-6 border-t border-line pt-5">
     <input type="hidden" name="id" value={row.id}/>
     <div className="grid gap-3 md:grid-cols-[minmax(0,220px)_1fr_auto] md:items-end">
      <label className="block text-sm text-paper">Review status
       <select name="status" defaultValue={row.status} className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2">
        {PANEL_STATUSES.map(s=><option key={s} value={s}>{PANEL_STATUS_LABELS[s]}</option>)}
       </select>
      </label>
      <label className="block text-sm text-paper">Private reviewer notes
       <textarea name="internalNotes" defaultValue={row.internal_notes||""} maxLength={4000} rows={2} className="mt-2 w-full border border-paper/25 bg-ink px-3 py-2"/>
      </label>
      <button type="submit" className="min-h-11 bg-cyan px-5 py-2 font-display text-sm uppercase text-ink">Save review</button>
     </div>
    </ActionForm>
   </article>)}
  </div>
  {rows.length===0&&<p className="mt-8 border border-line bg-panel p-6 text-muted">No proposals match these filters yet.</p>}
 </div>
}
