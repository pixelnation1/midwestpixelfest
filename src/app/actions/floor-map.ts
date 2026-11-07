"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireOrganizer } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import { floorPinType, parsePercent, validMapKey, validMapUpload } from "@/lib/floor-map/model";
import type { AdminActionState } from "@/app/actions/admin";

const success=(message:string):AdminActionState=>({status:"success",message});
const fail=(message:string):AdminActionState=>({status:"error",message});
const text=(form:FormData,key:string,max=1000):string=>{
  const v=form.get(key);
  return typeof v==="string"?v.trim().slice(0,max+1):"";
};
const uuid=(value:string)=>/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value);

async function organizerDatabase(){
  const actor=await requireOrganizer();
  const db=await createSupabaseServerClient();
  if(!db)return null;
  return {actor,db};
}

function revalidateFloorMap(id?:string){
  revalidatePath("/floor-map");
  revalidatePath("/admin/floor-map");
  revalidatePath("/exhibitors");
  if(id)revalidatePath("/admin/floor-map/"+id);
}

export async function createFloorMapAction(
  _previous:AdminActionState, form:FormData,
):Promise<AdminActionState>{
  const session=await organizerDatabase();
  if(!session)return fail("Your session expired.");
  const title=text(form,"title",120);
  const key=text(form,"mapKey",50).toLowerCase();
  const description=text(form,"description",1200);
  if(title.length<2||title.length>120||!validMapKey(key)||description.length>1200){
    return fail("Use a valid section title, URL key and short description.");
  }
  const {data,error}=await session.db.from("event_floor_maps")
    .insert({title,map_key:key,description,is_published:false})
    .select("id").single();
  if(error){
    return fail(error.code==="23505"?"That map section already exists.":"Could not create that floor section.");
  }
  await recordOrganizerAudit({action:"floor_map_section_created",entityType:"floor_map",
    entityId:data.id,actor:session.actor});
  revalidateFloorMap(data.id);
  return success("Section created. Open it below to add an approved image and map markers.");
}

export async function uploadFloorPlanAction(
  _previous:AdminActionState, form:FormData,
):Promise<AdminActionState>{
  const session=await organizerDatabase();
  if(!session)return fail("Your session expired.");
  const mapId=text(form,"mapId",36);
  if(!uuid(mapId))return fail("Invalid floor map section.");
  const file=form.get("floorPlan");
  if(!(file instanceof File))return fail("Select a PNG, JPG or WebP image.");
  const issue=validMapUpload(file);
  if(issue)return fail(issue);
  const service=createSupabaseServiceClient();
  if(!service)return fail("Floor plan storage is unavailable.");
  const {data:map,error:mapError}=await session.db.from("event_floor_maps")
    .select("id").eq("id",mapId).maybeSingle();
  if(mapError||!map)return fail("Floor map section not found.");

  const buffer=Buffer.from(await file.arrayBuffer());
  const png=buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg=buffer.length>3&&buffer[0]===255&&buffer[1]===216&&buffer[2]===255;
  const webp=buffer.length>12&&buffer.subarray(0,4).toString()==="RIFF"&&buffer.subarray(8,12).toString()==="WEBP";
  const good=(file.type==="image/png"&&png)||(file.type==="image/jpeg"&&jpg)||(file.type==="image/webp"&&webp);
  if(!good)return fail("The file does not match its image format.");
  const ext=file.type==="image/png"?"png":file.type==="image/jpeg"?"jpg":"webp";
  const objectKey="2027/"+mapId+"/floor-"+randomUUID()+"."+ext;
  const {error:uploadError}=await service.storage.from("event-floor-plans")
    .upload(objectKey,buffer,{upsert:false,contentType:file.type});
  if(uploadError)return fail("Image upload failed. Please try again.");

  const {error:updateError}=await session.db.from("event_floor_maps")
    .update({image_path:objectKey,is_published:false}).eq("id",mapId);
  if(updateError)return fail("Image uploaded but could not be linked. Please contact an organizer.");

  // Existing coordinates may point to the wrong places after the floor image changes.
  const {error:pinError}=await session.db.from("event_floor_pins")
    .update({is_visible:false}).eq("map_id",mapId);
  if(pinError)console.error("floor_map_pins_hide_failed",{code:pinError.code});
  await recordOrganizerAudit({action:"floor_map_image_uploaded_unpublished",
    entityType:"floor_map",entityId:mapId,actor:session.actor});
  revalidateFloorMap(mapId);
  return success("Image saved privately. This section is now unpublished; verify all marker positions before publishing.");
}

export async function updateFloorMapAction(
  _previous:AdminActionState,form:FormData,
):Promise<AdminActionState>{
  const session=await organizerDatabase();
  if(!session)return fail("Your session expired.");
  const id=text(form,"mapId",36);
  if(!uuid(id))return fail("Invalid floor map section.");
  const title=text(form,"title",120);
  const description=text(form,"description",1200);
  const alt=text(form,"altText",240);
  const rawSort=text(form,"sortOrder",8);
  const sortOrder=Number(rawSort);
  const publish=text(form,"publish")==="yes";
  if(title.length<2||title.length>120||description.length>1200||alt.length>240||
     !Number.isInteger(sortOrder)||sortOrder<0||sortOrder>9999) {
    return fail("Check the map title, description, image description or display order.");
  }
  const {data:existing,error:loadError}=await session.db.from("event_floor_maps")
    .select("image_path").eq("id",id).maybeSingle();
  if(loadError||!existing)return fail("Floor map section not found.");
  if(publish){
    if(!existing.image_path)return fail("Upload an approved floor plan before publishing.");
    if(text(form,"approved")!=="yes")return fail("Confirm the map has been reviewed and approved for attendees.");
    if(!alt)return fail("Add accessible image description before publishing.");
  }
  const {error}=await session.db.from("event_floor_maps")
    .update({title,description,alt_text:alt,sort_order:sortOrder,is_published:publish})
    .eq("id",id);
  if(error)return fail("Could not save floor map settings.");
  await recordOrganizerAudit({action:publish?"floor_map_published":"floor_map_saved_unpublished",
    entityType:"floor_map",entityId:id,actor:session.actor});
  revalidateFloorMap(id);
  return success(publish?"Approved floor map published.":"Floor map settings saved; public visibility disabled.");
}

export async function saveFloorPinAction(
  _previous:AdminActionState,form:FormData,
):Promise<AdminActionState>{
  const session=await organizerDatabase();
  if(!session)return fail("Your session expired.");
  const mapId=text(form,"mapId",36);
  const pinId=text(form,"pinId",36);
  if(!uuid(mapId)|| (pinId&&!uuid(pinId)))return fail("Invalid map marker.");
  const label=text(form,"label",100);
  const category=text(form,"category",40);
  const description=text(form,"description",1000);
  const booth=text(form,"boothLabel",100);
  const rawX=text(form,"xPct",10);
  const rawY=text(form,"yPct",10);
  const x=parsePercent(rawX), y=parsePercent(rawY);
  const sort=Number(text(form,"sortOrder",8)||"0");
  const visible=text(form,"visible")==="yes";
  const exhibitorId=text(form,"exhibitorId",36);
  if(label.length<2||label.length>100||description.length>1000||booth.length>100||
    !floorPinType(category)||x===null||y===null||
    !Number.isInteger(sort)||sort<0||sort>9999) {
    return fail("Check the label, category, positions (0–100%), or description.");
  }
  const {data:map,error:mapError}=await session.db.from("event_floor_maps")
    .select("image_path").eq("id",mapId).maybeSingle();
  if(mapError||!map)return fail("Map section not found.");
  if(!map.image_path)return fail("Upload a floor plan before placing markers.");
  let approvedExhibitorId:string|null=null;
  if(exhibitorId){
    if(!uuid(exhibitorId))return fail("Invalid exhibitor selection.");
    const {data,error}=await session.db.from("public_vendor_listings")
      .select("id").eq("id",exhibitorId).eq("published",true).maybeSingle();
    if(error||!data)return fail("Only published exhibitors can be linked to public pins.");
    approvedExhibitorId=data.id;
  }
  const values={
    map_id:mapId,label,category,description,x_pct:x,y_pct:y,
    booth_label:booth||null,exhibitor_id:approvedExhibitorId,
    is_visible:visible,sort_order:sort,
  };
  if(pinId){
    const {data,error}=await session.db.from("event_floor_pins")
      .update(values).eq("id",pinId).eq("map_id",mapId)
      .select("id").maybeSingle();
    if(error||!data)return fail("Could not update that map marker.");
  }else{
    const {error}=await session.db.from("event_floor_pins").insert(values);
    if(error)return fail("Could not add that map marker.");
  }
  await recordOrganizerAudit({action:pinId?"floor_pin_updated":"floor_pin_added",
    entityType:"floor_pin",entityId:pinId||null,actor:session.actor});
  revalidateFloorMap(mapId);
  return success("Map marker saved. Its public visibility follows the section publication setting.");
}

export async function deleteFloorPinAction(
  _previous:AdminActionState,form:FormData,
):Promise<AdminActionState>{
  const session=await organizerDatabase();
  if(!session)return fail("Your session expired.");
  const id=text(form,"pinId",36),mapId=text(form,"mapId",36);
  if(!uuid(id)||!uuid(mapId)||text(form,"confirm")!=="yes")return fail("Confirm the marker removal.");
  const {data,error}=await session.db.from("event_floor_pins")
    .delete().eq("id",id).eq("map_id",mapId).select("id").maybeSingle();
  if(error||!data)return fail("Could not remove that marker.");
  await recordOrganizerAudit({action:"floor_pin_deleted",entityType:"floor_pin",
    entityId:id,actor:session.actor});
  revalidateFloorMap(mapId);
  return success("Map marker removed.");
}
