import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import {
  updateGuestExperienceAction, saveGuestSessionAction, deleteGuestSessionAction,
} from "@/app/actions/guest-experiences";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  GUEST_BOOKING_STATUSES, GUEST_BOOKING_LABELS, GUEST_SESSION_TYPES,
  centsToDollars, type GuestBookingStatus, type GuestSessionType,
} from "@/lib/guest-experiences/model";
import { formatGuestSessionTime, guestSessionLabel } from "@/lib/persistence/guest-experiences";

export const dynamic="force-dynamic";
type GuestRow={
 id:string;slug:string;display_name:string;role_label:string;bio:string;
 image_url:string|null;booking_status:GuestBookingStatus;is_published:boolean;
 sort_order:number;autograph_available:boolean;autograph_price_cents:number|null;
 selfie_available:boolean;selfie_price_cents:number|null;photo_op_available:boolean;
 photo_op_price_cents:number|null;combo_price_cents:number|null;
 autograph_details:string;photo_details:string;sales_notes:string;
 purchase_url:string|null;location_notes:string;public_schedule_notes:string;
 internal_notes:string;
};
type SessionRow={
 id:string;guest_id:string;session_type:GuestSessionType;
 session_date:string;start_time:string;end_time:string;location_label:string;
 public_note:string;is_published:boolean;sort_order:number;
};
const input="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-base text-paper focus:border-cyan focus:outline-none";
const label="block text-sm text-paper";

function GuestSessionForm({guestId,session}:{guestId:string;session?:SessionRow}) {
 return <ActionForm action={saveGuestSessionAction} className="space-y-4">
  <input type="hidden" name="guestId" value={guestId}/>
  <input type="hidden" name="sessionId" value={session?.id??""}/>
  <div className="grid gap-3 sm:grid-cols-2">
   <label className={label}>Experience type *
    <select name="sessionType" required defaultValue={session?.session_type??"autograph"} className={input}>
     {GUEST_SESSION_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
    </select>
   </label>
   <label className={label}>Event date *
    <select name="sessionDate" required defaultValue={session?.session_date??"2027-10-16"} className={input}>
     <option value="2027-10-16">Saturday, October 16, 2027</option>
     <option value="2027-10-17">Sunday, October 17, 2027</option>
    </select>
   </label>
   <label className={label}>Start time (Central) *
    <input type="time" name="startTime" required defaultValue={session?.start_time.slice(0,5)??"11:00"} className={input}/>
   </label>
   <label className={label}>End time (Central) *
    <input type="time" name="endTime" required defaultValue={session?.end_time.slice(0,5)??"12:00"} className={input}/>
   </label>
  </div>
  <label className={label}>Location (if confirmed)
   <input name="locationLabel" maxLength={120} defaultValue={session?.location_label??""}
    placeholder="Signing Area / Room TBD" className={input}/>
  </label>
  <label className={label}>Public session notes
   <textarea name="publicNote" maxLength={500} rows={2}
    defaultValue={session?.public_note??""} className={input} />
  </label>
  <label className={label}>Display order
   <input name="sortOrder" type="number" min={0} max={9999}
    defaultValue={session?.sort_order??0} className={input}/>
  </label>
  <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
   <input type="checkbox" name="published" value="yes" defaultChecked={session?.is_published??false}
    className="mt-1 h-5 w-5 accent-cyan"/>
   Make this time slot visible when the contracted guest is publicly announced.
  </label>
  <button type="submit" className="min-h-11 bg-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-ink">
   {session?"Save time slot":"Add time slot"}
  </button>
 </ActionForm>;
}

export default async function AdminGuestExperienceDetail({params}:{
 params:Promise<{id:string}>
}){
 const {id}=await params;
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id))notFound();
 const db=await createSupabaseServerClient();
 if(!db)return <p className="text-magenta">Sign in again.</p>;
 const [guestResult,sessionsResult]=await Promise.all([
  db.from("guest_experiences").select("*").eq("id",id).maybeSingle(),
  db.from("guest_experience_sessions").select("*").eq("guest_id",id)
   .order("session_date",{ascending:true}).order("start_time",{ascending:true})
   .limit(100),
 ]);
 if(guestResult.error||sessionsResult.error)return <p role="alert" className="text-magenta">Guest details are temporarily unavailable.</p>;
 if(!guestResult.data)notFound();
 const g=guestResult.data as GuestRow;
 const sessions=(sessionsResult.data??[]) as SessionRow[];
 return <div className="space-y-9">
  <nav aria-label="Breadcrumb" className="font-pixel text-[11px] uppercase tracking-widest text-muted">
   <Link href="/admin/guest-experiences" className="text-cyan hover:text-gold">Guest experiences</Link>
   <span className="mx-3 text-magenta">/</span>{g.display_name}
  </nav>
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">
    {GUEST_BOOKING_LABELS[g.booking_status]} · {g.is_published?"Publicly announced":"Private record"}
   </p>
   <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">{g.display_name}</h1>
   <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
    Update this guest's public-facing signing information. Negotiated terms and
    draft prices stay private until an executed guest agreement exists and you
    explicitly approve the public announcement.
   </p>
  </div>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Guest profile, pricing & publication</h2>
   <ActionForm action={updateGuestExperienceAction} className="mt-6 space-y-5">
    <input type="hidden" name="guestId" value={g.id}/>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className={label}>Public display name
      <input name="displayName" required maxLength={160} defaultValue={g.display_name} className={input}/>
     </label>
     <label className={label}>Public role / recognition
      <input name="roleLabel" maxLength={140} defaultValue={g.role_label}
       placeholder="Voice actor, artist, performer" className={input}/>
     </label>
    </div>
    <label className={label}>Approved public biography
     <textarea name="bio" rows={4} maxLength={3500} defaultValue={g.bio} className={input}/>
    </label>
    <label className={label}>Approved promotional image URL (HTTPS)
     <input name="imageUrl" type="url" maxLength={600} defaultValue={g.image_url??""}
      placeholder="https://..." className={input}/>
     <p className="mt-1 text-xs text-muted">Only use images supplied or authorized for promotional use.</p>
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className={label}>Booking status (private)
      <select name="bookingStatus" defaultValue={g.booking_status} className={input}>
       {GUEST_BOOKING_STATUSES.map(status=><option key={status} value={status}>{GUEST_BOOKING_LABELS[status]}</option>)}
      </select>
     </label>
     <label className={label}>Directory display order
      <input type="number" name="sortOrder" min={0} max={9999}
       defaultValue={g.sort_order} className={input}/>
     </label>
    </div>
    <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
     <input type="checkbox" name="contractVerified" value="yes" className="mt-1 h-5 w-5 accent-cyan"/>
     I verify that an executed guest appearance agreement is on file if I select "Signed agreement."
    </label>

    <div className="border-t border-line pt-6">
     <h3 className="font-display text-2xl uppercase text-paper">Guest Experiences & Prices</h3>
     <p className="mt-3 text-sm leading-relaxed text-muted">
      Leave a price blank until it is confirmed with the guest representative.
      The public page will say "Price to be announced" rather than inventing an amount.
      Prices are USD, and no purchase link is enabled by default.
     </p>
     <div className="mt-5 grid gap-5 sm:grid-cols-2">
      {[
       {check:"autographAvailable",price:"autographPrice",label:"Autographs",available:g.autograph_available,cents:g.autograph_price_cents},
       {check:"selfieAvailable",price:"selfiePrice",label:"Selfies",available:g.selfie_available,cents:g.selfie_price_cents},
       {check:"photoOpAvailable",price:"photoOpPrice",label:"Professional Photo Ops",available:g.photo_op_available,cents:g.photo_op_price_cents},
      ].map(item=><div key={item.check} className="border border-line bg-ink/45 p-5">
       <label className="flex items-start gap-2 text-sm text-paper">
        <input type="checkbox" name={item.check} value="yes"
         defaultChecked={item.available} className="mt-1 h-5 w-5 accent-cyan"/>
        Offer {item.label}
       </label>
       <label className="mt-4 block text-sm text-paper">Published price (USD)
        <input name={item.price} type="text" inputMode="decimal" placeholder="Leave blank until confirmed"
         defaultValue={centsToDollars(item.cents)} className={input}/>
       </label>
      </div>)}
      <label className={label}>Optional combo price (USD)
       <input name="comboPrice" type="text" inputMode="decimal"
        defaultValue={centsToDollars(g.combo_price_cents)}
        placeholder="If a guest-approved combo exists" className={input}/>
      </label>
     </div>
    </div>

    <div className="grid gap-5 sm:grid-cols-2">
     <label className={label}>Autograph item / signing details
      <textarea name="autographDetails" rows={3} maxLength={2000}
       defaultValue={g.autograph_details} className={input}/>
     </label>
     <label className={label}>Photo-op / selfie details
      <textarea name="photoDetails" rows={3} maxLength={2000}
       defaultValue={g.photo_details} className={input}/>
     </label>
    </div>
    <label className={label}>Sales / payment instructions (public)
     <textarea name="salesNotes" rows={3} maxLength={2000}
      defaultValue={g.sales_notes} placeholder="Example: On-site only after guest approval"
      className={input}/>
    </label>
    <label className={label}>Authorized booking link (HTTPS; optional)
     <input name="purchaseUrl" type="url" maxLength={600}
      defaultValue={g.purchase_url??""} placeholder="Only use a verified guest booking page"
      className={input}/>
    </label>
    <label className={label}>Public signing / photo-op location notes
     <input name="locationNotes" maxLength={400} defaultValue={g.location_notes}
      placeholder="Leave blank until layout is confirmed" className={input}/>
    </label>
    <label className={label}>General schedule notes
     <textarea name="publicScheduleNotes" rows={3} maxLength={1200}
      defaultValue={g.public_schedule_notes} className={input}/>
    </label>
    <label className={label}>Internal organizer notes — never public
     <textarea name="internalNotes" rows={4} maxLength={4000}
      defaultValue={g.internal_notes} className={input}/>
    </label>

    <div className="border-t border-gold/30 pt-6">
     <h3 className="font-display text-2xl uppercase text-gold">Publish an official guest announcement</h3>
     <p className="mt-3 text-sm leading-relaxed text-muted">
      This will publish the guest profile, any enabled experience options,
      verified prices, and any published time slots. Do not publish during
      negotiations or before the guest representative authorizes an announcement.
     </p>
     <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="publish" value="yes"
       defaultChecked={g.is_published} className="mt-1 h-5 w-5 accent-cyan"/>
      Publish this signed guest's official public profile and available experiences
     </label>
     <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="approvePublication" value="yes"
       className="mt-1 h-5 w-5 accent-cyan"/>
      I confirm all public appearance information and announcement rights are approved.
     </label>
    </div>
    <button type="submit" className="min-h-12 bg-magenta px-6 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
      Save guest experience
    </button>
   </ActionForm>
  </section>

  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Appearance time slots</h2>
   <p className="mt-3 leading-relaxed text-muted">
    Only publish a time slot after it has been agreed with the guest and event operations team.
    All displayed times use the America/Chicago time zone.
   </p>
   <div className="mt-6 grid gap-6 lg:grid-cols-2">
    <div className="border border-cyan/20 bg-ink-2 p-5">
     <h3 className="font-display text-xl uppercase text-paper">Add a new session</h3>
     <div className="mt-5"><GuestSessionForm guestId={g.id}/></div>
    </div>
    <div className="space-y-4">
     <h3 className="font-display text-xl uppercase text-paper">Existing sessions ({sessions.length})</h3>
     {sessions.map(s=><div key={s.id} className="border border-line bg-ink-2 p-5">
      <p className="font-pixel text-[10px] uppercase tracking-wider text-cyan">
       {guestSessionLabel(s.session_type)} · {s.is_published?"Public when guest published":"Private draft"}
      </p>
      <p className="mt-3 font-display text-lg uppercase text-paper">
       {s.session_date} · {formatGuestSessionTime(s.start_time)} – {formatGuestSessionTime(s.end_time)}
      </p>
      <div className="mt-5"><GuestSessionForm guestId={g.id} session={s}/></div>
      <ActionForm action={deleteGuestSessionAction} className="mt-5 border-t border-line pt-4">
       <input type="hidden" name="guestId" value={g.id}/>
       <input type="hidden" name="sessionId" value={s.id}/>
       <label className="flex items-center gap-2 text-xs text-muted">
        <input name="confirmDelete" type="checkbox" value="yes" required
         className="h-4 w-4 accent-magenta"/>
        Confirm permanent removal
       </label>
       <button type="submit" className="mt-3 min-h-11 border border-magenta px-4 py-2 font-display text-xs uppercase text-magenta">
        Remove session
       </button>
      </ActionForm>
     </div>)}
     {!sessions.length&&<p className="border border-line p-5 text-sm text-muted">
      No sessions entered yet. You can save a guest profile without announcing signing hours.
     </p>}
    </div>
   </div>
  </section>
  <div className="flex flex-wrap gap-3">
   <Link href="/guests/autographs" target="_blank" rel="noopener noreferrer"
    className="inline-flex min-h-11 items-center border border-cyan px-4 py-3 font-display text-sm uppercase tracking-wider text-cyan">
    View public experience page ↗
   </Link>
   <Link href="/admin/guest-experiences" className="inline-flex min-h-11 items-center border border-paper/25 px-4 py-3 font-display text-sm uppercase tracking-wider text-paper">
    All guest drafts
   </Link>
  </div>
 </div>;
}
