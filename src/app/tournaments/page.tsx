import type {Metadata} from "next";
import Link from "next/link";
import { InnerPage } from "@/components/pages/InnerPage";
import { TournamentDirectory } from "@/components/tournaments/TournamentDirectory";
import { listPublicTournaments } from "@/lib/persistence/tournaments";
import { createPageMetadata } from "@/lib/seo";

export const dynamic="force-dynamic";
export const metadata:Metadata=createPageMetadata({
 title:"Tournaments & Registration | Midwest Pixel Fest 2027",
 description:"Browse confirmed gaming tournaments at Midwest Pixel Fest October 16–17, 2027. View game formats, official rules, capacity, registration, check-in and brackets.",
 path:"/tournaments",
});
export default async function TournamentDirectoryPage(){
 const events=await listPublicTournaments();
 return <InnerPage
  path="/tournaments"
  eyebrow="Gaming / Organized play"
  title="Tournaments & Registration"
  intro="Compete, connect, and make your mark. This is the official home for Midwest Pixel Fest 2027 tournament announcements, player signups, check-in and results."
  crumbs={[{name:"Home",path:"/"},{name:"Gaming",path:"/gaming"},{name:"Tournaments",path:"/tournaments"}]}
 >
  <div className="mb-10 border-l-4 border-gold bg-panel p-6 sm:p-8">
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">Only confirmed games go on the board.</h2>
   <p className="mt-3 leading-relaxed text-muted">
    Our organizers publish game titles, entry policies, time slots and player limits only
    when those details are confirmed. Registration is separate from convention admission,
    and this website does not collect tournament entry fees. Event-specific payment
    arrangements, if any, will be clearly stated before signup.
   </p>
   <p className="mt-3 text-sm leading-relaxed text-muted">
    Webb Hall at Emporia State University is our selected venue, but the signed venue
    agreement and final room layout remain pending. Do not assume a tournament or
    specific gaming area exists until it appears as confirmed below.
   </p>
  </div>
  <TournamentDirectory tournaments={events}/>
  <section className="mt-12 border border-cyan/30 bg-ink-2 p-6 sm:p-8">
   <p className="font-pixel text-[11px] uppercase tracking-wider text-cyan">How organized play works</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">From signup to the final match</h2>
   <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {[
     ["01","Find a confirmed tournament","Review the game rules, format and entry conditions."],
     ["02","Register your player or team","Save your reference number. If full, you may join an available waitlist."],
     ["03","Check in with event staff","Arrive within the event's published check-in window. Organizers confirm attendance."],
     ["04","Play and follow results","Official brackets, match scores and standings appear after organizer publication."],
    ].map(([num,title,description])=><article key={num}>
     <p className="font-pixel text-xs text-gold">{num}</p>
     <h3 className="mt-3 font-display text-xl uppercase text-paper">{title}</h3>
     <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </article>)}
   </div>
  </section>
  <div className="mt-10 flex flex-wrap gap-3">
   <Link href="/gaming" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Gaming areas</Link>
   <Link href="/schedule" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Event schedule</Link>
   <Link href="/code-of-conduct" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Code of Conduct</Link>
  </div>
 </InnerPage>;
}