import Link from "next/link";
import type { PublicGuestExperience, PublicGuestSession } from "@/lib/guest-experiences/model";
import { formatGuestPrice } from "@/lib/guest-experiences/model";
import { formatGuestSessionTime, guestSessionLabel } from "@/lib/persistence/guest-experiences";

const serviceTypes=[
 {field:"autograph_available",price:"autograph_price_cents",title:"Autographs",detail:"Guest-approved signing items and options"},
 {field:"selfie_available",price:"selfie_price_cents",title:"Selfies",detail:"Selfie opportunities where explicitly offered"},
 {field:"photo_op_available",price:"photo_op_price_cents",title:"Professional Photo Ops",detail:"Photographer-managed photo opportunities"},
] as const;

function Session({session}:{session:PublicGuestSession}) {
 const date=session.session_date==="2027-10-16"?"Saturday, October 16":"Sunday, October 17";
 return <li className="border border-line bg-ink/55 p-4">
   <p className="font-pixel text-[10px] uppercase tracking-widest text-cyan">{guestSessionLabel(session.session_type)}</p>
   <p className="mt-2 font-display text-lg uppercase text-paper">{date}</p>
   <p className="mt-1 text-sm text-gold">
    {formatGuestSessionTime(session.start_time)} – {formatGuestSessionTime(session.end_time)} CT
   </p>
   {session.location_label&&<p className="mt-2 text-sm text-muted">Location: {session.location_label}</p>}
   {session.public_note&&<p className="mt-2 text-sm leading-relaxed text-muted">{session.public_note}</p>}
 </li>;
}

export function GuestExperienceDetails({guest}:{guest:PublicGuestExperience}) {
 const services=serviceTypes.filter(type=>guest[type.field]);
 const hasServices=services.length>0;
 return <article className="min-w-0 overflow-hidden border border-cyan/25 bg-panel" id={"guest-"+guest.slug}>
  <div className="grid gap-0 md:grid-cols-[230px_minmax(0,1fr)] lg:grid-cols-[285px_minmax(0,1fr)]">
    <div className="flex min-h-64 items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(45,226,255,.15),transparent_50%),radial-gradient(circle_at_78%_80%,rgba(255,45,149,.16),transparent_55%)]">
     {guest.image_url?(
       // Approved representative/guest promotional image.
       // eslint-disable-next-line @next/next/no-img-element
       <img src={guest.image_url} alt={"Official guest photo of "+guest.display_name}
         loading="lazy" className="h-full max-h-[400px] w-full object-contain"/>
     ):<span aria-hidden="true" className="font-display text-8xl uppercase text-cyan/60">{guest.display_name.trim().slice(0,1)}</span>}
    </div>
    <div className="flex min-w-0 flex-col p-6 sm:p-8">
      <p className="font-pixel text-[10px] uppercase tracking-[.17em] text-gold">Confirmed guest · {guest.role_label}</p>
      <h2 className="mt-3 break-words font-display text-3xl uppercase leading-tight tracking-wide text-paper sm:text-4xl">
       {guest.display_name}
      </h2>
      <p className="mt-4 leading-relaxed text-muted">{guest.bio}</p>
      {hasServices?<div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map(type=><div key={type.field} className="border border-paper/15 bg-ink/40 p-4">
          <h3 className="font-display text-lg uppercase tracking-wide text-paper">{type.title}</h3>
          <p className="mt-2 font-display text-xl text-gold">{formatGuestPrice(guest[type.price])}</p>
          <p className="mt-2 text-xs text-muted">{type.detail}</p>
        </div>)}
        {guest.combo_price_cents!==null&&<div className="border border-gold/40 bg-gold/5 p-4">
          <h3 className="font-display text-lg uppercase tracking-wide text-paper">Combo option</h3>
          <p className="mt-2 font-display text-xl text-gold">{formatGuestPrice(guest.combo_price_cents)}</p>
          <p className="mt-2 text-xs text-muted">See the guest's details for eligible items</p>
        </div>}
      </div>:<p className="mt-6 border border-gold/35 p-4 text-sm text-gold">Autograph and photo-op options have not been announced for this guest.</p>}
      {guest.autograph_details&&<p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted"><strong className="text-paper">Autograph details:</strong> {guest.autograph_details}</p>}
      {guest.photo_details&&<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted"><strong className="text-paper">Photo details:</strong> {guest.photo_details}</p>}
      {guest.location_notes&&<p className="mt-3 text-sm leading-relaxed text-muted"><strong className="text-paper">Location:</strong> {guest.location_notes}</p>}
      {guest.sales_notes&&<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted"><strong className="text-paper">Purchasing:</strong> {guest.sales_notes}</p>}
      {guest.purchase_url&&hasServices&&<a href={guest.purchase_url} target="_blank" rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 self-start items-center bg-magenta px-6 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
         View official guest experience booking <span className="sr-only">(opens in new tab)</span>
       </a>}
      <Link href={"/guests/"+guest.slug} className="mt-6 inline-flex min-h-11 self-start items-center font-display text-sm uppercase tracking-widest text-cyan hover:text-gold">
        View guest profile →
      </Link>
    </div>
  </div>
  <div className="border-t border-line p-5 sm:p-7">
    <h3 className="font-display text-xl uppercase tracking-wide text-paper">Guest appearance schedule</h3>
    {guest.public_schedule_notes&&<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted">{guest.public_schedule_notes}</p>}
    {guest.sessions.length>0?<ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {guest.sessions.map(session=><Session key={session.id} session={session}/>)}
    </ul>:<p className="mt-3 text-sm leading-relaxed text-muted">
      Specific autograph and photo-op times have not been published yet. Check back for official updates.
    </p>}
  </div>
 </article>;
}
