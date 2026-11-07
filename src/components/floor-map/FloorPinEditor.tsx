"use client";

import { useActionState, useRef, useState } from "react";
import { saveFloorPinAction } from "@/app/actions/floor-map";
import { FLOOR_PIN_CATEGORIES } from "@/lib/floor-map/model";
import type { FloorPinRecord } from "@/lib/floor-map/model";
import type { AdminActionState } from "@/app/actions/admin";

type ExhibitorOption={id:string;display_name:string};

const fieldClass="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-base text-paper focus:border-cyan focus:outline-none";
type Fields={
 label:string;category:string;description:string;xPct:string;yPct:string;
 boothLabel:string;exhibitorId:string;sortOrder:string;visible:boolean;
};
const empty:Fields={
 label:"",category:"information",description:"",xPct:"50",yPct:"50",
 boothLabel:"",exhibitorId:"",sortOrder:"0",visible:false,
};

export function FloorPinEditor({mapId,imageUrl,pins,exhibitors}:{
 mapId:string;imageUrl:string;pins:FloorPinRecord[];exhibitors:ExhibitorOption[];
}){
 const [selectedId,setSelectedId]=useState("");
 const [fields,setFields]=useState<Fields>(empty);
 const [state,action,pending]=useActionState(saveFloorPinAction,
  {status:"idle",message:""} satisfies AdminActionState);
 const imageRef=useRef<HTMLImageElement>(null);
 const assign=(change:Partial<Fields>)=>setFields(v=>({...v,...change}));
 const choose=(id:string)=>{
  setSelectedId(id);
  const item=pins.find(p=>p.id===id);
  if(!item){setFields(empty);return;}
  setFields({
   label:item.label,category:item.category,description:item.description,
   xPct:String(item.x_pct),yPct:String(item.y_pct),
   boothLabel:item.booth_label||"",exhibitorId:item.exhibitor_id||"",
   sortOrder:String(item.sort_order),visible:item.is_visible,
  });
 };
 const setPosition=(e:React.MouseEvent<HTMLDivElement>)=>{
  const rect=imageRef.current?.getBoundingClientRect();
  if(!rect || rect.width===0 || rect.height===0)return;
  const x=Math.max(0,Math.min(100,100*(e.clientX-rect.left)/rect.width));
  const y=Math.max(0,Math.min(100,100*(e.clientY-rect.top)/rect.height));
  assign({xPct:x.toFixed(2),yPct:y.toFixed(2)});
 };
 return <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,.85fr)]">
  <div>
   <p className="mb-3 text-sm leading-relaxed text-muted">
    Tap a location on the approved floor-plan image to set its position.
    The placement marker is a draft until you save it.
   </p>
   <div className="overflow-auto border border-cyan/30 bg-[#e6e8ec]">
    <div className="relative w-full cursor-crosshair" onClick={setPosition}
      role="presentation">
     {/* eslint-disable-next-line @next/next/no-img-element */}
     <img ref={imageRef} src={imageUrl} alt="Uploaded organizer floor plan used for marking locations"
      className="block h-auto w-full select-none" draggable={false}/>
     {pins.map(pin=><button key={pin.id} type="button" title={"Edit "+pin.label}
      aria-label={"Edit marker "+pin.label}
      onClick={e=>{e.stopPropagation();choose(pin.id);}}
      style={{left:pin.x_pct+"%",top:pin.y_pct+"%"}}
      className={"absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white font-bold shadow-lg "+
        (selectedId===pin.id?"bg-magenta text-white":"bg-[#102447] text-cyan")}>
      •
     </button>)}
     <span aria-hidden="true" style={{left:fields.xPct+"%",top:fields.yPct+"%"}}
       className="pointer-events-none absolute z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-gold bg-magenta shadow-[0_0_0_2px_black]"/>
    </div>
   </div>
   <p className="mt-2 text-xs text-muted">The gold marker is the currently selected position. Zoom your browser if you need finer placement.</p>
  </div>

  <div className="border border-line bg-ink-2 p-5 sm:p-6">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Location editor</p>
   <label className="mt-4 block text-sm text-paper">Edit an existing marker or create a new one
    <select value={selectedId} onChange={e=>choose(e.target.value)} className={fieldClass}>
     <option value="">+ Create new marker</option>
     {pins.map(pin=><option key={pin.id} value={pin.id}>{pin.label}</option>)}
    </select>
   </label>
   <form action={action} className="mt-6 space-y-4">
    {state.status!=="idle"&&<p role={state.status==="error"?"alert":"status"}
      className={"border p-3 text-sm "+(state.status==="error"?"border-magenta text-magenta":"border-cyan text-cyan")}>
      {state.message}
    </p>}
    <input type="hidden" name="mapId" value={mapId}/>
    <input type="hidden" name="pinId" value={selectedId}/>
    <label className="block text-sm text-paper">Label *
     <input name="label" value={fields.label} onChange={e=>assign({label:e.target.value})}
      maxLength={100} required className={fieldClass} placeholder="Example: Vendor Hall entrance"/>
    </label>
    <label className="block text-sm text-paper">Type *
     <select name="category" required className={fieldClass} value={fields.category}
       onChange={e=>assign({category:e.target.value})}>
      {FLOOR_PIN_CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
     </select>
    </label>
    <label className="block text-sm text-paper">Description
     <textarea name="description" rows={3} maxLength={1000} className={fieldClass}
       value={fields.description} onChange={e=>assign({description:e.target.value})}/>
    </label>
    <div className="grid grid-cols-2 gap-3">
     <label className="block text-sm text-paper">X position (%) *
      <input type="number" name="xPct" value={fields.xPct} min={0} max={100} step={0.01} required
        onChange={e=>assign({xPct:e.target.value})} className={fieldClass}/>
     </label>
     <label className="block text-sm text-paper">Y position (%) *
      <input type="number" name="yPct" value={fields.yPct} min={0} max={100} step={0.01} required
        onChange={e=>assign({yPct:e.target.value})} className={fieldClass}/>
     </label>
    </div>
    <label className="block text-sm text-paper">Booth or table label
     <input name="boothLabel" maxLength={100} className={fieldClass}
       value={fields.boothLabel} onChange={e=>assign({boothLabel:e.target.value})}
       placeholder="Example: A12"/>
    </label>
    <label className="block text-sm text-paper">Link published exhibitor (optional)
     <select name="exhibitorId" className={fieldClass} value={fields.exhibitorId}
      onChange={e=>assign({exhibitorId:e.target.value})}>
      <option value="">No linked exhibitor</option>
      {exhibitors.map(v=><option key={v.id} value={v.id}>{v.display_name}</option>)}
     </select>
    </label>
    <label className="block text-sm text-paper">Display order
     <input type="number" name="sortOrder" className={fieldClass} min={0} max={9999} step={1}
      value={fields.sortOrder} onChange={e=>assign({sortOrder:e.target.value})}/>
    </label>
    <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
     <input type="checkbox" name="visible" value="yes" checked={fields.visible}
       onChange={e=>assign({visible:e.target.checked})}
       className="mt-1 h-5 w-5 accent-cyan"/>
     Show this marker to visitors when the floor section is published
    </label>
    <button type="submit" disabled={pending}
      className="min-h-12 w-full bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink disabled:opacity-60">
     {pending?"Saving...":selectedId?"Save marker changes":"Add map marker"}
    </button>
   </form>
  </div>
 </div>;
}
