"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { submitPanelProposal, type PanelSubmissionState } from "@/app/actions/panels";
import { PANEL_CATEGORIES, PANEL_FORMATS, PANEL_DURATIONS, PANEL_AUDIENCES, PANEL_ATTENDANCE } from "@/lib/panels/schema";

const inputStyle = "mt-2 w-full min-h-11 border border-paper/25 bg-ink px-4 py-3 text-paper placeholder:text-muted/75 focus:border-cyan focus:outline-none";
const labelStyle = "block text-sm font-semibold tracking-wide text-paper";
type Props = {name:string;label:string;required?:boolean;hint?:string;errors:Record<string,string>};
function Field({name,label,required=false,hint,errors,type="text",maxLength=120}:{type?:string;maxLength?:number}&Props){
 const id="panel-"+name;return <div><label htmlFor={id} className={labelStyle}>{label}{required?" *":""}</label>{hint&&<p id={id+"-hint"} className="mt-1 text-sm text-muted">{hint}</p>}
 <input id={id} name={name} type={type} required={required} maxLength={maxLength} aria-invalid={!!errors[name]} aria-describedby={hint?id+"-hint":undefined} className={inputStyle}/>{errors[name]&&<p role="alert" className="mt-1 text-sm text-magenta">{errors[name]}</p>}</div>
}
function Area({name,label,required=false,hint,errors}:Props){
 const id="panel-"+name;return <div><label htmlFor={id} className={labelStyle}>{label}{required?" *":""}</label>{hint&&<p className="mt-1 text-sm text-muted">{hint}</p>}
 <textarea id={id} name={name} rows={4} required={required} maxLength={4000} aria-invalid={!!errors[name]} className={inputStyle+" resize-y"}/>{errors[name]&&<p role="alert" className="mt-1 text-sm text-magenta">{errors[name]}</p>}</div>
}
function Choice({name,label,errors,options}:{name:string;label:string;errors:Record<string,string>;options:readonly string[]}){
 const id="panel-"+name;return <div><label htmlFor={id} className={labelStyle}>{label} *</label><select id={id} name={name} required defaultValue="" aria-invalid={!!errors[name]} className={inputStyle}><option value="" disabled>Choose an option</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>{errors[name]&&<p role="alert" className="mt-1 text-sm text-magenta">{errors[name]}</p>}</div>
}
function Section({number,title,children}:{number:string;title:string;children:React.ReactNode}){return <section className="space-y-5 border-t border-line pt-8"><h2 className="font-display text-2xl uppercase text-paper"><span className="mr-3 text-cyan">{number}</span>{title}</h2>{children}</section>;}
export function PanelProposalForm(){
 const [state,action,pending]=useActionState(submitPanelProposal, {status:"idle",message:"",fieldErrors:{}} as PanelSubmissionState);
 const [submissionId]=useState(()=>crypto.randomUUID());
 const errors=state.fieldErrors;
 if(state.status==="success")return <div role="status" className="border border-cyan/50 bg-[#10182b] p-7 sm:p-10"><p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Submission received</p><h2 className="mt-3 font-display text-3xl uppercase">You're in the queue!</h2><p className="mt-4 text-muted">{state.message}</p>{state.reference&&<p className="mt-4 border border-cyan/30 bg-ink px-4 py-3 font-display text-lg text-cyan">Reference: {state.reference}</p>}<p className="mt-4 text-sm text-muted">Save your reference. No panel slot is reserved by this form.</p><Link href="/schedule" className="mt-6 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Event schedule</Link></div>;
 return <form action={action} className="space-y-9">
  <input type="hidden" name="submissionId" value={submissionId}/>
  <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="panel-fax">Leave blank</label><input id="panel-fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off"/></div>
  {state.status==="error"&&<p role="alert" className="border border-magenta/50 bg-magenta/10 p-4">{state.message}</p>}
  <Section number="01" title="Presenter details">
   <div className="grid gap-5 sm:grid-cols-2">
    <Field name="contactName" label="Lead presenter name" required errors={errors}/>
    <Field name="displayName" label="Public presenter / creator name" hint="Optional" errors={errors}/>
    <Field name="email" label="Email address" type="email" maxLength={254} required errors={errors}/>
    <Field name="phone" label="Phone number" type="tel" maxLength={40} errors={errors}/>
   </div>
   <Field name="socialUrl" label="Website or social profile" type="url" maxLength={400} hint="Optional: a link to your work" errors={errors}/>
  </Section>
  <Section number="02" title="Your panel idea">
   <Field name="panelTitle" label="Proposed panel title" maxLength={200} required errors={errors}/>
   <div className="grid gap-5 sm:grid-cols-2">
    <Choice name="topicCategory" label="Topic category" options={PANEL_CATEGORIES} errors={errors}/>
    <Choice name="panelFormat" label="Panel format" options={PANEL_FORMATS} errors={errors}/>
    <Choice name="durationMinutes" label="Preferred length (minutes)" options={PANEL_DURATIONS} errors={errors}/>
    <Choice name="audience" label="Intended audience" options={PANEL_AUDIENCES} errors={errors}/>
    <Choice name="estimatedAttendance" label="Estimated attendance" options={PANEL_ATTENDANCE} errors={errors}/>
   </div>
   <Area name="description" label="Describe the panel and what attendees will learn" required errors={errors}/>
   <Area name="coPresenters" label="Other presenters and their roles" errors={errors}/>
   <Area name="pastExperience" label="Relevant experience" hint="First-time presenters are welcome." errors={errors}/>
  </Section>
  <Section number="03" title="Production & scheduling">
   <Area name="avNeeds" label="Equipment / A/V needs" hint="Projector, microphones, consoles, tables, internet, etc. Requests are not guarantees." errors={errors}/>
   <Area name="schedulingNotes" label="Day or time preferences" hint="Saturday, Sunday, or scheduling conflicts. Times are not assigned yet." errors={errors}/>
   <Area name="accessibilityNeeds" label="Accommodation requests" hint="Optional. Describe what would help, not a diagnosis." errors={errors}/>
  </Section>
  <section className="space-y-4 border-t border-line pt-7">
   <h2 className="font-display text-xl uppercase text-paper">Before submitting</h2>
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper/90"><input type="checkbox" name="panelAck" required className="mt-1 h-5 w-5 accent-cyan"/><span>I understand this is a proposal for review, not a confirmed booking, fee, reimbursement or complimentary badge.</span></label>
   {errors.panelAck&&<p role="alert" className="text-sm text-magenta">{errors.panelAck}</p>}
   <label className="flex items-start gap-3 text-sm leading-relaxed text-paper/90"><input type="checkbox" name="contactConsent" required className="mt-1 h-5 w-5 accent-cyan"/><span>I agree to be contacted about this proposal and have read the <Link href="/privacy" className="text-cyan underline">Privacy Policy</Link> and <Link href="/code-of-conduct" className="text-cyan underline">Code of Conduct</Link>.</span></label>
   {errors.contactConsent&&<p role="alert" className="text-sm text-magenta">{errors.contactConsent}</p>}
   <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center bg-magenta px-6 py-3 font-display text-lg uppercase tracking-widest text-ink hover:bg-gold disabled:opacity-60 sm:w-auto">{pending?"Submitting...":"Submit panel proposal"}</button>
  </section>
 </form>;
}
