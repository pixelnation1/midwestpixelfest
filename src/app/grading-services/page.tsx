import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Comic & TCG Card Grading Services | Midwest Pixel Fest 2027",
  description: "Comic book and trading card grading at Midwest Pixel Fest: provider announcements, submission information, signature services and collector FAQs. Providers and services to be announced.",
  path: "/grading-services",
});

const questions = [
  ["Who will be providing grading services?", "Providers have not been announced. Confirmed companies or authorized submission facilitators will be listed here with their exact role, accepted items, official links and event details."],
  ["Will my items be graded at the convention?", "That has not been confirmed. A submission booth may accept items for grading at a separate facility. Same-day grading, encapsulation and pickup are not promised. Check the provider’s published arrangements before bringing items."],
  ["Which trading card games will be accepted?", "Accepted games, languages, sizes, editions and item types will depend on the announced provider. Pokémon, Magic: The Gathering, Yu-Gi-Oh! and One Piece are examples of the TCGs collectors may want to submit; acceptance of any specific game is not yet confirmed."],
  ["Can I have an autograph witnessed for grading?", "Signature witnessing and authentication services have not been announced. If a provider offers a witnessed-signature service, arrange it with that provider before the signing. Do not assume a signature obtained on your own qualifies for a witnessed label."],
  ["How much will grading cost?", "Pricing is to be announced. Grading, handling, shipping, insurance, optional services and guest autograph fees may be separate charges. Review the full total and the provider’s terms before handing over an item."],
  ["Does admission include grading?", "No grading service is included with general admission. Any confirmed paid submission or authentication service will have its own pricing and terms."],
  ["Can I drop items off with the event team?", "Midwest Pixel Fest is not currently accepting grading submissions, payments or items for safekeeping. Only follow the submission instructions published for an announced provider."],
  ["Will grading increase the value of my collection?", "A grade is not a promise of a particular sale price or a higher value. Consider your collecting goals, the item’s condition and the total service cost before choosing to submit."],
] as const;

export default function GradingServicesPage() {
  return <InnerPage path="/grading-services" breadcrumbLabel="Comic & TCG Grading" mood="business"
    eyebrow="Collector services · Midwest Pixel Fest 2027"
    title="Comic & TCG Card Grading"
    intro="For the books you treasure and the cards you collect. Follow grading and submission-service announcements for our inaugural convention."
    actions={[{href:"#providers",label:"Provider announcements",variant:"primary"},{href:"/#updates",label:"Get event updates",variant:"secondary"}]}
  >
    <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-x-7 gap-y-3 border-y border-line py-5 text-sm font-semibold text-muted">
      {[["providers","Providers"],["collectibles","Comics & cards"],["services","How services differ"],["prepare","Prepare your collection"],["questions","FAQs"]].map(([id,label]) => <a key={id} href={"#"+id} className="inline-flex min-h-11 items-center hover:text-cyan">{label} <span aria-hidden="true" className="ml-2 text-cyan">↓</span></a>)}
    </nav>

    <section id="providers" className="scroll-mt-28 border border-line bg-panel p-7 sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">2027 service announcements</p>
      <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Grading providers to be announced.</h2>
      <p className="mt-5 max-w-3xl leading-relaxed text-muted">We’re working toward bringing comic book and TCG grading submission options to Midwest Pixel Fest. Participating providers, accepted collectibles and available services have not yet been confirmed.</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted">Once arrangements are finalized, this page will list each provider’s submission process, pricing, booth location, hours and official contact information.</p>
      <div className="mt-7 grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
        {[["Participating providers","To be announced"],["Fees & submission details","To be announced"],["Booth locations & hours","To be announced"]].map(([label,value]) => <div key={label}><p className="text-muted">{label}</p><p className="mt-2 font-semibold text-cyan">{value}</p></div>)}
      </div>
      <p className="mt-6 border-l-2 border-gold pl-4 text-sm leading-relaxed text-muted">No grading company is currently announced as an event partner. Submissions and payments are not open.</p>
    </section>

    <section id="collectibles" className="mt-16 scroll-mt-28">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Two collecting worlds. One weekend.</p>
      <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Comics & trading card games</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="border border-line border-t-2 border-t-cyan bg-panel p-7 sm:p-9"><p className="text-xs uppercase tracking-[.18em] text-cyan">Comic collectors</p><h3 className="mt-3 font-display text-3xl uppercase text-paper">Comic book grading</h3><p className="mt-4 leading-relaxed text-muted">Explore submission options for favorite issues, key books and signed comics when providers are announced. Eligible formats, age ranges, restoration policies and optional services will be specified by the provider.</p><p className="mt-5 border-t border-line pt-4 text-sm text-muted">Comic submission services: to be announced.</p></article>
        <article className="border border-line border-t-2 border-t-gold bg-panel p-7 sm:p-9"><p className="text-xs uppercase tracking-[.18em] text-gold">Card collectors</p><h3 className="mt-3 font-display text-3xl uppercase text-paper">TCG card grading</h3><p className="mt-4 leading-relaxed text-muted">Watch for trading card submission announcements covering accepted games and card types. Whether you collect Pokémon, Magic: The Gathering, Yu-Gi-Oh!, One Piece or another TCG, check the provider’s eligibility list before preparing a submission.</p><p className="mt-5 border-t border-line pt-4 text-sm text-muted">Accepted games and card submission services: to be announced.</p></article>
      </div>
    </section>

    <section id="services" className="mt-16 scroll-mt-28 border-t border-line pt-12">
      <h2 className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Know what you’re booking.</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted">These service descriptions help you compare future announcements. They do not confirm that a particular service will be available at Pixel Fest.</p>
      <div className="mt-7 overflow-x-auto border border-line"><table className="w-full min-w-[560px] text-left text-sm leading-relaxed"><caption className="sr-only">Differences between grading and submission services</caption><thead className="bg-panel text-paper"><tr><th scope="col" className="px-5 py-4">Service</th><th scope="col" className="px-5 py-4">What it means</th><th scope="col" className="px-5 py-4">2027 availability</th></tr></thead><tbody className="divide-y divide-line">
        {[
          ["Submission drop-off", "Items are accepted at an event for processing elsewhere. Return shipping and turnaround depend on the provider."],
          ["Grading & encapsulation", "A provider evaluates an item under its standards and, where eligible, places it in a protective holder with a label."],
          ["Onsite grading", "Evaluation is performed at the event. This is different from simply accepting submissions at a booth."],
          ["Signature witnessing", "An authorized witness observes a signing according to the provider’s process. Arrange this before the autograph."],
          ["Autograph authentication", "A provider evaluates a signature under its own process. This is distinct from a witnessed signing and from an item’s condition grade."],
        ].map(([name,description]) => <tr key={name}><th scope="row" className="px-5 py-5 font-semibold text-paper">{name}</th><td className="max-w-xl px-5 py-5 text-muted">{description}</td><td className="px-5 py-5 text-gold">Not confirmed</td></tr>)}
      </tbody></table></div>
    </section>

    <section id="prepare" className="mt-16 scroll-mt-28 border-t border-line pt-12">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Plan before you pack</p><h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Prepare your collection.</h2>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2">
        {[
          ["Wait for confirmed instructions", "Verify the provider, accepted items, service level, deadlines and any advance forms. Packaging requirements can differ between comics and cards."],
          ["Protect your items", "Use protective storage suited to your collectibles during travel. Follow the provider’s holder and packing requirements when announced; avoid unnecessary handling."],
          ["Check the complete cost", "Ask about grading tiers, declared values, handling, return shipping, insurance and optional services. A guest’s autograph charge may be separate."],
          ["Keep a submission record", "Before transferring an item, confirm the recipient, item list, receipt or tracking reference, contact details, return arrangements and applicable terms."],
        ].map(([title,text],i) => <li key={title} className="border-t border-line pt-5"><p className="text-xs font-semibold tracking-widest text-cyan">0{i+1}</p><h3 className="mt-3 font-display text-xl uppercase text-paper">{title}</h3><p className="mt-3 leading-relaxed text-muted">{text}</p></li>)}
      </ol>
    </section>

    <section id="questions" className="mt-16 scroll-mt-28 border-t border-line pt-12"><h2 className="font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Collector questions</h2><div className="mt-7 divide-y divide-line border-y border-line">{questions.map(([q,a]) => <details key={q} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-paper [&::-webkit-details-marker]:hidden">{q}<span aria-hidden="true" className="text-2xl text-cyan group-open:rotate-45">+</span></summary><p className="mt-3 max-w-4xl leading-relaxed text-muted">{a}</p></details>)}</div></section>

    <aside className="mt-14 grid gap-6 border border-line bg-panel p-7 sm:p-10 md:grid-cols-2"><div><h2 className="font-display text-2xl uppercase text-paper">Planning a guest signing?</h2><p className="mt-3 leading-relaxed text-muted">Review autograph options and coordinate any required witness before the signing takes place.</p><Link href="/guests/autographs" className="mt-4 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Autographs & photo opportunities →</Link></div><div><h2 className="font-display text-2xl uppercase text-paper">Provide grading services?</h2><p className="mt-3 leading-relaxed text-muted">Grading companies and authorized submission facilitators can contact our team about participating in 2027.</p><Link href="/contact" className="mt-4 inline-flex min-h-11 items-center font-semibold text-cyan underline underline-offset-4">Contact the event team →</Link></div></aside>
  </InnerPage>;
}
