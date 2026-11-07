export const GUEST_BOOKING_STATUSES = [
  "inquiry", "negotiating", "contracted", "cancelled",
] as const;
export type GuestBookingStatus=(typeof GUEST_BOOKING_STATUSES)[number];
export const GUEST_BOOKING_LABELS:Record<GuestBookingStatus,string>={
 inquiry:"Initial inquiry",negotiating:"In negotiation",contracted:"Signed agreement",cancelled:"Cancelled / not proceeding",
};
export const GUEST_SESSION_TYPES = [
 {value:"autograph",label:"Autograph signing"},
 {value:"photo_op",label:"Professional photo opportunity"},
 {value:"selfie",label:"Selfie opportunity"},
 {value:"meet_and_greet",label:"Meet & greet"},
] as const;
export type GuestSessionType=(typeof GUEST_SESSION_TYPES)[number]["value"];
export function validSessionType(value:string):value is GuestSessionType {
 return GUEST_SESSION_TYPES.some(type=>type.value===value);
}
export function validGuestSlug(value:string){
 return /^[a-z0-9][a-z0-9-]{1,79}$/.test(value);
}
export function validGuestTime(value:string){
 return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
export function validGuestEventDate(value:string){
 return value==="2027-10-16"||value==="2027-10-17";
}
export function dollarsToCents(raw:string):number|null|undefined{
 if(!raw.trim())return null;
 if(!/^(?:0|[1-9]\d{0,3})(?:\.\d{1,2})?$/.test(raw))return undefined;
 const n=Number(raw);
 if(!Number.isFinite(n)||n>1000)return undefined;
 return Math.round(n*100);
}
export function centsToDollars(value:number|null):string {
 return value===null?"":(value/100).toFixed(2);
}
export function formatGuestPrice(value:number|null):string {
 return value===null?"Price to be announced":
 new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(value/100);
}

export type PublicGuestSession={
 id:string;guest_id:string;session_type:GuestSessionType;
 session_date:string;start_time:string;end_time:string;
 location_label:string;public_note:string;sort_order:number;
};
export type PublicGuestExperience={
 id:string;slug:string;display_name:string;role_label:string;bio:string;
 image_url:string|null;
 autograph_available:boolean;autograph_price_cents:number|null;
 selfie_available:boolean;selfie_price_cents:number|null;
 photo_op_available:boolean;photo_op_price_cents:number|null;
 combo_price_cents:number|null;
 autograph_details:string;photo_details:string;sales_notes:string;
 purchase_url:string|null;location_notes:string;public_schedule_notes:string;
 sessions:PublicGuestSession[];
};
