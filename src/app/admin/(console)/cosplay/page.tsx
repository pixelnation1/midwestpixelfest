import { reviewCosplayEntry } from "@/app/actions/cosplay-contest";
import { ActionForm } from "@/components/admin/ActionForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatAdminDateTime } from "@/lib/admin/time";
import { COSPLAY_STATUSES, COSPLAY_STATUS_LABELS, type CosplayStatus } from "@/lib/cosplay-contest/schema";

export const dynamic="force-dynamic";
type RecordRow={
 id:string;reference:string;contact_name:string;email:string;phone:string|null;
 public_name:string;age_band:string;guardian_confirmed:boolean;
 entry_type:string;group_size:number;division_preference:string;
 character_name:string;series_name:string|null;costume_description:string;
 construction_type:string;build_notes:string|null;props_description:string|null;
 reference_url:string|null;day_preference:string;stage_notes:string|null;
 accessibility_needs:string|null;status:CosplayStatus;internal_notes:string;
 created_at:string;
};
const ageLabels:Record<string,string>={adult:"All adults",teen:"Includes ages 13–17",child:"Includes ages 12 and under"};
const divisions:Record<string,string>={
 beginner:"Beginner craftsmanship",experienced:"Experienced craftsmanship",
 group:"Group",youth:"Youth showcase",showcase:"Community showcase",
};
function Details({label,value}:{label:string;value:string|null|undefined}){
 if(!value)return null;
 return <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted"><strong className="text-paper">{label}: </strong>{value}</p>;
}
export default async function CosplayReviewPage({searchParams}:{
 searchParams:Promise<{status?:string;q?:string}>
}){
 const {status="",q=""}=await searchParams;
 const filter=COSPLAY_STATUSES.includes(status as CosplayStatus)?status:"";
 const query=q.trim().slice(0,100).replace(/[%,()]/g,"");
 const supabase=await createSupabaseServerClient();
 if(!supabase)return <p className="text-magenta">Please sign in again.</p>;
 let request=supabase.from("cosplay_contest_entries").select("*").order("created_at",{ascending:false}).limit(200);
 if(filter)request=request.eq("status",filter);
 if(query)request=request.ilike("character_name",`%${query}%`);
 const {data,error}=await request;
 if(error)return <p role="alert" className="text-magenta">Could not load cosplay registrations. Please retry.</p>;
 const entries=(data??[]) as RecordRow[];
 return <div>
  <h1 className="font-display text-4xl uppercase tracking-wide text-paper">Cosplay Contest Applications</h1>
  <p className="mt-2 text-muted">Private organizer queue. Review decisions are internal: changing a status does not schedule contestants, publish their details or email them.</p>
  <form className="mt-6 flex flex-col gap-3 sm:flex-row">
   <label className="sr-only" htmlFor="cosplay-admin-status">Filter by status</label>
   <select id="cosplay-admin-status" name="status" defaultValue={filter} className="min-h-11 border border-line bg-ink px-3 py-2">
    <option value="">All statuses</option>{COSPLAY_STATUSES.map(s=><option key={s} value={s}>{COSPLAY_STATUS_LABELS[s]}</option>)}
   </select>
   <label className="sr-only" htmlFor="cosplay-admin-query">Search costume</label>
   <input id="cosplay-admin-query" name="q" defaultValue={query} placeholder="Search character or costume" className="min-h-11 min-w-0 flex-1 border border-line bg-ink px-3 py-2"/>
   <button type="submit" className="min-h-11 border border-cyan px-5 py-2 font-display uppercase text-cyan">Filter</button>
  </form>
  <p className="mt-5 text-sm text-muted">{entries.length} registrations shown (up to the 200 most recent).</p>
  <div className="mt-5 space-y-5">
   {entries.map(e=><article key={e.id} className="border border-line bg-panel p-5 sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
     <div>
      <p className="font-pixel text-[11px] uppercase tracking-wide text-cyan">{e.reference}</p>
      <h2 className="mt-3 font-display text-3xl uppercase text-paper">{e.character_name}</h2>
      <p className="mt-2 text-sm text-muted">{e.public_name} · {divisions[e.division_preference]??e.division_preference} · {e.entry_type==="group"?"Group of "+e.group_size:"Individual"}</p>
      <p className="mt-2 text-xs text-muted">Received {formatAdminDateTime(e.created_at)}</p>
     </div>
     <span className="border border-cyan/40 px-3 py-2 font-display text-sm uppercase text-cyan">{COSPLAY_STATUS_LABELS[e.status]}</span>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-2">
     <section>
      <h3 className="font-display text-xl uppercase text-gold">Costume details</h3>
      <Details label="Source" value={e.series_name}/>
      <Details label="Description" value={e.costume_description}/>
      <Details label="Construction" value={e.construction_type.replaceAll("_"," ")}/>
      <Details label="Build notes" value={e.build_notes}/>
      <Details label="Props" value={e.props_description}/>
      <Details label="Reference link (unverified)" value={e.reference_url}/>
     </section>
     <section>
      <h3 className="font-display text-xl uppercase text-gold">Contact & scheduling</h3>
      <p className="mt-3 text-sm text-paper">{e.contact_name}</p>
      <a href={`mailto:${e.email}`} className="mt-2 block break-all text-sm text-cyan underline">{e.email}</a>
      <Details label="Phone" value={e.phone}/>
      <Details label="Age band" value={ageLabels[e.age_band]??e.age_band}/>
      {e.age_band!=="adult"&&<Details label="Adult permission confirmed" value={e.guardian_confirmed?"Yes":"No"}/>}
      <Details label="Preferred day" value={e.day_preference}/>
      <Details label="Stage notes" value={e.stage_notes}/>
      <Details label="Accommodation request" value={e.accessibility_needs}/>
     </section>
    </div>
    <ActionForm action={reviewCosplayEntry} className="mt-6 border-t border-line pt-5">
     <input type="hidden" name="id" value={e.id}/>
     <div className="grid gap-3 md:grid-cols-[220px_1fr_auto] md:items-end">
      <label className="text-sm text-paper">Review status
       <select name="status" defaultValue={e.status} className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2">
        {COSPLAY_STATUSES.map(s=><option key={s} value={s}>{COSPLAY_STATUS_LABELS[s]}</option>)}
       </select>
      </label>
      <label className="text-sm text-paper">Private organizer notes
       <textarea name="internalNotes" defaultValue={e.internal_notes||""} rows={2} maxLength={4000} className="mt-2 w-full border border-paper/25 bg-ink px-3 py-2"/>
      </label>
      <button type="submit" className="min-h-11 bg-cyan px-5 py-2 font-display text-sm uppercase text-ink">Save review</button>
     </div>
    </ActionForm>
   </article>)}
  </div>
  {entries.length===0&&<p className="mt-8 border border-line bg-panel p-6 text-muted">No cosplay registrations match those filters.</p>}
 </div>;
}
