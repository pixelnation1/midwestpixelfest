import {
  FIELD_LIMITS, optionalText, optionalUrl, readString, requiredText,
  requiredInteger, requireOneOf, stripControlChars, validateEmail, type FieldErrors,
} from "@/lib/forms/validate";

export const COSPLAY_AGE_BANDS = [
  {value:"adult",label:"All participants 18+"},
  {value:"teen",label:"At least one participant age 13–17"},
  {value:"child",label:"At least one participant age 12 or younger"},
] as const;
export const COSPLAY_ENTRY_TYPES = [
  {value:"individual",label:"Individual"},
  {value:"group",label:"Group (2–10 participants)"},
] as const;
export const COSPLAY_DIVISIONS = [
  {value:"beginner",label:"Beginner craftsmanship"},
  {value:"experienced",label:"Experienced craftsmanship"},
  {value:"group",label:"Group entry"},
  {value:"youth",label:"Youth showcase"},
  {value:"showcase",label:"Non-competitive showcase"},
] as const;
export const COSPLAY_CONSTRUCTION = [
  {value:"mostly_handmade",label:"Mostly handmade or self-built"},
  {value:"mixed",label:"A mix of handmade and purchased parts"},
  {value:"purchased",label:"Mostly purchased or assembled"},
  {value:"commissioned",label:"Commissioned or made by someone else"},
  {value:"other",label:"Other / not sure"},
] as const;
export const COSPLAY_DAYS = [
  {value:"saturday",label:"Saturday preferred"},
  {value:"sunday",label:"Sunday preferred"},
  {value:"either",label:"Either day"},
] as const;
export const COSPLAY_STATUSES = [
  "submitted","under_review","shortlisted","accepted","waitlisted","declined","withdrawn",
] as const;
export type CosplayStatus = (typeof COSPLAY_STATUSES)[number];
export const COSPLAY_STATUS_LABELS:Record<CosplayStatus,string> = {
  submitted:"New",under_review:"Under review",shortlisted:"Shortlisted",
  accepted:"Accepted",waitlisted:"Waitlisted",declined:"Declined",withdrawn:"Withdrawn",
};

export type CosplayFields = {
  contactName:string; email:string; phone:string; publicName:string;
  ageBand:string; entryType:string; groupSize:string; divisionPreference:string;
  characterName:string; seriesName:string; costumeDescription:string;
  constructionType:string; buildNotes:string; propsDescription:string;
  referenceUrl:string; dayPreference:string; stageNotes:string;
  accessibilityNeeds:string;
};
const fieldNames: (keyof CosplayFields)[] = [
  "contactName","email","phone","publicName","ageBand","entryType","groupSize",
  "divisionPreference","characterName","seriesName","costumeDescription",
  "constructionType","buildNotes","propsDescription","referenceUrl",
  "dayPreference","stageNotes","accessibilityNeeds",
];
const vals = <T extends readonly {value:string}[]>(options:T) => options.map(x=>x.value);
export function parseCosplayEntry(formData:FormData):
 | {ok:true; fields:CosplayFields;guardianConfirmed:boolean}
 | {ok:false;errors:FieldErrors} {
  const fields=Object.fromEntries(fieldNames.map(k=>[k,stripControlChars(readString(formData,k)).trim()])) as CosplayFields;
  const errors:FieldErrors={};
  const add=(key:string,e:string|null)=>{if(e)errors[key]=e;};
  add("contactName",requiredText(fields.contactName,"an adult contact name",FIELD_LIMITS.short));
  add("email",validateEmail(fields.email));
  add("phone",optionalText(fields.phone,"phone",FIELD_LIMITS.phone));
  add("publicName",requiredText(fields.publicName,"a public display name",FIELD_LIMITS.medium));
  add("ageBand",requireOneOf(fields.ageBand,vals(COSPLAY_AGE_BANDS),"an age range"));
  add("entryType",requireOneOf(fields.entryType,vals(COSPLAY_ENTRY_TYPES),"an entry type"));
  add("divisionPreference",requireOneOf(fields.divisionPreference,vals(COSPLAY_DIVISIONS),"a division preference"));
  add("groupSize",requiredInteger(fields.groupSize,"group size",1,10));
  const size=Number(fields.groupSize);
  if(fields.entryType==="individual" && size!==1) errors.groupSize="Individual entries must have one participant.";
  if(fields.entryType==="group" && size<2)errors.groupSize="A group must have at least two participants.";
  add("characterName",requiredText(fields.characterName,"the character or costume name",FIELD_LIMITS.medium));
  add("seriesName",optionalText(fields.seriesName,"source or franchise",FIELD_LIMITS.medium));
  add("costumeDescription",requiredText(fields.costumeDescription,"a costume description",FIELD_LIMITS.message));
  add("constructionType",requireOneOf(fields.constructionType,vals(COSPLAY_CONSTRUCTION),"a construction method"));
  for(const [key,label] of [
    ["buildNotes","build notes"],["propsDescription","prop description"],
    ["stageNotes","stage notes"],["accessibilityNeeds","accommodation request"],
  ] as const) add(key,optionalText(fields[key],label,FIELD_LIMITS.message));
  add("referenceUrl",optionalUrl(fields.referenceUrl));
  add("dayPreference",requireOneOf(fields.dayPreference,vals(COSPLAY_DAYS),"a preferred day"));
  const guardianConfirmed=readString(formData,"guardianAck")==="on";
  if(fields.ageBand!=="adult" && !guardianConfirmed) {
    errors.guardianAck="An adult must confirm parental or guardian permission for every minor participant.";
  }
  if(readString(formData,"adultAck")!=="on") errors.adultAck="An adult must submit this registration.";
  if(readString(formData,"contactConsent")!=="on")errors.contactConsent="Please authorize contact about this registration.";
  if(readString(formData,"rulesAck")!=="on")errors.rulesAck="Please acknowledge the event policies and pending contest rules.";
  if(JSON.stringify(fields).length>19000)errors.costumeDescription="Please shorten your answers.";
  return Object.keys(errors).length>0?{ok:false,errors}:{ok:true,fields,guardianConfirmed};
}
