"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
 TOURNAMENT_CATEGORIES,TOURNAMENT_FORMATS,tournamentFormatLabel,
 formatTournamentFee,formatTournamentTime,TOURNAMENT_STATUS_LABELS,
} from "@/lib/tournaments/model";
import type {TournamentPublic} from "@/lib/tournaments/model";

export function TournamentDirectory({tournaments}:{tournaments:TournamentPublic[]}){
 const [search,setSearch]=useState("");
 const [category,setCategory]=useState("all");
 const [day,setDay]=useState("all");
 const [format,setFormat]=useState("all");
 const results=useMemo(()=>{
  const text=search.trim().toLocaleLowerCase();
  return tournaments.filter(t=>
   (category==="all"||t.category===category)&&
   (day==="all"||t.event_date===day)&&
   (format==="all"||t.format===format)&&
   (!text||[t.title,t.game_title,t.description,t.platform].some(v=>v.toLocaleLowerCase().includes(text)))
  );
 },[tournaments,search,category,day,format]);

 if(tournaments.length===0)return <div className="border border-cyan/30 bg-[#10172b] p-7 text-center sm:p-12">
  <p className="font-pixel text-[11px] uppercase tracking-widest text-cyan">Competition planning</p>
  <h2 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper sm:text-4xl">Tournament announcements coming soon.</h2>
  <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
   We're preparing competitive gaming for Midwest Pixel Fest 2027.
   Tournament games, formats, schedules, caps and registration links will appear here
   only after organizers confirm the details. No tournament is officially open yet.
  </p>
  <Link href="/gaming" className="mt-6 inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase text-cyan">
    Explore gaming at Pixel Fest
  </Link>
 </div>;

 return <div>
  <div className="grid gap-3 border border-line bg-panel p-5 sm:grid-cols-2 lg:grid-cols-4">
   <label className="block text-sm text-muted">Search by game or title
    <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
      placeholder="Search tournaments..." className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-paper placeholder:text-muted/80"/>
   </label>
   <label className="block text-sm text-muted">Game type
    <select value={category} onChange={e=>setCategory(e.target.value)}
      className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-paper">
      <option value="all">All game types</option>
      {TOURNAMENT_CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
    </select>
   </label>
   <label className="block text-sm text-muted">Date
    <select value={day} onChange={e=>setDay(e.target.value)}
      className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-paper">
     <option value="all">Both days</option>
     <option value="2027-10-16">Saturday, October 16</option>
     <option value="2027-10-17">Sunday, October 17</option>
    </select>
   </label>
   <label className="block text-sm text-muted">Tournament format
    <select value={format} onChange={e=>setFormat(e.target.value)}
      className="mt-2 min-h-11 w-full border border-paper/25 bg-ink px-3 py-2 text-paper">
     <option value="all">All formats</option>
     {TOURNAMENT_FORMATS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
    </select>
   </label>
  </div>
  <p role="status" className="mt-5 font-pixel text-[11px] uppercase tracking-widest text-gold">
   {results.length} {results.length===1?"tournament":"tournaments"} found
  </p>
  <div className="mt-6 grid gap-5 md:grid-cols-2">
   {results.map(t=><article key={t.id} className="flex flex-col border border-line border-t-4 border-t-cyan/60 bg-panel p-6 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
     <p className="font-pixel text-[10px] uppercase tracking-wider text-cyan">{t.category.replaceAll("_"," ")}</p>
     <span className={"border px-3 py-1 font-pixel text-[10px] uppercase "+(t.status==="cancelled"?"border-magenta text-magenta":"border-gold text-gold")}>
       {TOURNAMENT_STATUS_LABELS[t.status]}
     </span>
    </div>
    <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper">{t.title}</h3>
    <p className="mt-2 text-lg text-cyan">{t.game_title}{t.platform?" · "+t.platform:""}</p>
    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{t.description}</p>
    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
     <div><p className="font-pixel text-[10px] uppercase text-gold">Date & time</p>
       <p className="mt-2 text-sm text-paper">{t.event_date==="2027-10-16"?"Saturday":"Sunday"} · {formatTournamentTime(t.start_time)}</p>
     </div>
     <div><p className="font-pixel text-[10px] uppercase text-gold">Format</p>
      <p className="mt-2 text-sm text-paper">{tournamentFormatLabel(t.format)}</p>
     </div>
     <div><p className="font-pixel text-[10px] uppercase text-gold">Capacity</p>
       <p className="mt-2 text-sm text-paper">{t.registeredCount} / {t.capacity} {t.entry_type==="team"?"teams":"players"}</p>
     </div>
     <div><p className="font-pixel text-[10px] uppercase text-gold">Entry</p>
      <p className="mt-2 text-sm text-paper">{formatTournamentFee(t.entry_fee_cents)}</p>
     </div>
    </div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
     <span className={t.registration_open?"text-sm text-lime":"text-sm text-muted"}>
      {t.registration_open?"Registration open":t.status==="cancelled"?"Cancelled":"Registration closed"}
      {t.registeredCount>=t.capacity&&t.registration_open?(t.waitlist_enabled?" · Waitlist available":" · Full"):""}
     </span>
     <Link href={"/tournaments/"+t.slug} className="inline-flex min-h-11 items-center border border-cyan px-5 py-3 font-display text-sm uppercase tracking-wider text-cyan hover:bg-cyan/10">
      View details →
     </Link>
    </div>
   </article>)}
  </div>
  {results.length===0&&<div className="mt-7 border border-line bg-panel p-8 text-center">
   <h3 className="font-display text-2xl uppercase text-paper">No tournaments match.</h3>
   <button type="button" onClick={()=>{setSearch("");setCategory("all");setDay("all");setFormat("all");}}
    className="mt-4 min-h-11 border border-cyan px-5 py-2 font-display text-sm uppercase text-cyan">Clear filters</button>
  </div>}
 </div>;
}
