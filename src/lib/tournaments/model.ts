export const TOURNAMENT_CATEGORIES=[
 {value:"video_games",label:"Video Games"},
 {value:"trading_cards",label:"Trading Card Games"},
 {value:"tabletop",label:"Tabletop & RPG"},
 {value:"other",label:"Other Gaming"},
] as const;
export const TOURNAMENT_FORMATS=[
 {value:"single_elimination",label:"Single Elimination"},
 {value:"double_elimination",label:"Double Elimination (organizer-managed bracket)"},
 {value:"round_robin",label:"Round Robin"},
] as const;
export const TOURNAMENT_ENTRY_TYPES=[
 {value:"individual",label:"Individual"},
 {value:"team",label:"Team"},
] as const;
export const TOURNAMENT_AGE_POLICIES=[
 {value:"all_ages",label:"All ages (guardian permission for minors)"},
 {value:"age_13_plus",label:"Ages 13+"},
 {value:"age_18_plus",label:"Adults only (18+)"},
] as const;
export const TOURNAMENT_STATUSES=[
 "draft","confirmed","in_progress","completed","cancelled",
] as const;
export const TOURNAMENT_REGISTRATION_STATUSES=[
 "registered","waitlisted","checked_in","withdrawn","disqualified",
] as const;
export type TournamentFormat=(typeof TOURNAMENT_FORMATS)[number]["value"];
export type TournamentStatus=(typeof TOURNAMENT_STATUSES)[number];
export type TournamentRegistrationStatus=(typeof TOURNAMENT_REGISTRATION_STATUSES)[number];
export type TournamentMatchSide="winners"|"losers"|"grand_final"|"round_robin";
export const TOURNAMENT_STATUS_LABELS:Record<TournamentStatus,string>={
 draft:"Private draft",confirmed:"Confirmed",in_progress:"In progress",
 completed:"Completed",cancelled:"Cancelled",
};
export const TOURNAMENT_ENTRY_STATUS_LABELS:Record<TournamentRegistrationStatus,string>={
 registered:"Registered",waitlisted:"Waitlisted",checked_in:"Checked in",
 withdrawn:"Withdrawn",disqualified:"Disqualified",
};

export type TournamentRecord={
 id:string;slug:string;title:string;game_title:string;category:string;platform:string;
 format:TournamentFormat;entry_type:"individual"|"team";team_size:number;
 capacity:number;description:string;rules:string;prize_notes:string;fee_notes:string;
 entry_fee_cents:number;event_date:string;start_time:string;location_notes:string;
 age_policy:string;status:TournamentStatus;is_published:boolean;
 registration_open:boolean;waitlist_enabled:boolean;bracket_published:boolean;
 registration_deadline:string|null;
};
export type TournamentEntry={
 id:string;tournament_id:string;reference:string;contact_name:string;
 contact_email:string;player_name:string;roster_notes:string;age_band:string;
 guardian_confirmed:boolean;public_name_consent:boolean;
 status:TournamentRegistrationStatus;checked_in_at:string|null;created_at:string;
};
export type SeedMatch={
 bracket_side:TournamentMatchSide;round_number:number;match_number:number;
 player_a:string|null;player_b:string|null;winner_id:string|null;
 status:"pending"|"completed"|"bye";
};
export type PublicMatch={
 id:string;side:TournamentMatchSide;round:number;number:number;
 playerA:string|null;playerB:string|null;winner:string|null;
 scoreA:number|null;scoreB:number|null;status:string;note:string;
};
export type PublicStanding={
 playerName:string;wins:number;losses:number;points:number;
};
export type TournamentPublic=TournamentRecord & {
 registeredCount:number;waitlistCount:number;matches:PublicMatch[];standings:PublicStanding[];
};

export function validTournamentSlug(value:string):boolean{
 return /^[a-z0-9][a-z0-9-]{1,79}$/.test(value);
}
export function validTournamentDate(value:string):boolean{
 return value==="2027-10-16"||value==="2027-10-17";
}
export function validTournamentTime(value:string):boolean{
 return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}
export function tournamentFormatLabel(value:string):string{
 return TOURNAMENT_FORMATS.find(f=>f.value===value)?.label??value;
}
export function tournamentCategoryLabel(value:string):string{
 return TOURNAMENT_CATEGORIES.find(f=>f.value===value)?.label??value;
}
export function formatTournamentTime(value:string):string{
 const [h,m]=value.slice(0,5).split(":").map(Number);
 if(!Number.isInteger(h)||!Number.isInteger(m))return value;
 return (h%12||12)+":"+String(m).padStart(2,"0")+(h<12?" AM":" PM")+" CT";
}
export function formatTournamentFee(cents:number):string {
 return cents===0?"Free registration":
 new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(cents/100)+" entry fee";
}
export function safePlayerLabel(entry:Pick<TournamentEntry,
 "player_name"|"public_name_consent"|"reference">):string{
 return entry.public_name_consent?entry.player_name:"Entrant "+entry.reference.slice(-5);
}
export function tournamentRegistrationAvailable(t:Pick<TournamentRecord,
 "registration_open"|"is_published"|"status"|"registration_deadline">,now:Date):boolean{
 return t.registration_open && t.is_published && t.status==="confirmed" &&
  (!t.registration_deadline || new Date(t.registration_deadline).getTime()>now.getTime());
}
export function validatePlayerEligibility(
 ageBand:string, agePolicy:string,guardianConfirmed:boolean,
):string|null {
 if(!["adult","minor","under_13"].includes(ageBand))return "Choose an age range.";
 if(agePolicy==="age_18_plus"&&ageBand!=="adult")return "This tournament is for players age 18 and older.";
 if(agePolicy==="age_13_plus"&&ageBand==="under_13")return "This tournament is for players age 13 and older.";
 if(ageBand!=="adult"&&!guardianConfirmed)return "An adult must confirm guardian permission.";
 return null;
}

/** Seeds use standard bracket positioning so byes go to highest seeds. */
export function seededPositions(size:number):number[]{
 if(size<2||size>256||(size & (size-1))!==0)throw Error("Invalid bracket size");
 let positions=[1,2];
 while(positions.length<size){
  const pairSum=positions.length*2+1;
  positions=positions.flatMap(n=>[n,pairSum-n]);
 }
 return positions;
}

export function buildSingleElimination(ids:string[]):SeedMatch[]{
 if(ids.length<2||ids.length>256)throw Error("Need between 2 and 256 entrants");
 const size=2**Math.ceil(Math.log2(ids.length));
 const seeds=seededPositions(size);
 const matches:SeedMatch[]=[];
 let rounds=Math.log2(size);
 for(let r=1;r<=rounds;r++){
  const count=size/(2**r);
  for(let m=1;m<=count;m++){
   let a:string|null=null,b:string|null=null,winner:string|null=null;
   if(r===1){
    a=ids[seeds[(m-1)*2]-1]??null;
    b=ids[seeds[(m-1)*2+1]-1]??null;
    if((a&&!b)||(!a&&b))winner=a??b;
   }
   matches.push({bracket_side:"winners",round_number:r,match_number:m,
    player_a:a,player_b:b,winner_id:winner,
    status:winner?"bye":"pending"});
  }
 }
 // Pass walkovers into round two, preserving deterministic bracket positions.
 for(const m of matches.filter(m=>m.round_number===1&&m.status==="bye")){
  const next=matches.find(x=>x.round_number===2&&x.match_number===Math.ceil(m.match_number/2));
  if(!next||!m.winner_id)continue;
  if(m.match_number%2===1)next.player_a=m.winner_id;
  else next.player_b=m.winner_id;
 }
 return matches;
}

/** The circle method produces non-repeating pairings for each round. */
export function buildRoundRobin(ids:string[]):SeedMatch[]{
 if(ids.length<2||ids.length>16)throw Error("Round robin supports 2–16 entrants");
 const players:(string|null)[]=[...ids];
 if(players.length%2!==0)players.push(null);
 const n=players.length;
 const matches:SeedMatch[]=[];
 for(let round=1;round<n;round++){
  let number=1;
  for(let i=0;i<n/2;i++){
   const a=players[i],b=players[n-i-1];
   if(a&&b)matches.push({bracket_side:"round_robin",round_number:round,
    match_number:number++,player_a:a,player_b:b,winner_id:null,status:"pending"});
  }
  players.splice(1,0,players.pop()!);
 }
 return matches;
}
