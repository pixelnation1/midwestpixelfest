"use server";

import { revalidatePath } from "next/cache";
import { requireOrganizer } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { recordOrganizerAudit } from "@/lib/persistence/audit";
import {
 TOURNAMENT_CATEGORIES,TOURNAMENT_FORMATS,TOURNAMENT_ENTRY_TYPES,
 TOURNAMENT_AGE_POLICIES,TOURNAMENT_STATUSES,
 TOURNAMENT_REGISTRATION_STATUSES,
 buildSingleElimination,buildRoundRobin,validTournamentSlug,
 validTournamentDate,validTournamentTime,
} from "@/lib/tournaments/model";
import type {TournamentRecord,TournamentStatus,TournamentFormat} from "@/lib/tournaments/model";
import type {AdminActionState} from "@/app/actions/admin";

const ok=(message:string):AdminActionState=>({status:"success",message});
const bad=(message:string):AdminActionState=>({status:"error",message});
const read=(f:FormData,k:string,max=9000)=>{
 const v=f.get(k);return typeof v==="string"?v.trim().slice(0,max+1):"";
};
const yes=(f:FormData,k:string)=>f.get(k)==="yes";
const uuid=(v:string)=>/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(v);
const oneOf=(value:string,options:readonly {value:string}[])=>options.some(x=>x.value===value);
const refresh=(slug?:string)=>{
 for(const path of ["/tournaments","/gaming","/schedule","/admin/tournaments","/admin","/sitemap.xml"])
  revalidatePath(path);
 if(slug)revalidatePath("/tournaments/"+slug);
};
async function admin() {
 const actor=await requireOrganizer();
 const db=await createSupabaseServerClient();
 const service=createSupabaseServiceClient();
 return db&&service?{db,service,actor}:null;
}
async function log(actor:Awaited<ReturnType<typeof requireOrganizer>>,action:string,id:string){
 await recordOrganizerAudit({action,entityType:"tournament",entityId:id,actor});
}

export async function createTournamentAction(
 _state:AdminActionState,f:FormData,
):Promise<AdminActionState>{
 const session=await admin();if(!session)return bad("Tournament database unavailable.");
 const title=read(f,"title",160),game=read(f,"gameTitle",160),slug=read(f,"slug",80).toLowerCase();
 const date=read(f,"eventDate",10),time=read(f,"startTime",5);
 if(title.length<3||title.length>160||game.length<2||game.length>160||
  !validTournamentSlug(slug)||!validTournamentDate(date)||!validTournamentTime(time))
  return bad("Enter a valid tournament title, game, slug, date and start time.");
 const {data,error}=await session.db.from("tournament_events").insert({
  title,game_title:game,slug,event_date:date,start_time:time,
  status:"draft",is_published:false,registration_open:false,
 }).select("id").single();
 if(error)return bad(error.code==="23505"?"That tournament URL is already in use.":"Could not create a tournament draft.");
 await log(session.actor,"tournament_draft_created",data.id);
 refresh(slug);
 return ok("Tournament draft saved privately. Open the event to set rules, formats and registration.");
}

export async function updateTournamentAction(
 _state:AdminActionState,f:FormData,
):Promise<AdminActionState>{
 const session=await admin();if(!session)return bad("Tournament database unavailable.");
 const id=read(f,"tournamentId",36);
 if(!uuid(id))return bad("Invalid tournament.");
 const {data:current,error:loadError}=await session.db.from("tournament_events")
  .select("*").eq("id",id).maybeSingle();
 if(loadError||!current)return bad("Tournament not found.");

 const title=read(f,"title",160),game=read(f,"gameTitle",160),category=read(f,"category",35);
 const format=read(f,"format",35),entryType=read(f,"entryType",20);
 const teamSize=Number(read(f,"teamSize",2)),capacity=Number(read(f,"capacity",4));
 const date=read(f,"eventDate",10),time=read(f,"startTime",5);
 const platform=read(f,"platform",120);
 const description=read(f,"description",3500),rules=read(f,"rules",9000);
 const prize=read(f,"prizeNotes",2000),location=read(f,"locationNotes",240);
 const agePolicy=read(f,"agePolicy",20),status=read(f,"status",20);
 const feeCents=Number(read(f,"entryFeeCents",7));
 const feeNotes=read(f,"feeNotes",1000);
 const publish=yes(f,"publish"),registrationOpen=yes(f,"registrationOpen");
 const waitlist=yes(f,"waitlistEnabled"),bracketPublished=yes(f,"bracketPublished");
 if(title.length<3||title.length>160||game.length<2||game.length>160||
  !oneOf(category,TOURNAMENT_CATEGORIES)||!oneOf(format,TOURNAMENT_FORMATS)||
  !oneOf(entryType,TOURNAMENT_ENTRY_TYPES)||
  !oneOf(agePolicy,TOURNAMENT_AGE_POLICIES)||
  !TOURNAMENT_STATUSES.includes(status as TournamentStatus)||
  !validTournamentDate(date)||!validTournamentTime(time)||
  platform.length>120||description.length>3500||rules.length>9000||
  prize.length>2000||feeNotes.length>1000||location.length>240||
  !Number.isInteger(capacity)||capacity<2||capacity>256||
  !Number.isInteger(teamSize)||teamSize<1||teamSize>8||
  (entryType==="individual"&&teamSize!==1)||
  (entryType==="team"&&teamSize<2)||
  (format==="round_robin"&&capacity>16)||
  !Number.isInteger(feeCents)||feeCents<0||feeCents>50000||
  (feeCents>0&&!feeNotes)){
  return bad("Check tournament title, eligibility, format, capacity, time, fees and description limits. Round robin supports up to 16 players.");
 }
 if(publish&&(!["confirmed","in_progress","completed","cancelled"].includes(status)||
  !yes(f,"publishApproved")||!rules)){
   return bad("To announce a tournament, confirm event arrangements and publish approved game rules.");
 }
 if(registrationOpen&&(!publish||status!=="confirmed")){
   return bad("Open registration only for a confirmed, published tournament.");
 }
 const {count:registered,error:entryError}=await session.db.from("tournament_registrations")
  .select("id",{head:true,count:"exact"}).eq("tournament_id",id)
  .in("status",["registered","checked_in"]);
 if(entryError)return bad("Could not verify tournament capacity.");
 if(capacity<(registered??0))return bad("The cap cannot be below active registrations.");
 const {count:matchCount,error:matchError}=await session.db.from("tournament_matches")
  .select("id",{head:true,count:"exact"}).eq("tournament_id",id);
 if(matchError)return bad("Could not verify bracket state.");
 if((matchCount??0)>0&&(
    format!==current.format||entryType!==current.entry_type||teamSize!==current.team_size||
    date!==current.event_date)){
  return bad("Tournament format, team configuration and date cannot be changed after brackets are created.");
 }
 if(bracketPublished&&(!publish||(matchCount??0)<1||!yes(f,"bracketApproved")))
  return bad("Publish brackets only after a confirmed public tournament has matches and the organizer has reviewed them.");
 const {error}=await session.db.from("tournament_events").update({
  title,game_title:game,category,platform,format,entry_type:entryType,team_size:teamSize,
  capacity,description,rules,prize_notes:prize,fee_notes:feeNotes,entry_fee_cents:feeCents,
  event_date:date,start_time:time,location_notes:location,age_policy:agePolicy,status,
  is_published:publish,registration_open:registrationOpen,waitlist_enabled:waitlist,
  bracket_published:bracketPublished,
 }).eq("id",id);
 if(error)return bad("Could not save tournament settings.");
 await log(session.actor,publish?"tournament_published":"tournament_saved_private",id);
 refresh(current.slug);
 return ok(publish?"Tournament settings published. Signups are "+(registrationOpen?"open.":"closed."):"Tournament settings saved privately.");
}

export async function updateTournamentEntryAction(
 _state:AdminActionState,f:FormData,
):Promise<AdminActionState>{
 const session=await admin();if(!session)return bad("Tournament database unavailable.");
 const entryId=read(f,"entryId",36),next=read(f,"status",25);
 if(!uuid(entryId)||!TOURNAMENT_REGISTRATION_STATUSES.includes(next as any))
  return bad("Invalid player or registration status.");
 const {data:entry,error}=await session.db.from("tournament_registrations")
  .select("id,tournament_id").eq("id",entryId).maybeSingle();
 if(error||!entry)return bad("Registration not found.");
 const {data:tournament}=await session.db.from("tournament_events")
  .select("slug").eq("id",entry.tournament_id).maybeSingle();
 const {count,error:matchError}=await session.db.from("tournament_matches")
  .select("id",{count:"exact",head:true}).eq("tournament_id",entry.tournament_id);
 if(matchError)return bad("Could not verify tournament bracket.");
 if((count??0)>0 && next!=="checked_in")
  return bad("Brackets already exist. Entry status changes that affect bracket participants are locked.");
 const {data,error:rpcError}=await session.service.rpc("manage_tournament_entry",{
  p_entry_id:entryId,p_next_status:next,
 });
 if(rpcError){
  if((rpcError.message??"").includes("capacity_full"))return bad("All tournament slots are already filled.");
  return bad("Could not update the registration. Check its status and capacity.");
 }
 const promoted=Array.isArray(data)?data[0]?.promoted_reference:null;
 await log(session.actor,"tournament_entry_"+next,entry.tournament_id);
 refresh(tournament?.slug);
 return ok("Registration updated."+ (promoted?" Waitlisted registration "+promoted+" was automatically promoted; contact that entrant.":""));
}

export async function generateTournamentBracketAction(
 _state:AdminActionState,f:FormData,
):Promise<AdminActionState>{
 const session=await admin();if(!session)return bad("Tournament database unavailable.");
 const id=read(f,"tournamentId",36);
 if(!uuid(id)||!yes(f,"confirm"))return bad("Confirm bracket generation.");
 const {data:t,error}=await session.db.from("tournament_events")
  .select("id,slug,format,status").eq("id",id).maybeSingle();
 if(error||!t)return bad("Tournament not found.");
 if(t.format==="double_elimination")return bad("Double elimination uses manually entered winner, loser and grand-final matches.");
 if(!["confirmed","in_progress"].includes(t.status))return bad("Confirm the tournament before generating brackets.");
 const {data:players,error:playerError}=await session.db.from("tournament_registrations")
  .select("id").eq("tournament_id",id).eq("status","checked_in")
  .order("created_at",{ascending:true}).limit(300);
 if(playerError||!players)return bad("Could not load checked-in participants.");
 if(players.length<2)return bad("Check in at least two participants before generating matches.");
 let matches;
 try{
  matches=t.format==="round_robin"
   ?buildRoundRobin(players.map(p=>p.id))
   :buildSingleElimination(players.map(p=>p.id));
 }catch{return bad("The selected bracket format cannot support that number of participants.");}
 const {data,error:seedError}=await session.service.rpc("seed_tournament_matches",{
  p_tournament_id:id,p_matches:matches,
 });
 if(seedError){
  console.error("tournament_bracket_seed_failed",{code:seedError.code});
  return bad("Bracket creation failed or a bracket already exists.");
 }
 await log(session.actor,"tournament_bracket_generated",id);
 refresh(t.slug);
 return ok("Created "+data+" matches. New registration is closed. Brackets remain private until reviewed and published.");
}

export async function createManualTournamentMatchAction(
 _state:AdminActionState,f:FormData,
):Promise<AdminActionState>{
 const session=await admin();if(!session)return bad("Tournament database unavailable.");
 const id=read(f,"tournamentId",36),side=read(f,"bracketSide",20);
 const round=Number(read(f,"round",3)),num=Number(read(f,"matchNumber",4));
 const p1=read(f,"playerA",36),p2=read(f,"playerB",36);
 if(!uuid(id)||!["winners","losers","grand_final"].includes(side)||
  !Number.isInteger(round)||round<1||round>32||!Number.isInteger(num)||num<1||num>256||
  !uuid(p1)||!uuid(p2)||p1===p2) return bad("Select two different competitors and valid bracket positions.");
 const {data:t}=await session.db.from("tournament_events")
  .select("slug,format,status").eq("id",id).maybeSingle();
 if(!t||t.format!=="double_elimination"||!["confirmed","in_progress"].includes(t.status))
  return bad("Manual bracket entry is enabled for confirmed double-elimination tournaments.");
 const {data:participants,error}=await session.db.from("tournament_registrations")
  .select("id").eq("tournament_id",id).eq("status","checked_in").in("id",[p1,p2]);
 if(error||participants?.length!==2)return bad("Both competitors must be checked in.");
 const {error:insertError}=await session.db.from("tournament_matches").insert({
  tournament_id:id,bracket_side:side,round_number:round,match_number:num,
  player_a:p1,player_b:p2,status:"pending",
 });
 if(insertError)return bad("Could not save match. Check for an existing match at that bracket position.");
 await log(session.actor,"tournament_manual_match_created",id);
 refresh(t.slug);
 return ok("Manual double-elimination match added. Update winners and losers brackets as each match is played.");
}

export async function completeTournamentMatchAction(
 _state:AdminActionState,f:FormData,
):Promise<AdminActionState>{
 const session=await admin();if(!session)return bad("Tournament database unavailable.");
 const matchId=read(f,"matchId",36),winner=read(f,"winnerId",36);
 const aRaw=read(f,"scoreA",4),bRaw=read(f,"scoreB",4);
 const scoreA=aRaw===""?null:Number(aRaw),scoreB=bRaw===""?null:Number(bRaw);
 if(!uuid(matchId)||!uuid(winner)||
   [scoreA,scoreB].some(v=>v!==null&&(!Number.isInteger(v)||v<0||v>999)))
  return bad("Select the winner and enter valid scores (0–999).");
 const {data:match}=await session.db.from("tournament_matches")
  .select("tournament_id").eq("id",matchId).maybeSingle();
 if(!match)return bad("Match not found.");
 const {data:t}=await session.db.from("tournament_events")
  .select("slug").eq("id",match.tournament_id).maybeSingle();
 const {error}=await session.service.rpc("complete_tournament_match",{
  p_match_id:matchId,p_winner_id:winner,p_score_a:scoreA,p_score_b:scoreB,
 });
 if(error){
  console.error("tournament_match_result_failed",{code:error.code});
  return bad("Result not saved. Check that both players are assigned, the winner is valid and the match is unfinished.");
 }
 await log(session.actor,"tournament_match_completed",match.tournament_id);
 refresh(t?.slug);
 return ok("Match result saved. Single-elimination winners automatically advance; other formats remain organizer-managed.");
}
