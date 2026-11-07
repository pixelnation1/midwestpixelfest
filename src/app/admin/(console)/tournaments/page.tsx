import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { createTournamentAction } from "@/app/actions/tournament-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
 TOURNAMENT_STATUS_LABELS, tournamentFormatLabel,formatTournamentTime,
 type TournamentRecord,
} from "@/lib/tournaments/model";

export const dynamic="force-dynamic";
export default async function AdminTournamentsPage(){
 const db=await createSupabaseServerClient();
 if(!db)return <p className="text-magenta">Sign in again.</p>;
 const {data,error}=await db.from("tournament_events").select("*")
  .order("event_date",{ascending:true}).order("start_time",{ascending:true}).limit(200);
 if(error)return <p role="alert" className="text-magenta">Unable to load tournament drafts.</p>;
 const rows=(data??[]) as TournamentRecord[];
 const announced=rows.filter(t=>t.is_published).length;
 const open=rows.filter(t=>t.registration_open&&t.is_published).length;
 return <div className="space-y-9">
  <div>
   <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">Organizer / Competitive gaming</p>
   <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-paper">Tournament Management</h1>
   <p className="mt-3 max-w-3xl leading-relaxed text-muted">
    Create confirmed events, establish formats, capacity and rules, then open player
    registration, check people in, generate brackets and publish results.
    Unpublished tournaments remain private.
   </p>
  </div>
  <div className="grid gap-3 sm:grid-cols-3">
   {[
    ["Drafts & events",rows.length],
    ["Public tournaments",announced],
    ["Registration open",open],
   ].map(([name,count])=><div key={name} className="border border-line bg-panel p-5">
    <p className="font-pixel text-[10px] uppercase tracking-wide text-muted">{name}</p>
    <p className="mt-3 font-display text-4xl text-cyan">{count}</p>
   </div>)}
  </div>
  <section className="border border-line bg-panel p-5 sm:p-7">
   <h2 className="font-display text-2xl uppercase text-paper">Create a private tournament draft</h2>
   <p className="mt-3 text-sm leading-relaxed text-muted">
    Creating a draft does not announce the game or open registrations.
    Confirm the venue, equipment, game rules and schedule before publishing.
   </p>
   <ActionForm action={createTournamentAction} className="mt-6 space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
     <label className="block text-sm text-paper">Tournament title *
      <input name="title" required maxLength={160} placeholder="Example: Console Championship"
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
     </label>
     <label className="block text-sm text-paper">Game title *
      <input name="gameTitle" required maxLength={160} placeholder="Official game or format"
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
     </label>
     <label className="block text-sm text-paper">URL slug *
      <input name="slug" required pattern="[a-z0-9][a-z0-9-]{1,79}" maxLength={80}
       placeholder="console-championship" className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
     </label>
     <label className="block text-sm text-paper">Date *
      <select name="eventDate" defaultValue="2027-10-16"
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2">
       <option value="2027-10-16">Saturday, October 16</option>
       <option value="2027-10-17">Sunday, October 17</option>
      </select>
     </label>
     <label className="block text-sm text-paper">Start time · Central Time *
      <input name="startTime" type="time" defaultValue="13:00" required
       className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-4 py-2"/>
     </label>
    </div>
    <button type="submit" className="min-h-11 bg-magenta px-5 py-3 font-display text-sm uppercase tracking-widest text-ink">
     Create tournament draft
    </button>
   </ActionForm>
  </section>
  <section>
   <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="font-display text-3xl uppercase text-paper">Tournament pipeline</h2>
    <Link href="/tournaments" target="_blank" rel="noopener noreferrer"
     className="font-display text-sm uppercase text-cyan underline">View public directory ↗</Link>
   </div>
   <div className="mt-5 space-y-3">
    {rows.map(t=><article key={t.id}
      className="flex flex-col gap-4 border border-line bg-panel p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
       <p className="font-pixel text-[10px] uppercase tracking-wider text-cyan">{TOURNAMENT_STATUS_LABELS[t.status]}</p>
       <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-paper">{t.title}</h3>
       <p className="mt-2 text-sm text-muted">{t.game_title} · {t.event_date} · {formatTournamentTime(t.start_time)}</p>
       <p className="mt-2 text-sm text-muted">{tournamentFormatLabel(t.format)} · Max {t.capacity} {t.entry_type==="team"?"teams":"players"}</p>
       <p className="mt-2 text-xs text-gold">
        {t.is_published?"Published":"Private"} · {t.registration_open?"Registrations open":"Signups closed"} · {t.bracket_published?"Bracket public":"Bracket private"}
       </p>
      </div>
      <Link href={"/admin/tournaments/"+t.id}
       className="inline-flex min-h-11 shrink-0 items-center justify-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan">
       Manage tournament →
      </Link>
     </article>)}
    {!rows.length&&<div className="border border-line bg-panel p-7">
      <h3 className="font-display text-2xl uppercase text-paper">No tournaments created yet</h3>
      <p className="mt-3 text-muted">Create a draft above. We won't show anything publicly until you approve it.</p>
     </div>}
   </div>
  </section>
 </div>;
}
