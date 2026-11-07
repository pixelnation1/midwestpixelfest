import Link from "next/link";
import {notFound} from "next/navigation";
import {ActionForm} from "@/components/admin/ActionForm";
import {
 updateTournamentAction,updateTournamentEntryAction,generateTournamentBracketAction,
 completeTournamentMatchAction,createManualTournamentMatchAction,
} from "@/app/actions/tournament-admin";
import {createSupabaseServerClient} from "@/lib/supabase/server";
import {
 TOURNAMENT_CATEGORIES,TOURNAMENT_FORMATS,TOURNAMENT_AGE_POLICIES,
 TOURNAMENT_STATUSES,TOURNAMENT_STATUS_LABELS,TOURNAMENT_ENTRY_STATUS_LABELS,
 TOURNAMENT_ENTRY_TYPES,formatTournamentTime,
 type TournamentRecord,type TournamentEntry,type TournamentRegistrationStatus,
} from "@/lib/tournaments/model";

export const dynamic="force-dynamic";
type Match={
 id:string;tournament_id:string;bracket_side:string;round_number:number;match_number:number;
 player_a:string|null;player_b:string|null;winner_id:string|null;
 score_a:number|null;score_b:number|null;status:string;
};
const field="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-base text-paper focus:border-cyan focus:outline-none";
const check="mt-1 h-5 w-5 shrink-0 accent-cyan";
const section="border border-line bg-panel p-5 sm:p-7";
const label="block text-sm text-paper";
const statuses=["registered","waitlisted","checked_in","withdrawn","disqualified"] as const;
const sides=[
 {value:"winners",label:"Winners bracket"},
 {value:"losers",label:"Losers bracket"},
 {value:"grand_final",label:"Grand final"},
];

export default async function AdminTournamentDetail({params}:{
 params:Promise<{id:string}>
}){
 const {id}=await params;
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id))notFound();
 const db=await createSupabaseServerClient();
 if(!db)return <p className="text-magenta">Sign in again.</p>;
 const [result,entriesResult,matchesResult]=await Promise.all([
  db.from("tournament_events").select("*").eq("id",id).maybeSingle(),
  db.from("tournament_registrations").select("*").eq("tournament_id",id)
   .order("created_at",{ascending:true}).limit(400),
  db.from("tournament_matches").select("*").eq("tournament_id",id)
   .order("round_number",{ascending:true}).order("match_number",{ascending:true}).limit(1000),
 ]);
 if(result.error||entriesResult.error||matchesResult.error){
  return <p role="alert" className="text-magenta">Tournament details are temporarily unavailable.</p>;
 }
 if(!result.data)notFound();
 const t=result.data as TournamentRecord;
 const entries=(entriesResult.data??[]) as TournamentEntry[];
 const matches=(matchesResult.data??[]) as Match[];
 const checked=entries.filter(e=>e.status==="checked_in");
 const registered=entries.filter(e=>e.status==="registered"||e.status==="checked_in");
 const waitlisted=entries.filter(e=>e.status==="waitlisted");
 const byId=new Map(entries.map(e=>[e.id,e]));
 const groups=new Map<string,Match[]>();
 for(const m of matches){
  const key=m.bracket_side+"-"+m.round_number;
  groups.set(key,[...(groups.get(key)??[]),m]);
 }

 return <div className="space-y-9">
  <nav aria-label="Breadcrumb" className="font-pixel text-[11px] uppercase tracking-wider text-muted">
   <Link href="/admin/tournaments" className="text-cyan hover:text-gold">Tournaments</Link>
   <span className="mx-3 text-magenta">/</span>{t.title}
  </nav>
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">
    {TOURNAMENT_STATUS_LABELS[t.status]} · {t.is_published?"Public":"Private draft"}
   </p>
   <h1 className="mt-4 font-display text-4xl uppercase tracking-wide text-paper">{t.title}</h1>
   <p className="mt-3 leading-relaxed text-muted">
    Manage the game rules, registrations, attendance and match results for {t.game_title}.
    Organizer actions do not email entrants automatically.
   </p>
   <div className="mt-5 flex flex-wrap gap-3">
    <Link href={"/tournaments/"+t.slug} target="_blank" rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">
      Public tournament page ↗
    </Link>
    <Link href="/admin/tournaments" className="inline-flex min-h-11 items-center border border-paper/30 px-5 py-3 font-display text-sm uppercase text-paper">All tournaments</Link>
   </div>
  </div>
  <div className="grid gap-3 sm:grid-cols-4">
   {[
    ["Registered",registered.length],
    ["Checked in",checked.length],
    ["Waitlisted",waitlisted.length],
    ["Matches",matches.length],
   ].map(([name,value])=><div key={name} className="border border-line bg-panel p-5">
    <p className="font-pixel text-[10px] uppercase tracking-widest text-muted">{name}</p>
    <p className="mt-3 font-display text-4xl text-cyan">{value}</p>
   </div>)}
  </div>

  <section className={section}>
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">1. Event rules, format & registration</h2>
   <p className="mt-3 text-sm leading-relaxed text-muted">
    Publish only games and rules that have confirmed scheduling, space and staff support.
    Entry fees are informational; no online tournament payment is collected.
    Round robin is limited to 16 entrants, and double elimination uses manual
    winners/losers/grand-final match management.
   </p>
   <ActionForm action={updateTournamentAction} className="mt-6 space-y-5">
    <input type="hidden" name="tournamentId" value={t.id}/>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className={label}>Public tournament title
      <input name="title" defaultValue={t.title} required maxLength={160} className={field}/>
     </label>
     <label className={label}>Game title
      <input name="gameTitle" defaultValue={t.game_title} required maxLength={160} className={field}/>
     </label>
     <label className={label}>Game category
      <select name="category" defaultValue={t.category} className={field}>
       {TOURNAMENT_CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
     </label>
     <label className={label}>Platform / game edition
      <input name="platform" defaultValue={t.platform} maxLength={120}
       placeholder="Switch, PS5, paper TCG..." className={field}/>
     </label>
     <label className={label}>Tournament format
      <select name="format" defaultValue={t.format} className={field}>
       {TOURNAMENT_FORMATS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
     </label>
     <label className={label}>Registration type
      <select name="entryType" defaultValue={t.entry_type} className={field}>
       {TOURNAMENT_ENTRY_TYPES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
     </label>
     <label className={label}>People per team (individual = 1)
      <input type="number" name="teamSize" min={1} max={8} step={1} defaultValue={t.team_size}
       required className={field}/>
     </label>
     <label className={label}>Maximum registrations (players or teams)
      <input type="number" name="capacity" min={2} max={256} step={1} defaultValue={t.capacity}
       required className={field}/>
     </label>
     <label className={label}>Event date
      <select name="eventDate" defaultValue={t.event_date} className={field}>
       <option value="2027-10-16">Saturday, October 16, 2027</option>
       <option value="2027-10-17">Sunday, October 17, 2027</option>
      </select>
     </label>
     <label className={label}>Start time (Central)
      <input name="startTime" type="time" required defaultValue={t.start_time.slice(0,5)} className={field}/>
     </label>
     <label className={label}>Age policy
      <select name="agePolicy" defaultValue={t.age_policy} className={field}>
       {TOURNAMENT_AGE_POLICIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
     </label>
     <label className={label}>Event status
      <select name="status" defaultValue={t.status} className={field}>
       {TOURNAMENT_STATUSES.map(s=><option key={s} value={s}>{TOURNAMENT_STATUS_LABELS[s]}</option>)}
      </select>
     </label>
    </div>
    <label className={label}>Description / what to expect
     <textarea name="description" defaultValue={t.description} maxLength={3500} rows={4} className={field}/>
    </label>
    <label className={label}>Official game rules *
     <textarea name="rules" defaultValue={t.rules} rows={6} maxLength={9000} className={field}
      placeholder="Game settings, allowed equipment, match format, check-in requirements, disputes, tie breakers..."/>
    </label>
    <label className={label}>Prizes (only confirmed awards)
     <textarea name="prizeNotes" defaultValue={t.prize_notes} rows={2} maxLength={2000} className={field}/>
    </label>
    <label className={label}>Location / check-in instructions
     <input name="locationNotes" defaultValue={t.location_notes} maxLength={240}
      className={field} placeholder="Only enter approved room details"/>
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
     <label className={label}>Entry fee in cents (0 = free)
      <input type="number" name="entryFeeCents" min={0} max={50000} step={1} required
       defaultValue={t.entry_fee_cents} className={field}/>
     </label>
     <label className={label}>Entry fee instructions
      <textarea name="feeNotes" defaultValue={t.fee_notes} maxLength={1000} rows={2}
       className={field} placeholder="Required if there is a fee; no online collection"/>
     </label>
    </div>
    <div className="space-y-4 border-t border-line pt-6">
     <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="waitlistEnabled" value="yes" defaultChecked={t.waitlist_enabled} className={check}/>
      Allow automatic waitlist enrollment once all active slots are filled
     </label>
     <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="publish" value="yes" defaultChecked={t.is_published} className={check}/>
      Publish this tournament in the public directory
     </label>
     <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="publishApproved" value="yes" className={check}/>
      I confirm that this game, schedule, capacity, venue arrangements and rules are approved for a public announcement
     </label>
     <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="registrationOpen" value="yes" defaultChecked={t.registration_open} className={check}/>
      Accept registrations / waitlist signups (only for a confirmed published tournament)
     </label>
     <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="bracketPublished" value="yes" defaultChecked={t.bracket_published} className={check}/>
      Publish brackets and results to the tournament page
     </label>
     <label className="flex items-start gap-3 text-sm leading-relaxed text-paper">
      <input type="checkbox" name="bracketApproved" value="yes" className={check}/>
      I have reviewed the bracket participants, scores and names for public display (required when publishing a bracket)
     </label>
     <button type="submit" className="min-h-11 bg-magenta px-6 py-3 font-display text-sm uppercase tracking-wider text-ink">
      Save tournament settings
     </button>
    </div>
   </ActionForm>
  </section>

  <section className={section}>
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">2. Registered players & check-in</h2>
   <p className="mt-3 text-sm leading-relaxed text-muted">
    Check in registered players or teams when they arrive.
    Waitlisted entries can be promoted automatically when a slot opens,
    but organizers must contact promoted entrants themselves.
    Player contact details and team rosters are never public.
   </p>
   <div className="mt-6 space-y-3">
    {entries.map(e=><article key={e.id} className="border border-line bg-ink-2 p-5">
     <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
       <p className="font-pixel text-[10px] text-cyan">{e.reference}</p>
       <h3 className="mt-2 font-display text-2xl uppercase text-paper">{e.player_name}</h3>
       <p className="mt-2 text-sm text-paper">{e.contact_name}</p>
       <p className="mt-1 break-all text-sm text-muted">{e.contact_email}</p>
       {e.roster_notes&&<p className="mt-2 whitespace-pre-wrap text-sm text-muted">Roster: {e.roster_notes}</p>}
       <p className="mt-2 text-xs text-muted">Age band: {e.age_band} · Public name: {e.public_name_consent?"Approved":"Alias only"}</p>
      </div>
      <span className="border border-gold/40 px-3 py-2 font-display text-xs uppercase text-gold">
       {TOURNAMENT_ENTRY_STATUS_LABELS[e.status]}
      </span>
     </div>
     <ActionForm action={updateTournamentEntryAction} className="mt-5 border-t border-line pt-4">
      <input type="hidden" name="entryId" value={e.id}/>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
       <label className="block min-w-0 flex-1 text-sm text-paper">Update registration status
        <select name="status" defaultValue={e.status} className={field}>
         {statuses.map(s=><option key={s} value={s}>{TOURNAMENT_ENTRY_STATUS_LABELS[s]}</option>)}
        </select>
       </label>
       <button type="submit" className="min-h-11 border border-cyan px-5 py-2 font-display text-sm uppercase text-cyan">
        Save / Check in
       </button>
      </div>
     </ActionForm>
    </article>)}
    {entries.length===0&&<p className="border border-line bg-ink-2 p-6 text-muted">No registrations yet. Open registration after the tournament details are confirmed.</p>}
   </div>
  </section>

  <section className={section}>
   <h2 className="font-display text-2xl uppercase tracking-wide text-paper">3. Bracket & match management</h2>
   <p className="mt-3 leading-relaxed text-muted">
    Generate a bracket from checked-in players when registration is complete.
    Automatic generation closes new signups and can only run once.
    Single elimination advances winners automatically; round robin produces
    full pairings. Double elimination is managed by staff entering winner, loser
    and grand-final matches—there is no automatic loser-bracket progression yet.
   </p>
   {matches.length===0&&t.format!=="double_elimination"&&
    <ActionForm action={generateTournamentBracketAction} className="mt-6 border border-cyan/25 bg-ink-2 p-5">
      <input type="hidden" name="tournamentId" value={t.id}/>
      <p className="text-sm text-muted">Currently checked in: {checked.length}. Two or more checked-in entrants are needed.</p>
      <label className="mt-4 flex items-start gap-3 text-sm leading-relaxed text-paper">
       <input type="checkbox" name="confirm" value="yes" required className={check}/>
       The check-in list is final enough to seed brackets and close registration
      </label>
      <button type="submit" className="mt-4 min-h-11 bg-cyan px-6 py-3 font-display text-sm uppercase tracking-wider text-ink">
       Generate {t.format==="round_robin"?"round-robin matches":"single-elimination bracket"}
      </button>
    </ActionForm>}
   {t.format==="double_elimination"&&<div className="mt-6 border border-cyan/25 bg-ink-2 p-5">
     <h3 className="font-display text-xl uppercase text-paper">Add double-elimination match</h3>
     <p className="mt-2 text-sm text-muted">Create each upper/lower/final matchup as the tournament progresses. Only checked-in competitors are eligible.</p>
     <ActionForm action={createManualTournamentMatchAction} className="mt-5 space-y-4">
       <input type="hidden" name="tournamentId" value={t.id}/>
       <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Bracket
         <select name="bracketSide" className={field}>{sides.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </label>
        <label className={label}>Round
         <input name="round" type="number" min={1} max={32} defaultValue={1} required className={field}/>
        </label>
        <label className={label}>Match number
         <input name="matchNumber" type="number" min={1} max={256} defaultValue={1} required className={field}/>
        </label>
        <label className={label}>First competitor
         <select name="playerA" required defaultValue="" className={field}>
          <option value="" disabled>Choose checked-in player</option>
          {checked.map(e=><option key={e.id} value={e.id}>{e.player_name}</option>)}
         </select>
        </label>
        <label className={label}>Second competitor
         <select name="playerB" required defaultValue="" className={field}>
          <option value="" disabled>Choose checked-in player</option>
          {checked.map(e=><option key={e.id} value={e.id}>{e.player_name}</option>)}
         </select>
        </label>
       </div>
       <button type="submit" className="min-h-11 bg-cyan px-5 py-3 font-display text-sm uppercase text-ink">Add manual match</button>
     </ActionForm>
    </div>}
   <div className="mt-7 space-y-7">
    {[...groups.entries()].map(([key,rows])=><section key={key} className="border border-line bg-ink-2 p-5">
      <h3 className="font-display text-2xl uppercase text-paper">{rows[0].bracket_side.replaceAll("_"," ")} · Round {rows[0].round_number}</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
       {rows.map(match=>{
        const a=match.player_a?byId.get(match.player_a):null;
        const b=match.player_b?byId.get(match.player_b):null;
        const completed=match.status==="completed"||match.status==="bye";
        return <article key={match.id} className="border border-line bg-panel p-5">
         <p className="font-pixel text-[10px] uppercase text-cyan">Match {match.match_number} · {match.status}</p>
         <p className="mt-3 text-sm text-paper">{a?.player_name??"TBD"} {match.score_a??"—"}</p>
         <p className="mt-1 text-sm text-paper">{b?.player_name??"TBD"} {match.score_b??"—"}</p>
         {completed?<p className="mt-3 text-sm text-gold">Winner: {match.winner_id?byId.get(match.winner_id)?.player_name??"Unassigned":"TBD"}</p>:
          <ActionForm action={completeTournamentMatchAction} className="mt-5 border-t border-line pt-4">
           <input type="hidden" name="matchId" value={match.id}/>
           <div className="grid gap-3 sm:grid-cols-3">
            <label className={label}>Winner
             <select name="winnerId" defaultValue="" required className={field}>
              <option value="" disabled>Choose winner</option>
              {a&&<option value={a.id}>{a.player_name}</option>}
              {b&&<option value={b.id}>{b.player_name}</option>}
             </select>
            </label>
            <label className={label}>Score A
             <input name="scoreA" type="number" min={0} max={999} className={field} placeholder="Optional"/>
            </label>
            <label className={label}>Score B
             <input name="scoreB" type="number" min={0} max={999} className={field} placeholder="Optional"/>
            </label>
           </div>
           <button type="submit" className="mt-4 min-h-11 border border-cyan px-5 py-2 font-display text-sm uppercase text-cyan">
            Record result
           </button>
          </ActionForm>}
        </article>;
       })}
      </div>
     </section>)}
   </div>
   {!matches.length&&<p className="mt-6 border border-line bg-ink-2 p-6 text-muted">No matches created yet. Check in competitors, then generate or enter the bracket.</p>}
  </section>
 </div>;
}
