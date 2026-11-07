import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata:Metadata=createPageMetadata({
 title:"Cosplay Contest & Registration | Midwest Pixel Fest 2027",
 description:"Explore planned cosplay contest divisions, costume guidelines, judging considerations and registration for Midwest Pixel Fest 2027 in Emporia.",
 path:"/cosplay/contest",
});

const divisions=[
 {name:"Beginner Craftsmanship",detail:"For makers newer to competitive costume construction. Tell us which parts you created yourself."},
 {name:"Experienced Craftsmanship",detail:"For builders with established craftsmanship experience and more complex construction techniques."},
 {name:"Group Entry",detail:"For coordinated costumes presented by two or more participants. Stage capacity and final group rules are pending."},
 {name:"Youth Showcase",detail:"An opportunity for younger cosplayers to express themselves, subject to guardian permission and finalized safety rules."},
 {name:"Community Showcase",detail:"For cosplayers who would rather celebrate their character on stage without seeking craftsmanship awards."},
];
const criteria=[
 {number:"01",title:"Craftsmanship",detail:"How the costume was built, finished and assembled; give credit to all contributors."},
 {number:"02",title:"Creativity",detail:"Original interpretation, problem-solving, detail and thoughtful design choices."},
 {number:"03",title:"Presentation",detail:"How clearly and confidently the costume or character is introduced to the audience."},
 {number:"04",title:"Safety & respect",detail:"Following prop rules, stage instructions, accessibility requirements and community standards."},
];
const faqs=[
 {q:"Is submitting an entry the same as being accepted?",a:"No. Registrations enter an organizer review queue. Selected participants will be contacted separately. Space, division eligibility and event logistics are subject to the venue and final contest rules."},
 {q:"Do I need to make every part of my costume?",a:"Not to express interest. Please describe what is handmade, purchased, assembled or commissioned honestly. Final craftsmanship-award eligibility and scoring criteria are still being finalized."},
 {q:"Can kids or teens apply?",a:"Yes, an adult parent/guardian or authorized adult group representative may submit an application for review. Separate guardian consent and age or backstage restrictions may apply once final rules are published. Entry is not guaranteed."},
 {q:"Do I need a ticket?",a:"Event admission policies and any complimentary contestant credential arrangements have not yet been finalized. Do not assume a contest application includes free admission."},
 {q:"What if I have large props, wings or powered costume pieces?",a:"List them on the registration form, read the Weapons & Props Policy, and expect an additional safety review. An application does not count as approval of a prop."},
 {q:"When will the contest take place and what are the prizes?",a:"The contest's day, stage time, judges, divisions, awards, registration deadline and prizes have not yet been announced. We will publish them once confirmed."},
];

export default function CosplayContestPage(){
 return <InnerPage
  path="/cosplay/contest"
  eyebrow="Cosplay / Contest"
  title="Take the Stage"
  intro="Your build. Your character. Your moment. Help us shape the inaugural Midwest Pixel Fest cosplay contest by applying to participate."
  crumbs={[{name:"Home",path:"/"},{name:"Cosplay",path:"/cosplay"},{name:"Contest",path:"/cosplay/contest"}]}
 >
  <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
   <div className="border-l-4 border-magenta bg-panel p-6 sm:p-8">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">2027 Contest Applications</p>
    <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Show us what you've made.</h2>
    <p className="mt-4 leading-relaxed text-muted">We're accepting proposals for individual costumes, group presentations and youth participation. First-time makers are welcome. All submissions are reviewed before places are offered; this is not a confirmed stage registration.</p>
    <Link href="/cosplay/contest/register" className="mt-7 inline-flex min-h-12 items-center justify-center bg-magenta px-7 py-3 font-display text-base uppercase tracking-widest text-ink shadow-[4px_4px_0_var(--color-cyan)] hover:bg-gold">Apply for the contest →</Link>
   </div>
   <div className="border border-cyan/30 bg-ink-2 p-6 sm:p-8">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Important 2027 planning note</p>
    <p className="mt-4 leading-relaxed text-muted">Midwest Pixel Fest is planned for October 16–17, 2027. Webb Hall at Emporia State University is our selected venue, but the agreement is pending. Contest times, stage dimensions, capacity, judges, final rules and prizes will be confirmed later.</p>
    <p className="mt-4 text-sm text-muted">There is no contest application fee collected on this form. Submitting does not guarantee admission or a paid appearance.</p>
   </div>
  </div>

  <section className="mt-14" id="divisions">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Where do you fit?</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Possible contest divisions</h2>
   <p className="mt-4 max-w-4xl leading-relaxed text-muted">Choose a provisional division when registering. These are planning categories, not final award promises; the organizing team may adjust divisions based on space, applications, age eligibility and available judging resources.</p>
   <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {divisions.map((d,i)=><article key={d.name} className="border border-line border-t-4 border-t-cyan/60 bg-panel p-6">
     <p className="font-pixel text-xs text-magenta">0{i+1}</p>
     <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">{d.name}</h3>
     <p className="mt-3 leading-relaxed text-muted">{d.detail}</p>
    </article>)}
   </div>
  </section>

  <section className="mt-14 border border-cyan/25 bg-[#11162a] p-6 sm:p-8" id="judging">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">What we value</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Judging considerations</h2>
   <p className="mt-4 leading-relaxed text-muted">For competitive entries, we anticipate evaluating the following qualities. Final scoring weights, eligibility rules and judging procedures are not yet established.</p>
   <div className="mt-7 grid gap-5 sm:grid-cols-2">
    {criteria.map(c=><div key={c.number}><p className="font-pixel text-[11px] text-cyan">{c.number} / CATEGORY</p><h3 className="mt-2 font-display text-xl uppercase text-paper">{c.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{c.detail}</p></div>)}
   </div>
  </section>

  <section className="mt-14" id="rules">
   <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Safety & participation</h2>
   <div className="mt-5 grid gap-4 sm:grid-cols-2">
    <div className="border border-line bg-panel p-6"><h3 className="font-display text-xl uppercase text-paper">Props and movement</h3><p className="mt-3 leading-relaxed text-muted">Functional weapons and hazardous materials are not permitted. Oversized builds may require a separate check. Onstage movement must respect the venue's eventual capacity and safety requirements.</p><Link href="/weapons-policy" className="mt-4 inline-block font-display text-sm uppercase text-cyan underline">Read the weapons policy →</Link></div>
    <div className="border border-line bg-panel p-6"><h3 className="font-display text-xl uppercase text-paper">Respect & consent</h3><p className="mt-3 leading-relaxed text-muted">Photography consent, respectful behavior, guardian supervision for minors and event staff instructions apply to all participants. Separate photo and participation permissions may be requested after acceptance.</p><Link href="/code-of-conduct" className="mt-4 inline-block font-display text-sm uppercase text-cyan underline">Read the Code of Conduct →</Link></div>
   </div>
  </section>

  <section className="mt-14" id="faq">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Before you apply</p>
   <h2 className="mt-3 font-display text-3xl uppercase text-paper">Contest questions</h2>
   <div className="mt-6 divide-y divide-line border-y border-line">{faqs.map(f=><details key={f.q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase text-paper [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden="true" className="text-2xl text-cyan transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl leading-relaxed text-muted">{f.a}</p></details>)}</div>
  </section>
  <div className="mt-12 border border-magenta/35 bg-panel p-6 text-center sm:p-10">
   <h2 className="font-display text-3xl uppercase text-paper">Ready to join the lineup?</h2>
   <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-muted">Tell us about your costume, your preferred division and what would help you participate. No fee or contract is required to apply.</p>
   <Link href="/cosplay/contest/register" className="mt-6 inline-flex min-h-12 items-center bg-magenta px-7 py-3 font-display text-base uppercase tracking-widest text-ink hover:bg-gold">Submit your cosplay entry</Link>
  </div>
 </InnerPage>;
}
