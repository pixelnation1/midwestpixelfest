import assert from "node:assert/strict";
import {describe,it} from "node:test";
import {
 seededPositions,buildSingleElimination,buildRoundRobin,validTournamentSlug,
 validTournamentDate,validTournamentTime,tournamentRegistrationAvailable,
 validatePlayerEligibility,safePlayerLabel,formatTournamentFee,
} from "./model";

describe("tournament validation and privacy",()=>{
 it("validates event dates and slugs",()=>{
  assert.equal(validTournamentDate("2027-10-16"),true);
  assert.equal(validTournamentDate("2027-10-17"),true);
  assert.equal(validTournamentDate("2027-10-18"),false);
  assert.equal(validTournamentSlug("smash-ultimate"),true);
  assert.equal(validTournamentSlug("../bad"),false);
  assert.equal(validTournamentTime("13:30"),true);
  assert.equal(validTournamentTime("25:30"),false);
 });
 it("requires adult consent for minors",()=>{
  assert.equal(validatePlayerEligibility("under_13","age_13_plus",true)!==null,true);
  assert.equal(validatePlayerEligibility("minor","age_18_plus",true)!==null,true);
  assert.equal(validatePlayerEligibility("minor","all_ages",false)!==null,true);
  assert.equal(validatePlayerEligibility("minor","all_ages",true),null);
 });
 it("hides player name unless permission is given",()=>{
  const entry={player_name:"Private Player",reference:"MPF-TM-ABCDE",public_name_consent:false};
  assert.equal(safePlayerLabel(entry),"Entrant ABCDE");
  assert.equal(safePlayerLabel({...entry,public_name_consent:true}),"Private Player");
 });
 it("does not allow signups to unpublished or closed events",()=>{
  const open={registration_open:true,is_published:true,status:"confirmed" as const,registration_deadline:null};
  assert.equal(tournamentRegistrationAvailable(open,new Date()),true);
  assert.equal(tournamentRegistrationAvailable({...open,is_published:false},new Date()),false);
  assert.equal(tournamentRegistrationAvailable({...open,registration_open:false},new Date()),false);
  assert.equal(formatTournamentFee(0),"Free registration");
 });
});
describe("single-elimination bracket seeding",()=>{
 it("spreads top seeds and gives byes to top seeds",()=>{
  assert.deepEqual(seededPositions(8),[1,8,4,5,2,7,3,6]);
  const rows=buildSingleElimination(["a","b","c","d","e"]);
  const first=rows.filter(m=>m.round_number===1);
  assert.equal(first.length,4);
  assert.equal(first.filter(m=>m.status==="bye").length,3);
  assert.equal(rows.length,7);
  const second=rows.filter(m=>m.round_number===2);
  assert.equal(second.length,2);
  assert.equal(second[0].player_a,"a");
 });
 it("works for two participants and rejects unsupported sizes",()=>{
  assert.equal(buildSingleElimination(["a","b"]).length,1);
  assert.throws(()=>buildSingleElimination(["a"]));
 });
});
describe("round robin bracket generation",()=>{
 it("creates every pairing exactly once for 5 players",()=>{
  const rows=buildRoundRobin(["a","b","c","d","e"]);
  assert.equal(rows.length,10);
  const keys=rows.map(m=>[m.player_a,m.player_b].sort().join("-"));
  assert.equal(new Set(keys).size,10);
  assert.equal(rows.length,10);
 });
 it("limits round-robin size to sixteen",()=>{
  const ids=Array.from({length:17},(_,i)=>String(i));
  assert.throws(()=>buildRoundRobin(ids));
  assert.equal(buildRoundRobin(["a","b"]).length,1);
 });
});


describe("tournament bracket regressions across supported sizes",()=>{
 it("seeds every 2–64-player single-elimination bracket without duplicate entrants",()=>{
  for(let count=2;count<=64;count++){
   const participants=Array.from({length:count},(_,i)=>"player-"+i);
   const matches=buildSingleElimination(participants);
   const size=2**Math.ceil(Math.log2(count));
   assert.equal(matches.length,size-1,"total matches for "+count);
   const first=matches.filter(m=>m.round_number===1);
   const seeded=first.flatMap(m=>[m.player_a,m.player_b]).filter(Boolean);
   assert.equal(seeded.length,count,"participants seeded for "+count);
   assert.equal(new Set(seeded).size,count,"no duplicate participant for "+count);
   assert.equal(first.filter(m=>m.status==="bye").length,size-count,"bye count for "+count);
   const seen=new Set(matches.map(m=>m.round_number+":"+m.match_number));
   assert.equal(seen.size,matches.length,"unique match positions for "+count);
   for(const m of matches.filter(m=>m.status==="bye"&&m.round_number===1)){
    assert.ok(m.winner_id,"bye should have a winner for "+count);
    const next=matches.find(n=>n.round_number===2&&n.match_number===Math.ceil(m.match_number/2));
    if(next)assert.equal(m.match_number%2===1?next.player_a:next.player_b,m.winner_id);
   }
  }
 });
 it("creates a complete, non-overlapping round robin for 2–16 entrants",()=>{
  for(let count=2;count<=16;count++){
   const participants=Array.from({length:count},(_,i)=>"player-"+i);
   const matches=buildRoundRobin(participants);
   assert.equal(matches.length,count*(count-1)/2,"pairings for "+count);
   const seen=new Set<string>();
   for(const match of matches){
    assert.ok(match.player_a&&match.player_b);
    const pair=[match.player_a,match.player_b].sort().join("|");
    assert.ok(!seen.has(pair),"no repeated matchup "+pair);
    seen.add(pair);
    assert.equal(match.bracket_side,"round_robin");
   }
   for(let round=1;round<=(count%2===0?count-1:count);round++){
    const playing=matches.filter(m=>m.round_number===round)
      .flatMap(m=>[m.player_a,m.player_b]);
    assert.equal(new Set(playing).size,playing.length,"no one scheduled twice in round "+round);
   }
  }
 });
 it("closes registration if deadline passes, even when announcement is public",()=>{
  const event={registration_open:true,is_published:true,status:"confirmed" as const,registration_deadline:"2027-10-16T12:00:00-05:00"};
  assert.equal(tournamentRegistrationAvailable(event,new Date("2027-10-16T11:00:00-05:00")),true);
  assert.equal(tournamentRegistrationAvailable(event,new Date("2027-10-16T12:00:00-05:00")),false);
 });
});
