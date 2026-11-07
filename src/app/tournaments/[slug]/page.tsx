import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {InnerPage} from "@/components/pages/InnerPage";
import {TournamentSignupForm} from "@/components/tournaments/TournamentSignupForm";
import {getPublicTournamentBySlug} from "@/lib/persistence/tournaments";
import {
 TOURNAMENT_STATUS_LABELS,tournamentCategoryLabel,tournamentFormatLabel,
 formatTournamentFee,formatTournamentTime,tournamentRegistrationAvailable,
} from "@/lib/tournaments/model";
import {createPageMetadata} from "@/lib/seo";

export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const t=await getPublicTournamentBySlug(slug);
 if(!t)return {robots:{index:false,follow:true}};
 return createPageMetadata({
  title:t.title+" | Midwest Pixel Fest Tournaments",
  description:t.description||"Official "+t.game_title+" tournament rules, player registration, bracket and results for Midwest Pixel Fest 2027.",
  path:"/tournaments/"+slug,
 });
}
const sideLabels:Record<string,string>={
 winners:"Winners bracket",losers:"Losers bracket",
 grand_final:"Grand final",round_robin:"Round robin",
};
export default async function TournamentPage({params}:Props){
 const {slug}=await params;
 const t=await getPublicTournamentBySlug(slug);
 if(!t)notFound();
 const open=tournamentRegistrationAvailable(t,new Date());
 const full=t.registeredCount>=t.capacity;
 const groups=new Map<string,typeof t.matches>();
 for(const m of t.matches){
  const key=m.side+"-"+m.round;
  groups.set(key,[...(groups.get(key)||[]),m]);
 }
 return <InnerPage
  path={"/tournaments/"+slug}
  eyebrow="Gaming / Confirmed tournament"
  title={t.title}
  intro={t.description||"Official tournament information for Midwest Pixel Fest 2027."}
  crumbs={[{name:"Home",path:"/"},{name:"Tournaments",path:"/tournaments"},{name:t.title,path:"/tournaments/"+slug}]}
 >
  <div className="mb-8 border-l-4 border-cyan bg-panel p-6">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">{TOURNAMENT_STATUS_LABELS[t.status]}</p>
   <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{t.game_title}</h2>
   <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[
     ["Date",t.event_date==="2027-10-16"?"Saturday, October 16, 2027":"Sunday, October 17, 2027"],
     ["Start time",formatTournamentTime(t.start_time)],
     ["Format",tournamentFormatLabel(t.format)],
     ["Game type",tournamentCategoryLabel(t.category)],
     ["Entry",t.entry_type==="team"?"Team of "+t.team_size:"Individual"],
     ["Capacity",t.registeredCount+" / "+t.capacity+" "+(t.entry_type==="team"?"teams":"players")],
     ["Registration",open?(full?(t.waitlist_enabled?"Waitlist available":"Full"):"Open"):"Closed"],
     ["Entry fee",formatTournamentFee(t.entry_fee_cents)],
     ["Location",t.location_notes||"Location to be confirmed"],
    ].map(([name,value])=><div key={name}>
     <p className="font-pixel text-[10px] uppercase tracking-widest text-cyan">{name}</p>
     <p className="mt-2 leading-relaxed text-paper">{value}</p>
    </div>)}
   </div>
   {t.platform&&<p className="mt-5 text-sm text-muted">Platform: {t.platform}</p>}
  </div>
  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)]">
   <section className="min-w-0 border border-line bg-panel p-6 sm:p-8">
    <h2 className="font-display text-3xl uppercase tracking-wide text-paper">Official rules & eligibility</h2>
    <p className="mt-4 whitespace-pre-wrap break-words leading-relaxed text-muted">{t.rules||"Rules will be published by the organizer."}</p>
    <h3 className="mt-6 font-display text-xl uppercase text-paper">Age eligibility</h3>
    <p className="mt-3 text-sm text-muted">
     {t.age_policy==="age_18_plus"?"Adults 18 and older":t.age_policy==="age_13_plus"?"Ages 13 and older":"All ages with guardian permission for minors"}
    </p>
    {t.prize_notes&&<><h3 className="mt-6 font-display text-xl uppercase text-paper">Prize information</h3>
      <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-muted">{t.prize_notes}</p></>}
    {t.entry_fee_cents>0&&<><h3 className="mt-6 font-display text-xl uppercase text-paper">Entry payment instructions</h3>
      <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-muted">{t.fee_notes}</p>
      <p className="mt-2 text-sm text-gold">No payment is collected through this registration form.</p></>}
   </section>
   <section id="register" className="min-w-0 border border-cyan/30 bg-[#11182b] p-6 sm:p-8">
    <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Join the competition</p>
    <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Player registration</h2>
    {open&&(!full||t.waitlist_enabled)?
      <div className="mt-6"><TournamentSignupForm tournament={t}/></div>:
      <div className="mt-6 border border-line bg-panel p-6">
       <p className="text-lg leading-relaxed text-paper">
        {t.status==="cancelled"?"This tournament has been cancelled.":
         full?"Registration is full. No waitlist is currently open.":
         "Registration is not currently open."}
       </p>
       <p className="mt-3 text-sm leading-relaxed text-muted">
        Check the tournament directory for other confirmed events. Existing entrants
        should contact the organizer about their registrations.
       </p>
       <Link href="/tournaments" className="mt-5 inline-flex min-h-11 items-center border border-cyan px-4 py-2 font-display text-sm uppercase text-cyan">Browse tournaments</Link>
      </div>}
   </section>
  </div>
  <section className="mt-12" id="bracket">
   <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Official competition board</p>
   <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-paper">Brackets & results</h2>
   {t.bracket_published&&t.matches.length>0?
    <div className="mt-6 space-y-6">
     {[...groups.entries()].map(([key,matches])=>{
      const first=matches[0];
      return <div key={key} className="border border-line bg-panel p-5 sm:p-7">
       <h3 className="font-display text-2xl uppercase text-paper">{sideLabels[first.side]||"Matches"} · Round {first.round}</h3>
       <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map(m=><article key={m.id} className="border border-line bg-ink p-4">
         <p className="font-pixel text-[10px] uppercase tracking-wider text-cyan">Match {m.number} · {m.status}</p>
         <div className="mt-4 space-y-3 text-sm">
          <p className={"flex justify-between gap-2 "+(m.winner===m.playerA&&m.winner?"text-gold":"text-paper")}>
           <span>{m.playerA||"TBD"}</span><span>{m.scoreA??"—"}</span>
          </p>
          <p className={"flex justify-between gap-2 "+(m.winner===m.playerB&&m.winner?"text-gold":"text-paper")}>
           <span>{m.playerB||"TBD"}</span><span>{m.scoreB??"—"}</span>
          </p>
         </div>
         {m.winner&&<p className="mt-4 border-t border-line pt-3 text-xs text-gold">Winner: {m.winner}</p>}
         {m.note&&<p className="mt-2 text-xs text-muted">{m.note}</p>}
        </article>)}
       </div>
      </div>;
     })}
    </div>:
    <p className="mt-6 border border-line bg-panel p-7 leading-relaxed text-muted">
     Tournament brackets, match times and results will appear after player check-in and organizer review. No bracket has been published yet.
    </p>}
  </section>
  {t.bracket_published&&t.standings.length>0&&<section className="mt-12">
   <h2 className="font-display text-3xl uppercase text-paper">Standings</h2>
   <p className="mt-3 text-sm text-muted">Ranked by match wins, then losses. Round-robin points: 3 per win. Results are updated when the organizer records them.</p>
   <div className="mt-5 overflow-x-auto border border-line bg-panel">
    <table className="w-full min-w-[420px] text-left text-sm">
     <thead className="border-b border-line text-gold"><tr>
      <th className="p-4">Rank</th><th className="p-4">Player / team</th><th className="p-4">Wins</th><th className="p-4">Losses</th><th className="p-4">Points</th>
     </tr></thead>
     <tbody>{t.standings.map((s,i)=><tr key={s.playerName} className="border-b border-line/70">
      <td className="p-4">{i+1}</td><td className="p-4">{s.playerName}</td>
      <td className="p-4">{s.wins}</td><td className="p-4">{s.losses}</td><td className="p-4">{s.points}</td>
     </tr>)}</tbody>
    </table>
   </div>
  </section>}
  <p className="mt-10 text-sm leading-relaxed text-muted">
   Brackets may be adjusted for no-shows, disqualifications or operational needs.
   Follow official staff and judge decisions. Public player names are shown only
   when permission was given; other entrants use a reference alias.
  </p>
  <div className="mt-8 flex flex-wrap gap-3">
   <Link href="/tournaments" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">All tournaments</Link>
   <Link href="/gaming" className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">Other gaming activities</Link>
  </div>
 </InnerPage>;
}
