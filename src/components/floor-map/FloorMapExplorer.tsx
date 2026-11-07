"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FLOOR_PIN_CATEGORIES, floorPinLabel } from "@/lib/floor-map/model";
import type { PublicFloorMap, PublicFloorPin } from "@/lib/floor-map/model";

function MapDot({ pin,selected,onClick }: { pin:PublicFloorPin;selected:boolean;onClick:()=>void }) {
 const type=FLOOR_PIN_CATEGORIES.find(item=>item.value===pin.category);
 return <button type="button"
  onClick={onClick}
  aria-label={"Locate "+pin.label+" on the map"}
  title={pin.label}
  style={{left:pin.x_pct+"%",top:pin.y_pct+"%"}}
  className={"absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-black shadow-[0_2px_8px_rgba(0,0,0,.8)] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan " +
   (selected?"bg-magenta text-white ring-4 ring-cyan":"bg-[#102447] text-cyan hover:bg-magenta hover:text-white")}
 >{type?.emoji||"•"}</button>;
}

export function FloorMapExplorer({maps}:{maps:PublicFloorMap[]}) {
 const [activeMap,setActiveMap]=useState(maps[0]?.id??"");
 const [type,setType]=useState("all");
 const [term,setTerm]=useState("");
 const [selectedId,setSelectedId]=useState<string|null>(null);
 const [zoom,setZoom]=useState(1);
 const map=maps.find(m=>m.id===activeMap)??maps[0];
 const pins=useMemo(()=>{
  if(!map)return [];
  const search=term.trim().toLocaleLowerCase();
  return map.pins.filter(p=>
    (type==="all" || p.category===type) &&
    (!search || [p.label,p.description,p.booth_label||"",p.exhibitor_name||""]
      .some(x=>x.toLocaleLowerCase().includes(search))),
  );
 },[map,type,term]);
 if(!map) {
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
   <div className="relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden border border-cyan/30 bg-[radial-gradient(circle_at_20%_20%,rgba(45,226,255,.13),transparent_47%),radial-gradient(circle_at_80%_80%,rgba(255,45,149,.15),transparent_52%)] p-7 text-center sm:min-h-[440px]">
    <div className="pixel-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
    <div className="relative">
     <p className="font-pixel text-[11px] uppercase tracking-[.2em] text-cyan">Official show floor</p>
     <h2 className="mt-5 font-display text-4xl uppercase tracking-wide text-paper sm:text-5xl">Floor map coming soon.</h2>
     <p className="mx-auto mt-4 max-w-md leading-relaxed text-paper/80">
      We're finalizing the venue agreement and floor plan. The approved map,
      booth numbers, entrances and activity locations will appear here when confirmed.
     </p>
     <Link href="/exhibitors" className="mt-7 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan hover:bg-cyan/10">Explore exhibitors</Link>
    </div>
   </div>
   <div className="border border-line bg-panel p-6 sm:p-8">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">What's being planned</p>
    <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper">Discover the spaces.</h3>
    <p className="mt-4 text-sm leading-relaxed text-muted">These are proposed activities, not a diagram of where they'll be located.</p>
    <div className="mt-6 grid grid-cols-2 gap-3">
     {["Video & retro gaming","Tabletop & TCGs","Vendors & Artist Alley","Cosplay activities","Panels & guests","Attendee services"].map((name,i)=>
      <div key={name} className="border border-cyan/20 bg-ink p-3">
       <p className="font-pixel text-xs text-cyan">{String(i+1).padStart(2,"0")}</p>
       <p className="mt-2 font-display text-sm uppercase tracking-wide text-paper sm:text-lg">{name}</p>
      </div>)}
    </div>
    <p className="mt-6 text-sm leading-relaxed text-muted">
     For general Memorial Union building information, see the{" "}
     <a href="https://sites.google.com/g.emporia.edu/virtual-campus-explorer/buildings-locations/memorial-union/second-floor"
      target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-4">ESU second-floor visitor guide</a>.
     It is <strong className="text-paper">not</strong> the Midwest PixelFest event layout.
    </p>
   </div>
  </div>;
 }
 const selected=pins.find(p=>p.id===selectedId)??null;
 return <div>
  <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Floor map sections">
   {maps.map(m=><button key={m.id} type="button" role="tab" aria-selected={m.id===map.id}
    className={"min-h-11 border px-4 py-3 font-display text-sm uppercase tracking-wider "+(m.id===map.id?"border-cyan bg-cyan text-ink":"border-paper/20 bg-panel text-paper hover:border-cyan")}
    onClick={()=>{setActiveMap(m.id);setType("all");setTerm("");setSelectedId(null);setZoom(1);}}>{m.title}</button>)}
  </div>
  {map.description && <p className="mb-6 max-w-3xl leading-relaxed text-muted">{map.description}</p>}
  <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border border-line bg-panel p-4">
   <label className="flex-1 text-sm text-muted">Find a location or booth
    <input type="search" value={term} onChange={e=>{setTerm(e.target.value);setSelectedId(null);}}
     placeholder="Search booth, vendor, entrance..." className="mt-2 min-h-11 w-full min-w-0 border border-paper/25 bg-ink px-4 py-2 text-base text-paper placeholder:text-muted/70 sm:max-w-lg"/>
   </label>
   <div className="flex items-center gap-2" aria-label="Map zoom">
    <button type="button" aria-label="Zoom out" disabled={zoom<=1} onClick={()=>setZoom(z=>Math.max(1,z-.5))}
      className="h-11 w-11 border border-cyan/40 text-xl text-cyan disabled:opacity-30">−</button>
    <span className="min-w-12 text-center font-pixel text-[11px] text-paper">{Math.round(zoom*100)}%</span>
    <button type="button" aria-label="Zoom in" disabled={zoom>=2.5} onClick={()=>setZoom(z=>Math.min(2.5,z+.5))}
      className="h-11 w-11 border border-cyan/40 text-xl text-cyan disabled:opacity-30">+</button>
   </div>
  </div>
  <div className="mb-5 flex flex-wrap gap-2" aria-label="Location filters">
   <button type="button" aria-pressed={type==="all"} onClick={()=>{setType("all");setSelectedId(null);}}
    className={"min-h-11 border px-3 py-2 font-display text-xs uppercase tracking-wider "+(type==="all"?"border-gold bg-gold text-ink":"border-paper/20 text-paper")}>All locations</button>
   {FLOOR_PIN_CATEGORIES.filter(c=>map.pins.some(p=>p.category===c.value)).map(c=>
    <button key={c.value} type="button" aria-pressed={type===c.value}
      onClick={()=>{setType(c.value);setSelectedId(null);}}
      className={"min-h-11 border px-3 py-2 font-display text-xs uppercase tracking-wider "+(type===c.value?"border-gold bg-gold text-ink":"border-paper/20 text-paper")}>{c.label}</button>)}
  </div>
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(270px,.6fr)]">
   <div className="overflow-auto border border-cyan/30 bg-[#e8eaf0]">
    <div className="relative" style={{width:(zoom*100)+"%"}}>
      {/* The underlying image is an organizer-approved event plan, not a generated schematic. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={map.image_url} alt={map.alt_text}
        className="block h-auto w-full select-none" draggable={false}/>
      {pins.map(pin=><MapDot key={pin.id} pin={pin} selected={selectedId===pin.id} onClick={()=>setSelectedId(pin.id)}/>)}
    </div>
   </div>
   <aside className="min-w-0 border border-line bg-panel p-5">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">{pins.length} locations</p>
    <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">Find your way</h3>
    <p className="mt-2 text-xs text-muted">Select a marker on the plan or a listing below.</p>
    <div className="mt-5 max-h-[510px] space-y-2 overflow-auto">
     {pins.map(pin=><button key={pin.id} type="button" onClick={()=>setSelectedId(pin.id)}
      className={"block w-full border p-3 text-left "+(selectedId===pin.id?"border-magenta bg-magenta/10":"border-line bg-ink hover:border-cyan")}>
       <span className="font-pixel text-[10px] uppercase tracking-wider text-cyan">{floorPinLabel(pin.category)}</span>
       <span className="mt-1 block font-display text-lg uppercase tracking-wide text-paper">{pin.label}</span>
       {pin.booth_label&&<span className="mt-1 block text-xs text-gold">Booth {pin.booth_label}</span>}
       {(selectedId===pin.id)&&<>
        {pin.description&&<span className="mt-2 block whitespace-pre-wrap text-sm leading-relaxed text-muted">{pin.description}</span>}
        {pin.exhibitor_url&&<span className="mt-3 block text-sm text-cyan">Exhibitor: {pin.exhibitor_name} →</span>}
       </>}
      </button>)}
     {pins.length===0&&<p className="border border-line p-5 text-sm text-muted">No locations match. Try a different search or filter.</p>}
    </div>
    {selected?.exhibitor_url&&<Link href={selected.exhibitor_url} className="mt-5 inline-flex min-h-11 items-center border border-cyan px-4 py-3 font-display text-sm uppercase text-cyan">
      Open exhibitor profile →
    </Link>}
   </aside>
  </div>
  <p className="mt-5 text-xs leading-relaxed text-muted">
   Floor maps, booth assignments and routes can change. Follow on-site signs and
   staff directions, particularly for accessible routes and emergency procedures.
   Do not use this attendee map for emergency evacuation instructions.
  </p>
 </div>;
}
