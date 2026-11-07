import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import type { FloorMapRecord, FloorPinRecord, PublicFloorMap, PublicFloorPin } from "@/lib/floor-map/model";

const PRIVATE_BUCKET="event-floor-plans";

export async function signedFloorPlanUrl(path: string|null): Promise<string|null> {
  if(!path || !/^2027\/[a-z0-9/_-]+\.(png|jpg|webp)$/.test(path)) return null;
  const supabase=createSupabaseServiceClient();
  if(!supabase)return null;
  const { data, error }=await supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(path,60*60);
  return error?null:data.signedUrl;
}

/** Public access goes through server-side, status-filtered records only. */
export async function listPublicFloorMaps(): Promise<PublicFloorMap[]> {
  const supabase=createSupabaseServiceClient();
  if(!supabase)return [];
  const {data:maps,error}=await supabase.from("event_floor_maps")
    .select("id,title,description,alt_text,image_path,updated_at")
    .eq("is_published",true).not("image_path","is",null)
    .order("sort_order",{ascending:true}).order("title",{ascending:true}).limit(20);
  if(error||!maps?.length)return [];

  const ids=maps.map(m=>m.id);
  const {data:pinData,error:pinError}=await supabase.from("event_floor_pins")
    .select("id,map_id,label,category,description,x_pct,y_pct,booth_label,exhibitor_id,is_visible,sort_order")
    .in("map_id",ids).eq("is_visible",true)
    .order("sort_order",{ascending:true}).limit(1000);
  if(pinError) {
    console.error("public_floor_pins_fetch_failed",{code:pinError.code});
    return [];
  }

  const all=pinData??[];
  const exhibitorIds=[...new Set(all.map(pin=>pin.exhibitor_id).filter((v):v is string=>!!v))];
  const exhibitors=new Map<string,string>();
  if(exhibitorIds.length){
    const {data:listingData,error:listingError}=await supabase
      .from("public_vendor_listings").select("id,display_name")
      .eq("published",true).in("id",exhibitorIds);
    if(!listingError)for(const row of listingData??[]) exhibitors.set(row.id,row.display_name);
  }
  const signed=await Promise.all(maps.map(async m=>({
    id:m.id,title:m.title,description:m.description,alt_text:m.alt_text,
    updated_at:m.updated_at,image_url:await signedFloorPlanUrl(m.image_path),
  })));
  return signed.filter(m=>!!m.image_url).map(m=>{
    // If an exhibitor is subsequently unpublished, do not expose its former booth marker.
    const pins:PublicFloorPin[]=all.filter(pin=>
      pin.map_id===m.id && (!pin.exhibitor_id || exhibitors.has(pin.exhibitor_id))
    ).map(pin=>({
      ...pin,
      x_pct:Number(pin.x_pct),y_pct:Number(pin.y_pct),
      exhibitor_name:pin.exhibitor_id?exhibitors.get(pin.exhibitor_id)??null:null,
      exhibitor_url:pin.exhibitor_id&&exhibitors.has(pin.exhibitor_id)
        ?"/exhibitors/"+pin.exhibitor_id:null,
    })) as PublicFloorPin[];
    return {...m,image_url:m.image_url as string,pins};
  });
}

export async function listOrganizerFloorMaps():Promise<FloorMapRecord[]> {
  const supabase=createSupabaseServiceClient();
  if(!supabase)return [];
  const {data,error}=await supabase.from("event_floor_maps").select("*")
    .order("sort_order",{ascending:true}).order("title",{ascending:true});
  if(error)throw new Error("Could not load floor maps.");
  return data as FloorMapRecord[];
}
