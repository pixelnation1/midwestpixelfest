"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitCosplayEntry, type CosplayEntryState } from "@/app/actions/cosplay-contest";
import {
  COSPLAY_AGE_BANDS, COSPLAY_ENTRY_TYPES, COSPLAY_DIVISIONS,
  COSPLAY_CONSTRUCTION, COSPLAY_DAYS,
} from "@/lib/cosplay-contest/schema";

const fieldStyle="mt-2 min-h-11 w-full rounded-none border border-paper/30 bg-ink px-4 py-3 text-base text-paper placeholder:text-muted focus:border-cyan focus:outline-none";
const labelStyle="block text-sm font-semibold tracking-wide text-paper";
type Err=Record<string,string>;
function ErrorText({error}:{error?:string}){return error?<p role="alert" className="mt-2 text-sm text-magenta">{error}</p>:null;}
function Input({name,label,errors,required=false,type="text",maxLength=120,hint}:{name:string;label:string;errors:Err;required?:boolean;type?:string;maxLength?:number;hint?:string}){
 const id="cos-"+name;
 return <div><label htmlFor={id} className={labelStyle}>{label}{required?" *":""}</label>{hint&&<p className="mt-1 text-sm leading-relaxed text-muted">{hint}</p>}
 <input id={id} name={name} type={type} maxLength={maxLength} required={required} aria-invalid={!!errors[name]} className={fieldStyle}/><ErrorText error={errors[name]}/></div>;
}
function Area({name,label,errors,required=false,hint}:{name:string;label:string;errors:Err;required?:boolean;hint?:string}){
 const id="cos-"+name;return <div><label htmlFor={id} className={labelStyle}>{label}{required?" *":""}</label>
 {hint&&<p className="mt-1 text-sm leading-relaxed text-muted">{hint}</p>}
 <textarea id={id} name={name} rows={4} maxLength={4000} required={required} aria-invalid={!!errors[name]} className={fieldStyle+" resize-y"}/><ErrorText error={errors[name]}/></div>;
}
function Select({name,label,errors,options,required=true,onChange}:{name:string;label:string;errors:Err;required?:boolean;options:readonly {value:string;label:string}[];onChange?:(value:string)=>void}){
 const id="cos-"+name;return <div><label htmlFor={id} className={labelStyle}>{label}{required?" *":""}</label>
 <select id={id} name={name} defaultValue="" required={required} onChange={onChange?e=>onChange(e.target.value):undefined} aria-invalid={!!errors[name]} className={fieldStyle}>
  <option value="" disabled>Choose an option</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
 </select><ErrorText error={errors[name]}/></div>;
}
function Section({number,title,children}:{number:string;title:string;children:React.ReactNode}){return <section className="space-y-5 border-t border-line pt-8"><h2 className="font-display text-2xl uppercase tracking-wide text-paper"><span className="mr-3 text-cyan">{number}</span>{title}</h2>{children}</section>;}

export function CosplayContestForm(){
 const [state,action,pending]=useActionState(submitCosplayEntry,{status:"idle",message:"",fieldErrors:{}} as CosplayEntryState);
 const [submissionId]=useState(()=>crypto.randomUUID());
 const [ageBand,setAgeBand]=useState("");
 const [entryType,setEntryType]=useState("");
 const errors=state.fieldErrors;
 if(state.status==="success")return <div role="status" className="border border-cyan/40 bg-[#11172a] p-7 sm:p-10">
  <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Application received</p>
  <h2 className="mt-3 font-display text-3xl uppercase text-paper">You're in the review queue!</h2>
  <p className="mt-4 leading-relaxed text-muted">{state.message}</p>
  {state.reference&&<p className="mt-5 border border-cyan/30 bg-ink p-4 font-display text-lg text-cyan">Reference: {state.reference}</p>}
  <p className="mt-4 text-sm leading-relaxed text-muted">Keep your reference. We will contact selected applicants when the contest rules, schedule and venue arrangements are finalized.</p>
  <Link href="/cosplay/contest" className="mt-6 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Return to contest information</Link>
 </div>;
 return <form action={action} className="space-y-9">
  <input type="hidden" name="submissionId" value={submissionId}/>
  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="cos-fax">Leave blank</label><input id="cos-fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off"/></div>
  {state.status==="error"&&<p role="alert" className="border border-magenta/50 bg-magenta/10 p-4 text-paper">{state.message}</p>}
  <Section number="01" title="Adult contact information">
   <p className="text-sm leading-relaxed text-muted">An adult age 18+ must submit this form, including registrations for children or teen groups. Please do not enter a minor's private contact information.</p>
   <div className="grid gap-5 sm:grid-cols-2">
    <Input name="contactName" label="Adult applicant / guardian name" errors={errors} required/>
    <Input name="email" label="Adult contact email" type="email" maxLength={254} errors={errors} required/>
    <Input name="phone" label="Phone (optional)" type="tel" maxLength={40} errors={errors}/>
    <Input name="publicName" label="Cosplayer or group display name" errors={errors} maxLength={200} hint="The name you would want shown publicly if accepted. A nickname or group name is fine." required/>
   </div>
   <label className="flex items-start gap-3 text-sm text-paper/90"><input type="checkbox" name="adultAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/><span>I confirm I am at least 18 years old and am authorized to submit this registration.</span></label>
   <ErrorText error={errors.adultAck}/>
  </Section>
  <Section number="02" title="Contest entry">
   <div className="grid gap-5 sm:grid-cols-2">
    <Select name="entryType" label="Entry type" options={COSPLAY_ENTRY_TYPES} errors={errors} onChange={setEntryType}/>
    <Select name="ageBand" label="Age range of youngest participant" options={COSPLAY_AGE_BANDS} errors={errors} onChange={setAgeBand}/>
    <div><label htmlFor="cos-groupSize" className={labelStyle}>Number of participants *</label>
     <input id="cos-groupSize" key={entryType||"default"} type="number" name="groupSize" required min={entryType==="group"?2:1} max={entryType==="individual"?1:10} defaultValue={entryType==="group"?2:1} className={fieldStyle} aria-invalid={!!errors.groupSize}/>
     <ErrorText error={errors.groupSize}/>
    </div>
    <Select name="divisionPreference" label="Preferred division (provisional)" options={COSPLAY_DIVISIONS} errors={errors}/>
   </div>
   {(ageBand==="child"||ageBand==="teen")&&<div className="border-l-4 border-gold bg-ink-2 p-5">
    <p className="font-display text-lg uppercase text-gold">Guardian permission required</p>
    <p className="mt-2 text-sm leading-relaxed text-muted">For minors, an adult must be the parent/legal guardian or an adult group representative who has permission from every minor participant's guardian. Final participation may require a separately signed consent form.</p>
    <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-paper/90"><input type="checkbox" name="guardianAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/><span>I confirm the guardian permission described above, and understand final youth eligibility and stage rules are still pending.</span></label>
    <ErrorText error={errors.guardianAck}/>
   </div>}
   <Input name="characterName" label="Character / costume name" maxLength={200} errors={errors} required/>
   <Input name="seriesName" label="Series, game, fandom or original universe" maxLength={200} errors={errors} hint="Optional for an original character."/>
   <Area name="costumeDescription" label="Tell us about the costume" errors={errors} required hint="Describe the design, source inspiration and what you would present."/>
   <Select name="constructionType" label="How was the costume made?" options={COSPLAY_CONSTRUCTION} errors={errors}/>
   <Area name="buildNotes" label="Your construction work or creative process (optional)" errors={errors} hint="Materials, sewing, 3D printing, foam work, makeup, special effects, etc."/>
   <Area name="propsDescription" label="Props, armor or oversized pieces (optional)" errors={errors} hint="Mention anything large, rigid, powered, glowing or potentially needing safety review."/>
   <Input name="referenceUrl" label="Optional photo or portfolio link" type="url" maxLength={400} errors={errors} hint="Publicly shareable link only; no file upload. Avoid private images of children."/>
  </Section>
  <Section number="03" title="Availability & stage planning">
   <Select name="dayPreference" label="Preferred event day" options={COSPLAY_DAYS} errors={errors}/>
   <Area name="stageNotes" label="Stage, music or presentation needs (optional)" errors={errors} hint="Tell us if you prefer a simple walk-on, need help with staging, or have any other requests. No stage time is confirmed yet."/>
   <Area name="accessibilityNeeds" label="Accessibility or participation request (optional)" errors={errors} hint="Describe the accommodation needed, not a diagnosis."/>
  </Section>
  <section className="space-y-4 border-t border-line pt-8">
   <h2 className="font-display text-2xl uppercase text-paper">Final confirmations</h2>
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper/90"><input type="checkbox" name="rulesAck" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/><span>I understand this is an application, not confirmed contest entry; division eligibility, awards, judging, scheduling, admission, and venue procedures are subject to final published rules. I agree to follow the <Link href="/weapons-policy" className="text-cyan underline">Weapons & Props Policy</Link> and <Link href="/code-of-conduct" className="text-cyan underline">Code of Conduct</Link>.</span></label>
   <ErrorText error={errors.rulesAck}/>
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper/90"><input type="checkbox" name="contactConsent" required className="mt-1 h-5 w-5 shrink-0 accent-cyan"/><span>I agree to be contacted about this application and have read the <Link href="/privacy" className="text-cyan underline">Privacy Policy</Link>. No payment is collected by this form.</span></label>
   <ErrorText error={errors.contactConsent}/>
   <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center bg-magenta px-6 py-3 font-display text-base uppercase tracking-widest text-ink hover:bg-gold disabled:opacity-60 sm:w-auto">{pending?"Submitting...":"Submit registration"}</button>
  </section>
 </form>;
}
