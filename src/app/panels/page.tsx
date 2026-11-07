import type { Metadata } from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { createPageMetadata } from "@/lib/seo";
export const metadata:Metadata=createPageMetadata({
 title:"Panels & Programming | Midwest Pixel Fest 2027",
 description:"Community-led panels, cosplay workshops, TCG discussions, gaming talks and more at Midwest Pixel Fest 2027. Apply to host a panel.",
 path:"/panels",
});
const ideas=[
 {title:"Gaming & nostalgia",note:"Retro consoles, speedrunning, streaming, game development and esports."},
 {title:"Cosplay & creativity",note:"Building costumes, wigs, props, makeup and maker techniques."},
 {title:"Trading cards & tabletop",note:"Deckbuilding, roleplaying, game design, collecting and community play."},
 {title:"Anime, comics & fandom",note:"Comics, animation, storytelling, fan conversations and original creative work."},
 {title:"Community & learning",note:"Inclusion, accessible gaming, local creator stories and practical skills."},
];
export default function PanelPage(){return <InnerPage path="/panels" eyebrow="Programming / Join the conversation" title="Panels & Programming" intro="Have an idea the Midwest gaming and pop-culture community would love? We're inviting creators, fans and first-time presenters to help shape our inaugural programming.">
 <div className="border-l-4 border-gold bg-panel px-6 py-5">
  <h2 className="font-display text-2xl uppercase tracking-wide">Panel proposals are open</h2>
  <p className="mt-3 leading-relaxed text-muted">Submit a panel idea for October 16–17, 2027. The final schedule, room assignments, capacity and A/V arrangements depend on the pending venue agreement. Proposals are reviewed individually and do not guarantee selection, free admission, payment or travel coverage.</p>
  <Link href="/panels/submit" className="mt-6 inline-flex min-h-12 items-center bg-magenta px-6 py-3 font-display text-base uppercase tracking-widest text-ink hover:bg-gold">Propose a panel →</Link>
 </div>
 <section className="mt-12">
  <p className="font-pixel text-xs uppercase tracking-widest text-cyan">Programming ideas</p>
  <h2 className="mt-3 font-display text-4xl uppercase tracking-wide">Your fandom, your stage</h2>
  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ideas.map(i=><article key={i.title} className="border border-line bg-panel p-6"><h3 className="font-display text-2xl uppercase text-paper">{i.title}</h3><p className="mt-3 text-muted">{i.note}</p></article>)}</div>
 </section>
 <section className="mt-12 border-l-4 border-gold bg-panel p-6 sm:p-8">
  <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Author guests & storytelling</p>
  <h2 className="mt-3 font-display text-2xl uppercase tracking-wide">Invited Author Guest Program</h2>
  <p className="mt-3 max-w-3xl leading-relaxed text-muted">Authors who bring readings, craft talks, publishing workshops or conversations can be considered for a separate invited guest track, rather than a paid Artist Alley space. Each invitation and appearance arrangement is handled individually.</p>
  <Link href="/guests/authors" className="mt-5 inline-flex min-h-11 items-center font-display text-sm uppercase tracking-wider text-cyan underline">Learn about invited authors →</Link>
 </section>
 <section className="mt-12 border border-cyan/30 bg-ink-2 p-6 sm:p-8">
  <h2 className="font-display text-3xl uppercase tracking-wide">How panel selection works</h2>
  <ol className="mt-5 grid gap-5 sm:grid-cols-3">{[
    ["1","Send an idea","Tell us your topic, format, presenters and needs."],
    ["2","Organizer review","The programming team evaluates fit, safety and available space."],
    ["3","Confirmation","Selected presenters are contacted before any appearance is announced."]
  ].map(a=><li key={a[0]}><p className="font-pixel text-gold">{a[0]}</p><h3 className="mt-2 font-display text-xl uppercase">{a[1]}</h3><p className="mt-2 text-sm text-muted">{a[2]}</p></li>)}</ol>
 </section>
 <div className="mt-10 flex flex-wrap gap-4"><Link href="/panels/submit" className="font-display text-lg uppercase text-cyan underline">Submit a panel →</Link><Link href="/schedule" className="font-display text-lg uppercase text-cyan underline">Schedule updates →</Link></div>
 </InnerPage>}