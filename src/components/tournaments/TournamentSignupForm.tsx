"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerForTournament, type TournamentSignupState } from "@/app/actions/tournament-registration";
import { TOURNAMENT_ENTRY_STATUS_LABELS } from "@/lib/tournaments/model";
import type { TournamentPublic } from "@/lib/tournaments/model";

const input="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-3 text-base text-paper focus:border-cyan focus:outline-none";
const label="block text-sm font-semibold tracking-wide text-paper";
function ErrorText({value}:{value?:string}) {return value?<p role="alert" className="mt-1 text-sm text-magenta">{value}</p>:null;}
export function TournamentSignupForm({tournament}:{tournament:TournamentPublic}){
 const [state,action,pending]=useActionState(registerForTournament,
  {status:"idle",message:"",fieldErrors:{}} as TournamentSignupState);
 const [submissionId]=useState(()=>crypto.randomUUID());
 const [age,setAge]=useState("");
 const errors=state.fieldErrors;
 if(state.status==="success")return <div role="status" className="border border-cyan/35 bg-[#111a2e] p-6 sm:p-9">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Submission recorded</p>
   <h2 className="mt-4 font-display text-3xl uppercase text-paper">
    {state.registrationStatus==="waitlisted"?"You are on the waitlist":"You're registered!"}
   </h2>
   <p className="mt-4 leading-relaxed text-muted">{state.message}</p>
   <p className="mt-5 border border-cyan/35 bg-ink px-4 py-4 font-display text-xl text-cyan">
    Reference: {state.reference}
   </p>
   <p className="mt-4 text-sm leading-relaxed text-muted">
    Keep your reference for check-in or organizer support. No payment was collected
    through this form. Save this information; an automatic confirmation email is not currently sent.
   </p>
   <Link href="/tournaments" className="mt-6 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Tournament directory</Link>
  </div>;

 return <form action={action} className="space-y-7">
   <input type="hidden" name="submissionId" value={submissionId}/>
   <input type="hidden" name="tournamentId" value={tournament.id}/>
   <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
     <label htmlFor="tm-fax">Leave blank</label>
     <input id="tm-fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off"/>
   </div>
   {state.status==="error"&&<p role="alert" className="border border-magenta/35 bg-magenta/10 p-4 text-paper">{state.message}</p>}
   <div className="border-b border-line pb-6">
    <h3 className="font-display text-2xl uppercase text-paper">Player / team registration</h3>
    <p className="mt-3 text-sm leading-relaxed text-muted">
     An adult must complete this form. If a competitor is under 18,
     their parent/guardian or authorized adult representative must register and
     confirm guardian permission. We do not ask for birthdates or minors' private contact details.
    </p>
   </div>
   <div className="grid gap-5 sm:grid-cols-2">
    <label className={label}>Adult contact name *
     <input name="contactName" required maxLength={120} className={input} aria-invalid={!!errors.contactName}/>
     <ErrorText value={errors.contactName}/>
    </label>
    <label className={label}>Adult contact email *
     <input name="contactEmail" type="email" required maxLength={254} className={input} aria-invalid={!!errors.contactEmail}/>
     <ErrorText value={errors.contactEmail}/>
    </label>
   </div>
   <label className={label}>{tournament.entry_type==="team"?"Team display name *":"Player display name *"}
    <input name="playerName" required maxLength={100} className={input}
     placeholder={tournament.entry_type==="team"?"Your team name":"Your tournament nickname"}
     aria-invalid={!!errors.playerName}/>
    <p className="mt-1 text-xs font-normal leading-relaxed text-muted">
     Your display name is used by organizers; public brackets use it only if you choose to opt in.
    </p>
    <ErrorText value={errors.playerName}/>
   </label>
   {tournament.entry_type==="team"&&<label className={label}>Team roster (required) *
     <textarea name="rosterNotes" required rows={3} maxLength={900}
      className={input} aria-invalid={!!errors.rosterNotes}
      placeholder={"List the "+tournament.team_size+" participants' player nicknames; avoid sharing minors' private contact information."}/>
     <ErrorText value={errors.rosterNotes}/>
    </label>}
   <label className={label}>Youngest competitor's age group *
    <select name="ageBand" required value={age} onChange={e=>setAge(e.target.value)}
      className={input} aria-invalid={!!errors.ageBand}>
      <option value="" disabled>Select an age range</option>
      <option value="adult">All competitors 18 or older</option>
      <option value="minor">At least one competitor age 13–17</option>
      <option value="under_13">At least one competitor under 13</option>
    </select>
    <ErrorText value={errors.ageBand}/>
   </label>
   {(age==="minor"||age==="under_13")&&<label className="flex items-start gap-3 border-l-4 border-gold bg-ink-2 p-4 text-sm leading-relaxed text-paper">
    <input type="checkbox" name="guardianAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
    <span>I confirm I am the parent/guardian or an authorized adult who has guardian permission for every minor competitor on this entry.</span>
   </label>}
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
    <input type="checkbox" name="adultAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
    <span>I am at least 18 years old and authorized to register this player or team.</span>
   </label>
   <ErrorText value={errors.adultAck}/>
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
    <input type="checkbox" name="publicNameConsent" className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
    <span>I agree to the chosen player/team nickname being displayed in public brackets and results. If unchecked, a registration alias will be used instead. I have authority to agree on behalf of this entry.</span>
   </label>
   <div className="border-t border-line pt-6">
    <h3 className="font-display text-2xl uppercase text-paper">Before you register</h3>
    <p className="mt-3 text-sm leading-relaxed text-muted">
     Tournament registration does not include general convention admission.
     All entrants must follow game rules, check-in requirements and the
     <Link href="/code-of-conduct" className="mx-1 text-cyan underline">Code of Conduct</Link>.
     If this event has an entry fee, this form does not collect it; any payment
     arrangements must be published separately by the organizers.
    </p>
   </div>
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
    <input type="checkbox" name="rulesAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
    <span>I have read the tournament rules, understand capacity and waitlist placement,
     and agree to check in before competing.</span>
   </label>
   <ErrorText value={errors.rulesAck}/>
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
    <input type="checkbox" name="privacyAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/>
    <span>I agree that Midwest Pixel Fest may use this contact information to administer
     the tournament and have read the <Link href="/privacy" className="text-cyan underline">Privacy Policy</Link>.</span>
   </label>
   <ErrorText value={errors.privacyAck}/>
   <button type="submit" disabled={pending}
    className="inline-flex min-h-12 w-full items-center justify-center bg-magenta px-6 py-3 font-display text-base uppercase tracking-wider text-ink hover:bg-gold disabled:opacity-50 sm:w-auto">
    {pending?"Submitting...":"Register / Join Waitlist"}
   </button>
  </form>;
}
