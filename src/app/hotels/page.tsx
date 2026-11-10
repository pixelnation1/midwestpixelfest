import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
 title: "Hotels & Places to Stay | Midwest Pixel Fest 2027",
 description: "Plan your overnight stay in Emporia, Kansas for Midwest Pixel Fest, October 16–17, 2027. Browse local hotels and watch for official room-rate announcements.",
 path: "/hotels",
});
const hotels = [
 {name:"Hampton Inn Emporia", address:"2900 Eaglecrest Dr., Emporia, KS 66801", url:"https://www.hilton.com/en/hotels/empwehx-hampton-emporia/", label:"Hotel website"},
 {name:"Holiday Inn Express & Suites Emporia Northwest", address:"3007 W. 18th Ave., Emporia, KS 66801", url:"https://www.ihg.com/holidayinnexpress/hotels/us/en/emporia/empex/hoteldetail", label:"Hotel website"},
 {name:"Best Western Emporia Inn", address:"2836 W. 18th Ave., Emporia, KS 66801", url:"https://visitemporia.com/place/comfort-inn/", label:"Visit Emporia listing"},
];
const faqs = [
 ["Is there an official PixelFest hotel rate?", "Not yet. No hotel partnership, room block or event discount has been confirmed. Any future event offer will be published here with its authorized booking link, dates, deadline and terms."],
 ["Which nights should I consider?", "The convention is planned for Saturday, October 16 and Sunday, October 17, 2027. Friday and Saturday nights may suit a full weekend visit; Sunday night may suit travelers leaving Monday. Exhibitors should check their load-in instructions when released."],
 ["Can I book a room now?", "You can check directly with a hotel for availability and public rates. The selected venue reservation remains pending a signed agreement and deposit. Review cancellation terms before booking. A future PixelFest rate cannot be promised or automatically applied to an existing booking."],
 ["Does a hotel reservation include convention admission?", "No. Lodging and convention admission are separate reservations unless a future offer explicitly states otherwise."],
 ["Will there be a hotel shuttle?", "No hotel shuttle has been announced. Plan your transportation separately and check our travel page for confirmed event parking and arrival details."],
 ["How do I request an accessible room or confirm pet policies?", "Contact the hotel directly to discuss your specific needs and confirm room features, availability, fees and policies before reserving. Contact PixelFest separately for event accessibility questions."],
 ["Who handles hotel changes or refunds?", "The hotel or booking provider named on your confirmation handles room reservations, payment, changes and cancellations under the terms you selected. Midwest Pixel Fest does not currently take hotel bookings or payments."],
] as const;

export default function HotelsPage() {
 return <InnerPage path="/hotels" breadcrumbLabel="Hotels & Lodging" mood="business"
  eyebrow="Stay for the weekend · Emporia, Kansas"
  title="Hotels & Places to Stay"
  intro="Make a weekend of Midwest Pixel Fest. Find lodging in Emporia for October 16–17, 2027, and check back for event-rate announcements."
  actions={[{href:"#event-rates",label:"Event hotel updates",variant:"primary"},{href:"#local-hotels",label:"Explore local hotels",variant:"secondary"}]}
 >
  <section id="event-rates" className="scroll-mt-28 border border-line bg-panel p-7 sm:p-10">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Hotel partnerships & group rates</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Event hotel rates to be announced.</h2>
   <p className="mt-5 max-w-3xl leading-relaxed text-muted">No official Midwest Pixel Fest hotel partner, room block or discounted booking code has been confirmed. When an event offer is available, this page will provide the approved booking link and full details.</p>
   <div className="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-3">{[["Participating hotels","To be announced"],["Event rates & booking links","To be announced"],["Booking deadlines","To be announced"]].map(([label,value])=><div key={label}><p className="text-sm text-muted">{label}</p><p className="mt-2 font-semibold text-cyan">{value}</p></div>)}</div>
   <Link href="/#updates" className="mt-7 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Join the event update list →</Link>
  </section>

  <section id="local-hotels" className="mt-16 scroll-mt-28">
   <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Explore your options</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Stay in Emporia.</h2>
   <p className="mt-4 max-w-3xl leading-relaxed text-muted">These local lodging options are provided for trip planning. They are not confirmed event partners, and the links below do not provide a PixelFest rate. Check availability, total pricing and hotel policies directly.</p>
   <div className="mt-8 grid gap-5 lg:grid-cols-3">{hotels.map(h=><article key={h.name} className="flex flex-col border border-line bg-panel p-7"><p className="text-xs font-semibold uppercase tracking-widest text-cyan">Local lodging</p><h3 className="mt-4 font-display text-2xl uppercase leading-tight text-paper">{h.name}</h3><p className="mt-4 flex-1 leading-relaxed text-muted">{h.address}</p><a href={h.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">{h.label} ↗<span className="sr-only"> (opens in a new tab)</span></a></article>)}</div>
   <a href="https://visitemporia.com/stay/" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center border border-cyan px-5 py-3 font-display uppercase tracking-wide text-cyan hover:bg-cyan/10">Browse more lodging with Visit Emporia ↗<span className="sr-only"> (opens in a new tab)</span></a>
  </section>

  <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-2">
   <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Before you reserve</p><h2 className="mt-3 font-display text-3xl uppercase text-paper">Plan a comfortable weekend.</h2><ul className="mt-6 list-disc space-y-4 pl-5 leading-relaxed text-muted"><li>Confirm that your reservation is for <strong className="text-paper">Emporia, Kansas</strong>.</li><li>Check the total including taxes, parking, pet charges and any other applicable fees.</li><li>Read cancellation, deposit, minimum-stay and check-in requirements before paying.</li><li>Ask the hotel about accessible room features, breakfast and other amenities that matter to your stay.</li><li>Do not assume a hotel is within walking distance of the venue or that transportation is included.</li></ul></div>
   <aside className="border-l-2 border-gold bg-panel p-7"><h2 className="font-display text-2xl uppercase text-paper">Your destination: Webb Hall at ESU</h2><p className="mt-4 leading-relaxed text-muted">Our selected venue is Webb Hall inside the Emporia State University Memorial Union, 1331 Market St., Emporia, KS 66801. The reservation remains pending a signed agreement and deposit.</p><p className="mt-4 leading-relaxed text-muted">Check the travel guide for venue updates and confirmed parking and arrival information.</p><Link href="/travel" className="mt-5 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Travel & parking information →</Link></aside>
  </section>

  <section className="mt-16 border-t border-line pt-12"><h2 className="font-display text-3xl uppercase text-paper sm:text-4xl">Hotel questions</h2><div className="mt-7 divide-y divide-line border-y border-line">{faqs.map(([q,a])=><details key={q} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-paper [&::-webkit-details-marker]:hidden">{q}<span aria-hidden="true" className="text-2xl text-cyan group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl leading-relaxed text-muted">{a}</p></details>)}</div></section>
   <div className="mt-14 flex flex-col gap-6 border border-line bg-panel p-7 sm:p-10 md:flex-row md:items-center md:justify-between"><div><h2 className="font-display text-2xl uppercase text-paper">More than a convention weekend.</h2><p className="mt-3 text-muted">Find local dining, shopping and things to do while you’re in town.</p></div><Link href="/visit-emporia" className="inline-flex min-h-12 items-center justify-center bg-cyan px-6 py-3 font-display uppercase tracking-wide text-ink hover:bg-gold">Explore Emporia</Link></div>
 </InnerPage>;
}
