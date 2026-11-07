import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { createFloorMapAction } from "@/app/actions/floor-map";
import { listOrganizerFloorMaps } from "@/lib/persistence/floor-maps";

export const dynamic="force-dynamic";

export default async function FloorMapAdminIndex(){
  let maps;
  try { maps=await listOrganizerFloorMaps(); }
  catch {return <p role="alert" className="text-magenta">Floor map data is currently unavailable.</p>;}
  const published=maps.filter(m=>m.is_published).length;
  return <div className="space-y-9">
    <div>
      <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Organizer / Floor planning</p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">Convention Floor Map</h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted">
        Upload approved floor-plan images, place interactive activity and booth markers,
        and publish each section when the venue layout is ready.
        Nothing is public until you explicitly approve and publish that section.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["Sections created",String(maps.length)],
        ["Live sections",String(published)],
        ["Unpublished",String(maps.length-published)],
      ].map(([label,value])=><div key={label} className="border border-line bg-panel p-5">
        <p className="font-pixel text-[10px] uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-3 font-display text-4xl text-cyan">{value}</p>
      </div>)}
    </div>

    <div className="border border-line bg-panel p-5 sm:p-7">
      <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Create a floor section</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Create a section for each approved image, for example Main Hall or Webb Lobby.
        Keep names generic until the exact room allocations are finalized.
      </p>
      <ActionForm action={createFloorMapAction} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-paper">Public title
            <input name="title" required maxLength={120} placeholder="Example: Main Hall"
              className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
          </label>
          <label className="block text-sm text-paper">Section key (lowercase slug)
            <input name="mapKey" required pattern="[a-z0-9][a-z0-9-]{1,48}"
              placeholder="main-hall" className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
          </label>
        </div>
        <label className="block text-sm text-paper">Short public description
          <textarea name="description" maxLength={1200} rows={2}
            placeholder="Only describe spaces and facilities confirmed by the event plan."
            className="mt-2 w-full border border-paper/25 bg-ink px-4 py-2"/>
        </label>
        <button type="submit" className="min-h-11 bg-magenta px-6 py-3 font-display text-sm uppercase tracking-wider text-ink">
          Create unpublished section
        </button>
      </ActionForm>
    </div>

    <section>
      <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Your floor sections</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {maps.map(m=><article key={m.id} className="border border-line bg-panel p-6">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">
            {m.is_published?"Published":"Private draft"}
          </p>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{m.title}</h3>
          <p className="mt-2 text-sm text-muted">{m.description||"No description added yet."}</p>
          <p className="mt-4 text-sm text-gold">{m.image_path?"Plan image uploaded":"No plan image yet"}</p>
          <Link href={"/admin/floor-map/"+m.id}
            className="mt-5 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
            Edit layout & markers →
          </Link>
        </article>)}
      </div>
      {maps.length===0&&<p className="mt-5 border border-line bg-ink-2 p-6 leading-relaxed text-muted">
        No map sections created yet. Start by creating an unpublished section; upload the approved room plan later.
      </p>}
    </section>
    <div className="flex flex-wrap gap-3">
      <Link href="/floor-map" target="_blank" rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
        View attendee floor map ↗
      </Link>
      <Link href="/admin/exhibitors"
        className="inline-flex min-h-11 items-center border border-paper/30 px-5 py-3 font-display text-sm uppercase tracking-wider text-paper">
        Manage exhibitors
      </Link>
    </div>
  </div>;
}
