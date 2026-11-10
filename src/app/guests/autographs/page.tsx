import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { GuestExperienceDetails } from "@/components/guests/GuestExperienceDetails";
import { listPublicGuestExperiences } from "@/lib/persistence/guest-experiences";
import { formatGuestPrice } from "@/lib/guest-experiences/model";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
 title: "Guest Autographs & Photo Opportunities | Midwest Pixel Fest 2027",
 description: "Plan your guest experience: autograph and photo options, confirmed pricing, signing schedules, personal items, payment information and frequently asked questions.",
 path: "/guests/autographs",
});
const sections = [
 ["pricing", "Guest pricing"], ["experiences", "Experience options"],
 ["signing-items", "Items & autographs"], ["planning", "Plan your visit"], ["questions", "FAQs"],
] as const;
const options = [
 { label: "At the guest table", title: "Autographs", text: "Have a guest sign a photo or an eligible item from your collection. Options, personalization and fees depend on the guest.", detail: "Check the item type and number of signatures included before paying." },
 { label: "Your phone or camera", title: "Table photos & selfies", text: "An informal photo with a guest at their table, when offered. Ask the guest’s representative about availability and whether an autograph-and-photo combo is available.", detail: "A table photo is a separate option from a professional photo session." },
 { label: "Scheduled photography", title: "Professional photo ops", text: "A photographer-managed session, if announced for a participating guest. The listing will explain the time, group limits and any print or digital delivery included.", detail: "Professional photography services have not yet been announced for 2027." },
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

export default async function GuestAutographsPage() {
 const published = await listPublicGuestExperiences();
 const available = published.filter(g => g.autograph_available || g.photo_op_available || g.selfie_available);
 return <InnerPage path="/guests/autographs" mood="business"
  eyebrow="Midwest Pixel Fest 2027 · Guest experiences"
  title="Autographs & Photo Opportunities"
  intro="A signed keepsake. A photo together. A moment with someone whose work you love. Find the details you need to plan your guest experience."
  crumbs={[{name:"Home",path:"/"},{name:"Guests",path:"/guests"},{name:"Autographs & Photo Ops",path:"/guests/autographs"}]}
  actions={[{href:"#pricing",label:"View guest pricing",variant:"primary"},{href:"/guests",label:"Explore the guest lineup",variant:"secondary"}]}
 >
  <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-x-7 gap-y-3 border-y border-line py-5">
   {sections.map(([id,label]) => <a key={id} href={"#"+id} className="inline-flex min-h-11 items-center text-sm font-semibold text-muted transition-colors hover:text-cyan">{label} <span aria-hidden="true" className="ml-2 text-cyan">↓</span></a>)}
  </nav>
  <aside className="mb-14 border-l-2 border-gold bg-panel px-6 py-5">
   <h2 className="font-display text-xl uppercase tracking-wide text-paper">Admission and guest experiences are separate.</h2>
   <p className="mt-2 max-w-4xl leading-relaxed text-muted">Convention admission does not include a paid autograph or photo opportunity unless a specific listing says it does. Review the guest’s options and purchase terms before making plans.</p>
  </aside>

  <section id="pricing" className="scroll-mt-28">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Pricing & availability</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Find your guest. Plan your experience.</h2>
   <p className="mt-4 max-w-3xl leading-relaxed text-muted">Confirmed guest options and prices appear here as they are announced. Review the full guest details for item restrictions, packages, payment methods and session times.</p>
   {available.length > 0 ? <>
    <div className="mt-7 overflow-x-auto border border-line">
     <table className="w-full min-w-[600px] text-left text-sm">
      <caption className="sr-only">Confirmed guest autograph and photo pricing</caption>
      <thead className="bg-panel text-paper"><tr>{["Guest", "Autograph", "Table photo / selfie", "Professional photo"].map(label => <th scope="col" key={label} className="px-5 py-4 font-semibold">{label}</th>)}</tr></thead>
      <tbody className="divide-y divide-line">{available.map(g => <tr key={g.id}>
       <th scope="row" className="px-5 py-5 font-semibold"><a href={"#guest-"+g.slug} className="text-cyan hover:text-gold">{g.display_name}</a></th>
       <td className="px-5 py-5 text-muted">{g.autograph_available ? formatGuestPrice(g.autograph_price_cents) : "Not offered"}</td>
       <td className="px-5 py-5 text-muted">{g.selfie_available ? formatGuestPrice(g.selfie_price_cents) : "Not offered"}</td>
       <td className="px-5 py-5 text-muted">{g.photo_op_available ? formatGuestPrice(g.photo_op_price_cents) : "Not offered"}</td>
      </tr>)}</tbody>
     </table>
    </div>
    <p className="mt-3 text-sm text-muted">“Not offered” means the option is not currently published. Unannounced prices are not a free experience.</p>
    <div className="mt-8 space-y-7">{available.map(g => <GuestExperienceDetails key={g.id} guest={g} />)}</div>
   </> : <div className="mt-8 grid gap-6 border border-line bg-panel p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-center">
    <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan">2027 announcements ahead</p>
     <h3 className="mt-3 font-display text-3xl uppercase text-paper">Guest pricing is coming soon.</h3>
     <p className="mt-3 max-w-2xl leading-relaxed text-muted">Autograph and photo packages are not on sale yet. As participating guests are announced, this page will show their confirmed options, prices and booking instructions.</p></div>
    <Link href="/guests" className="inline-flex min-h-12 items-center justify-center border border-cyan px-5 py-3 font-display uppercase tracking-wide text-cyan hover:bg-cyan/10">Guest announcements →</Link>
   </div>}
  </section>

  <section id="experiences" className="mt-16 scroll-mt-28 border-t border-line pt-12">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Know the difference</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Three ways to make a memory.</h2>
   <div className="mt-8 grid gap-5 lg:grid-cols-3">{options.map((o,i) => <article key={o.title} className="flex flex-col border border-line bg-panel p-6 sm:p-7">
    <span className="font-display text-4xl text-cyan/60">0{i+1}</span>
    <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-gold">{o.label}</p>
    <h3 className="mt-2 font-display text-2xl uppercase text-paper">{o.title}</h3>
    <p className="mt-4 flex-1 leading-relaxed text-muted">{o.text}</p>
    <p className="mt-6 border-t border-line pt-4 text-sm leading-relaxed text-muted">{o.detail}</p>
   </article>)}</div>
  </section>

  <section id="signing-items" className="mt-16 grid scroll-mt-28 gap-10 border-t border-line pt-12 lg:grid-cols-[1fr_1.4fr]">
   <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Your collection, signed</p><h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">What can I bring?</h2><p className="mt-4 leading-relaxed text-muted">A little preparation helps protect your keepsake and keeps the signing line moving.</p></div>
   <div className="space-y-6">
    <article><h3 className="font-display text-xl uppercase text-paper">Personal items & guest photos</h3><p className="mt-2 leading-relaxed text-muted">Check whether your guest accepts items such as books, games, posters or collectibles. Photos or merchandise at a guest’s table are included only when their listing explicitly says so. Guests may decline particular items.</p></article>
    <article><h3 className="font-display text-xl uppercase text-paper">Premium items & personalization</h3><p className="mt-2 leading-relaxed text-muted">Large items, special inscriptions, character names or multiple signatures may have different fees. Ask about your exact request before purchasing. One autograph purchase does not automatically cover several items or several guests.</p></article>
    <article><h3 className="font-display text-xl uppercase text-paper">Prepare before joining the line</h3><p className="mt-2 leading-relaxed text-muted">Have your item ready and your preferred name or inscription written clearly. Keep packaging secure, avoid blocking aisles, and review the <Link href="/weapons-policy" className="text-cyan underline underline-offset-4">weapons and props policy</Link> before bringing a costume prop.</p></article>
   </div>
  </section>

  <section id="planning" className="mt-16 scroll-mt-28 border-t border-line pt-12">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Before you arrive</p><h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Make the most of your visit.</h2>
   <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
    {[
     ["Payment & advance booking", "Use the purchase link or onsite instructions in the official guest listing. Accepted payment methods will vary; do not assume every table takes cards or that an ATM will be available. Keep your booking confirmation handy."],
     ["Signing times & locations", "Guest table hours may pause for panels, breaks or scheduled sessions. Check the published schedule before joining a line. Signing locations and photo areas will be shared when the event floor plan is finalized."],
     ["Photography & personal space", "Ask before taking a guest’s photo, recording video or photographing a signing. A guest’s presence at a table is not permission to film them. Follow their representative’s guidance and ask before any physical contact."],
     ["Lines & accessibility", "Follow staff directions and leave accessible routes open. If you need help with a queue or session, speak with event staff. Visit Attendee Services for accessibility information as arrangements are announced."],
     ["Panels & guest sessions", "A panel is a separate experience from an autograph or photo session. Please use the designated signing and photo opportunities for those requests. Panel photography and recording rules will be communicated for each session."],
     ["Changes & cancellations", "Guest availability and schedules can change. Review the seller’s refund, missed-session and cancellation terms before buying. Admission tickets and paid guest experiences are separate purchases with their own terms."],
    ].map(([title,text]) => <article key={title} className="border-t border-line pt-5"><h3 className="font-display text-xl uppercase tracking-wide text-paper">{title}</h3><p className="mt-3 leading-relaxed text-muted">{text}</p></article>)}
   </div>
   <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-cyan"><Link href="/schedule" className="underline underline-offset-4">Event schedule</Link><Link href="/floor-map" className="underline underline-offset-4">Floor map</Link><Link href="/attendee-services" className="underline underline-offset-4">Attendee services</Link></div>
  </section>

  <section id="questions" className="mt-16 scroll-mt-28 border-t border-line pt-12">
   <h2 className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Frequently asked questions</h2>
   <div className="mt-6 divide-y divide-line border-y border-line">{faqs.map(f => <details key={f.q} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-paper [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden="true" className="shrink-0 text-2xl text-cyan group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl leading-relaxed text-muted">{f.a}</p></details>)}</div>
  </section>
  <aside className="mt-14 flex flex-col gap-6 border border-line bg-panel p-7 sm:p-10 md:flex-row md:items-center md:justify-between"><div><h2 className="font-display text-2xl uppercase text-paper">Have a question before you book?</h2><p className="mt-2 text-muted">We can help you find the right guest or event information.</p></div><Link href="/contact" className="inline-flex min-h-12 items-center justify-center bg-cyan px-6 py-3 font-display uppercase tracking-wider text-ink hover:bg-gold">Contact the event team</Link></aside>
 </InnerPage>;
}
