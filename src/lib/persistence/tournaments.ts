import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { safePlayerLabel } from "@/lib/tournaments/model";
import type { TournamentRecord,TournamentPublic,TournamentEntry,PublicMatch,PublicStanding } from "@/lib/tournaments/model";

const EVENT_FIELDS="id,slug,title,game_title,category,platform,format,entry_type,team_size,capacity,description,rules,prize_notes,fee_notes,entry_fee_cents,event_date,start_time,location_notes,age_policy,status,is_published,registration_open,waitlist_enabled,bracket_published,registration_deadline";
const MATCH_FIELDS="id,tournament_id,bracket_side,round_number,match_number,player_a,player_b,winner_id,score_a,score_b,status,public_notes";
type DBMatch={id:string;tournament_id:string;bracket_side:PublicMatch["side"];round_number:number;match_number:number;player_a:string|null;player_b:string|null;winner_id:string|null;score_a:number|null;score_b:number|null;status:string;public_notes:string};

function totals(rows:{tournament_id:string;status:string}[],id:string){
 const entries=rows.filter(row=>row.tournament_id===id);
 return {
  registeredCount:entries.filter(row=>row.status==="registered"||row.status==="checked_in").length,
  waitlistCount:entries.filter(row=>row.status==="waitlisted").length,
 };
}

export async function listPublicTournaments():Promise<TournamentPublic[]> {
 const service=createSupabaseServiceClient();
 if(!service)return [];
 const {data,error}=await service.from("tournament_events").select(EVENT_FIELDS).eq("is_published",true)
  .in("status",["confirmed","in_progress","completed","cancelled"])
  .order("event_date",{ascending:true}).order("start_time",{ascending:true})
  .limit(100);
 if(error){console.error("public_tournament_load_failed",{code:error.code});return [];}
 const rows=(data??[]) as unknown as TournamentRecord[];
 if(!rows.length)return [];
 const {data:entryRows,error:entryError}=await service.from("tournament_registrations")
  .select("tournament_id,status").in("tournament_id",rows.map(r=>r.id)).limit(25000);
 if(entryError)console.error("public_tournament_counts_failed",{code:entryError.code});
 return rows.map(row=>({...row,...totals(entryRows??[],row.id),matches:[],standings:[]}));
}

export async function getPublicTournamentBySlug(slug:string):Promise<TournamentPublic|null>{
 if(!/^[a-z0-9][a-z0-9-]{1,79}$/.test(slug))return null;
 const service=createSupabaseServiceClient();
 if(!service)return null;
 const {data,error}=await service.from("tournament_events").select(EVENT_FIELDS)
  .eq("slug",slug).eq("is_published",true)
  .in("status",["confirmed","in_progress","completed","cancelled"]).maybeSingle();
 if(error||!data)return null;
 const tournament=data as unknown as TournamentRecord;
 const {data:entryRows,error:entryError}=await service.from("tournament_registrations")
  .select("id,tournament_id,reference,player_name,public_name_consent,status")
  .eq("tournament_id",tournament.id).limit(260);
 if(entryError){console.error("public_tournament_entry_count_failed",{code:entryError.code});return null;}
 const entries=(entryRows??[]) as unknown as TournamentEntry[];
 const {registeredCount,waitlistCount}=totals(entries,tournament.id);
 if(!tournament.bracket_published)return {...tournament,registeredCount,waitlistCount,matches:[],standings:[]};
 const {data:matchRows,error:matchError}=await service.from("tournament_matches")
  .select(MATCH_FIELDS).eq("tournament_id",tournament.id)
  .order("round_number",{ascending:true}).order("match_number",{ascending:true}).limit(1000);
 if(matchError){console.error("public_tournament_matches_failed",{code:matchError.code});return {...tournament,registeredCount,waitlistCount,matches:[],standings:[]};}
 const names=new Map(entries.map(e=>[e.id,safePlayerLabel(e)]));
 const raw=(matchRows??[]) as unknown as DBMatch[];
 const matches:PublicMatch[]=raw.map(m=>({
   id:m.id,side:m.bracket_side,round:m.round_number,number:m.match_number,
   playerA:m.player_a?names.get(m.player_a)??"Entrant":"TBD",
   playerB:m.player_b?names.get(m.player_b)??"Entrant":"TBD",
   winner:m.winner_id?names.get(m.winner_id)??"Entrant":null,
   scoreA:m.score_a,scoreB:m.score_b,status:m.status,note:m.public_notes,
 }));
 const results=new Map<string,{wins:number;losses:number}>();
 for(const row of entries)results.set(row.id,{wins:0,losses:0});
 for(const m of raw.filter(m=>m.status==="completed"&&m.winner_id)){
   if(!m.player_a||!m.player_b)continue;
   const loser=m.winner_id===m.player_a?m.player_b:m.player_a;
   const w=results.get(m.winner_id!);
   const l=results.get(loser);
   if(w)w.wins++;
   if(l)l.losses++;
 }
 const standings:PublicStanding[]=entries
  .filter(e=>results.has(e.id)&& (raw.some(m=>m.player_a===e.id||m.player_b===e.id)))
  .map(e=>{const r=results.get(e.id)!;return {playerName:safePlayerLabel(e),wins:r.wins,losses:r.losses,points:r.wins*3};})
  .sort((a,b)=>b.wins-a.wins||a.losses-b.losses||a.playerName.localeCompare(b.playerName));
 return {...tournament,registeredCount,waitlistCount,matches,standings};
}
