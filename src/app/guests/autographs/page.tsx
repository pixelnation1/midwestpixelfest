import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { GuestExperienceDetails } from "@/components/guests/GuestExperienceDetails";
import { listPublicGuestExperiences } from "@/lib/persistence/guest-experiences";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata:Metadata=createPageMetadata({
 title:"Guest Autographs & Photo Opportunities | Midwest Pixel Fest 2027",
 description:"Find confirmed Midwest Pixel Fest 2027 autograph signings, selfie opportunities, professional photo ops, guest schedules and official pricing when announced.",
 path:"/guests/autographs",
});

const overview=[
 {num:"01",title:"Choose your guest",description:"Check our official confirmed guest lineup, then review the experiences each guest is offering. Not every guest offers autographs or photo opportunities."},
 {num:"02",title:"Check the details",description:"Review the specific guest's published prices, what's included, their signing sessions, and any restrictions. Schedules and availability may change."},
 {num:"03",title:"Follow official purchasing instructions",description:"If advance sales are offered, we'll link only to the authorized booking page. Otherwise, each guest listing will explain onsite arrangements once confirmed."},
 {num:"04",title:"Enjoy your experience",description:"Arrive within the instructed window, respect lines and accessibility needs, and follow staff and guest-representative directions."},
];
const faqs=[
 {q:"Are autographs included in convention admission?",a:"No general inclusion has been announced. Autographs, selfies and professional photos may cost extra, depending on the guest and their confirmed terms. Published guest-specific prices take precedence."},
 {q:"Is a selfie the same as a professional photo op?",a:"Not necessarily. A selfie is typically an informal photo taken at a guest's table if offered. Professional photo ops generally involve a separate photographer and scheduled session. Each option will be clearly labeled where confirmed."},
 {q:"Can I bring an item to be signed?",a:"Guests may have item restrictions, autograph policies or different prices for particular items. Please check their official listing before bringing an item and follow the venue's safety and prop policies."},
 {q:"Do I need to book a time in advance?",a:"Only if the published guest listing says so. Some experiences may be available at a table or sold in person; others may use separate time slots, limited inventory, or advance purchasing."},
 {q:"Where are the photo-op and autograph areas?",a:"Exact signing locations, photo-op arrangements and lines are not finalized while the Webb Hall venue agreement and event floor plan are pending. Check each confirmed guest's listing and the official floor map."},
 {q:"What about refunds, missed sessions or guest cancellations?",a:"Refund and replacement rules depend on the specific seller and published purchase terms. An event admission ticket is separate from any paid guest experience. Review all terms before purchasing."},
 {q:"Are guest interactions and photos guaranteed?",a:"No. A general admission ticket does not guarantee access to a specific guest, an autograph, or a photo. Paid experiences, if offered, are governed by the terms for that particular booking."},
];

export default async function GuestAutographsPage(){
 const published=await listPublicGuestExperiences();
 const available=published.filter(g=>g.autograph_available||g.photo_op_available||g.selfie_available);
 return <InnerPage
  path="/guests/autographs"
  eyebrow="Special guests / Fan experiences"
  title="Autographs & Photo Opportunities"
  intro="Meet the talent behind the stories, characters and games you love. Explore official guest signings, selfies and photo opportunities when details are confirmed."
  crumbs={[{name:"Home",path:"/"},{name:"Guests",path:"/guests"},{name:"Autographs & Photo Ops",path:"/guests/autographs"}]}
 >
  <div className="mb-10 border-l-4 border-gold bg-panel p-6 sm:p-8">
   <p className="font-pixel text-[11px] uppercase tracking-[.16em] text-gold">Official guest experiences only</p>
   <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">Plan ahead for your favorite guest.</h2>
   <p className="mt-3 leading-relaxed text-muted">
    Autographs and photo opportunities are separate from convention admission
    unless a confirmed guest listing specifically states otherwise. Prices, product
    options, booking requirements and time slots will appear only after the guest
    appearance has been contracted and approved for public announcement.
   </p>
   <p className="mt-3 text-sm leading-relaxed text-muted">
    No celebrity appearances, guest prices or photo-op services are being announced
    simply because discussions are underway with a booking agency.
   </p>
  </div>

  <section id="guest-experiences" className="scroll-mt-24">
   <p className="font-pixel text-[11px] uppercase tracking-[.18em] text-cyan">The official lineup</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Guest signing & photo opportunities</h2>
   <p className="mt-3 max-w-3xl text-muted">
    Browse options offered by confirmed participating guests. A guest's pricing may
    differ by item, autograph type, combo or photography package.
   </p>
   {available.length>0?<div className="mt-8 space-y-7">
    {available.map(g=><GuestExperienceDetails key={g.id} guest={g}/>)}
   </div>:<div className="mt-8 border border-cyan/30 bg-[#10172a] px-6 py-12 text-center sm:px-10 sm:py-16">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Coming soon</p>
    <h3 className="mt-5 font-display text-4xl uppercase leading-tight tracking-wide text-paper sm:text-5xl">
     Guest experiences will be announced here.
    </h3>
    <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
     We're working on the inaugural Midwest Pixel Fest lineup. No autograph or
     photo-op packages are currently published. Check our Guests page for official
     announcements and return here for confirmed pricing and times.
    </p>
    <Link href="/guests" className="mt-7 inline-flex min-h-11 items-center bg-magenta px-6 py-3 font-display text-sm uppercase tracking-widest text-ink hover:bg-gold">
     View official guest announcements
    </Link>
   </div>}
  </section>

  <section className="mt-14" id="how-it-works">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Your fan experience</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">How autographs & photo ops work</h2>
   <div className="mt-6 grid gap-4 sm:grid-cols-2">
    {overview.map(step=><article key={step.num} className="border border-line bg-panel p-6">
     <p className="font-pixel text-sm text-magenta">{step.num} / EXPERIENCE</p>
     <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-paper">{step.title}</h3>
     <p className="mt-3 leading-relaxed text-muted">{step.description}</p>
    </article>)}
   </div>
  </section>

  <section id="questions" className="mt-14 scroll-mt-24">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Good to know</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Autograph & Photo-Op FAQs</h2>
   <div className="mt-6 divide-y divide-line border-y border-line">
    {faqs.map(f=><details key={f.q} className="group py-5">
     <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg uppercase tracking-wide text-paper [&::-webkit-details-marker]:hidden">
      {f.q}<span aria-hidden="true" className="shrink-0 text-2xl text-cyan transition-transform group-open:rotate-45">+</span>
     </summary>
     <p className="mt-3 max-w-4xl leading-relaxed text-muted">{f.a}</p>
    </details>)}
   </div>
  </section>

  <div className="mt-12 border border-cyan/25 bg-ink-2 p-6 sm:p-8">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">More ways to explore the weekend</h2>
   <p className="mt-3 leading-relaxed text-muted">
    Guest sessions, confirmed locations and ticket availability will be published
    as our programming plan is finalized. Webb Hall remains our selected venue,
    with the final reservation agreement still pending.
   </p>
   <div className="mt-6 flex flex-wrap gap-3">
    {[
     {href:"/guests",label:"Special Guests"},
     {href:"/schedule",label:"Event Schedule"},
     {href:"/floor-map",label:"Convention Floor Map"},
     {href:"/tickets",label:"Admission Tickets"},
    ].map(item=><Link key={item.href} href={item.href}
      className="inline-flex min-h-11 items-center border border-cyan/40 px-4 py-3 font-display text-sm uppercase tracking-wider text-cyan hover:border-gold hover:text-gold">
      {item.label}
    </Link>)}
   </div>
  </div>
 </InnerPage>;
}
