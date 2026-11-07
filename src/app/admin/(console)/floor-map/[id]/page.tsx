import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import {
  uploadFloorPlanAction, updateFloorMapAction, deleteFloorPinAction,
} from "@/app/actions/floor-map";
import { FloorPinEditor } from "@/components/floor-map/FloorPinEditor";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signedFloorPlanUrl } from "@/lib/persistence/floor-maps";
import { floorPinLabel, type FloorMapRecord, type FloorPinRecord } from "@/lib/floor-map/model";

export const dynamic="force-dynamic";

export default async function FloorMapAdminDetail({params}:{
 params:Promise<{id:string}>
}){
 const {id}=await params;
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id))notFound();
 const db=await createSupabaseServerClient();
 if(!db)return <p role="alert" className="text-magenta">Sign in again.</p>;
 const [mapResult,pinsResult,exhibitorResult]=await Promise.all([
   db.from("event_floor_maps").select("*").eq("id",id).maybeSingle(),
   db.from("event_floor_pins").select("*").eq("map_id",id)
     .order("sort_order",{ascending:true}).limit(500),
   db.from("public_vendor_listings").select("id,display_name")
     .eq("published",true).order("display_name",{ascending:true}).limit(400),
 ]);
 if(mapResult.error)return <p role="alert" className="text-magenta">Could not load this floor section.</p>;
 if(!mapResult.data)notFound();
 if(pinsResult.error||exhibitorResult.error)return <p role="alert" className="text-magenta">Floor map details are temporarily unavailable.</p>;
 const floor=mapResult.data as FloorMapRecord;
 const pins=(pinsResult.data??[]).map(p=>({...p,x_pct:Number(p.x_pct),y_pct:Number(p.y_pct)})) as FloorPinRecord[];
 const imageUrl=await signedFloorPlanUrl(floor.image_path);
 const exhibitors=(exhibitorResult.data??[]) as {id:string;display_name:string}[];
 return <div className="space-y-9">
  <nav aria-label="Breadcrumb" className="font-pixel text-[11px] uppercase tracking-widest text-muted">
   <Link href="/admin/floor-map" className="text-cyan hover:text-gold">Floor maps</Link>
   <span className="mx-3 text-magenta" aria-hidden="true">/</span>{floor.title}
  </nav>
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">
    {floor.is_published?"Published to attendees":"Private draft"}
   </p>
   <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">{floor.title}</h1>
   <p className="mt-3 max-w-3xl leading-relaxed text-muted">
    Upload an event-approved image, add markers, then explicitly publish this section.
    Replacing the image will unpublish this section and hide all existing markers
    until you review their positions again.
   </p>
  </div>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">1. Upload approved floor plan</h2>
   <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
    Use an approved PNG, JPG or WebP image up to 3 MB. Upload the plan for the actual
    reserved event space—not a generic example. Files are private until you publish the section.
    If the approved plan is a PDF, export its page as an image first.
   </p>
   <ActionForm action={uploadFloorPlanAction} className="mt-5 space-y-4">
    <input type="hidden" name="mapId" value={id}/>
    <label className="block text-sm text-paper">Floor plan image
     <input type="file" name="floorPlan" required accept="image/png,image/jpeg,image/webp"
       className="mt-2 block min-h-11 w-full border border-paper/30 bg-ink p-3 text-sm text-paper file:mr-3 file:border-0 file:bg-cyan file:px-3 file:py-2 file:font-display file:uppercase file:text-ink"/>
    </label>
    <button type="submit" className="min-h-11 bg-cyan px-6 py-3 font-display text-sm uppercase tracking-wide text-ink">
      Upload / replace floor image
    </button>
   </ActionForm>
   {imageUrl&&<p className="mt-4 text-sm text-cyan">
    <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
      Open current plan image (private temporary link)
    </a>
   </p>}
  </section>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">2. Set public section details</h2>
   <ActionForm action={updateFloorMapAction} className="mt-5 space-y-4">
    <input type="hidden" name="mapId" value={id}/>
    <label className="block text-sm text-paper">Section name
     <input name="title" defaultValue={floor.title} maxLength={120} required
       className="mt-2 min-h-11 w-full border border-paper/30 bg-ink px-4 py-2"/>
    </label>
    <label className="block text-sm text-paper">Visitor instructions / description
     <textarea name="description" defaultValue={floor.description} maxLength={1200} rows={3}
       className="mt-2 w-full border border-paper/30 bg-ink px-4 py-2"/>
    </label>
    <label className="block text-sm text-paper">Accessible floor-plan image description
     <textarea name="altText" defaultValue={floor.alt_text} maxLength={240} rows={2}
       placeholder="Describe the rooms and map orientation, not just 'floor plan'."
       className="mt-2 w-full border border-paper/30 bg-ink px-4 py-2"/>
    </label>
    <label className="block text-sm text-paper">Display order
     <input type="number" min={0} max={9999} step={1} name="sortOrder" defaultValue={floor.sort_order}
       className="mt-2 min-h-11 w-full border border-paper/30 bg-ink px-4 py-2"/>
    </label>
    <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
     <input type="checkbox" name="publish" value="yes" defaultChecked={floor.is_published}
       className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
     Publish this floor section to the public event map
    </label>
    <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
     <input type="checkbox" name="approved" value="yes" className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
     I confirm the venue has approved this layout, positions and public wayfinding information.
     This checkbox is required if the Publish option is selected.
    </label>
    <button type="submit" className="min-h-11 bg-magenta px-6 py-3 font-display text-sm uppercase tracking-wide text-ink">
      Save section / publication settings
    </button>
   </ActionForm>
  </section>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">3. Place booth and activity markers</h2>
   {imageUrl?<div className="mt-6">
     <FloorPinEditor mapId={id} imageUrl={imageUrl} pins={pins} exhibitors={exhibitors}/>
   </div>:<p className="mt-4 border border-line bg-ink p-5 text-muted">
     Upload the approved floor-plan image first. Map pins will become available here afterward.
   </p>}
   <div className="mt-9 border-t border-line pt-6">
    <h3 className="font-display text-2xl uppercase text-paper">Saved markers ({pins.length})</h3>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
     {pins.map(p=><div key={p.id} className="border border-line bg-ink p-4">
       <p className="font-pixel text-[10px] uppercase tracking-wide text-cyan">
        {floorPinLabel(p.category)} · {p.is_visible?"Visible if published":"Hidden"}
       </p>
       <h4 className="mt-2 font-display text-xl uppercase text-paper">{p.label}</h4>
       <p className="mt-2 text-xs text-muted">
        X {p.x_pct.toFixed(2)}% · Y {p.y_pct.toFixed(2)}%
        {p.booth_label?" · Booth "+p.booth_label:""}
       </p>
       <ActionForm action={deleteFloorPinAction} className="mt-4">
        <input type="hidden" name="mapId" value={id}/>
        <input type="hidden" name="pinId" value={p.id}/>
        <label className="flex items-center gap-2 text-xs text-muted">
         <input name="confirm" type="checkbox" value="yes" required className="h-4 w-4 accent-magenta"/>
         Confirm permanent marker removal
        </label>
        <button type="submit" className="mt-2 min-h-11 border border-magenta px-4 py-2 font-display text-xs uppercase text-magenta">
         Remove marker
        </button>
       </ActionForm>
      </div>)}
    </div>
    {pins.length===0&&<p className="mt-4 text-sm text-muted">No map markers placed yet.</p>}
   </div>
  </section>
  <div className="flex flex-wrap gap-3">
   <Link href="/floor-map" target="_blank" rel="noopener noreferrer"
     className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wide text-cyan">
     View public map ↗
   </Link>
   <Link href="/admin/exhibitors"
     className="inline-flex min-h-11 items-center border border-paper/25 px-5 py-3 font-display text-sm uppercase tracking-wide text-paper">
     Manage exhibitor booths
   </Link>
  </div>
 </div>;
}
