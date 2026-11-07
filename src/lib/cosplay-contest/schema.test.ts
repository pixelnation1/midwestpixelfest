import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCosplayEntry } from "./schema";

function valid():FormData{
 const data=new FormData();
 Object.entries({
  contactName:"Adult Applicant",email:"adult@example.com",publicName:"Neon Knight",
  ageBand:"adult",entryType:"individual",groupSize:"1",
  divisionPreference:"beginner",characterName:"Neon Knight",
  costumeDescription:"Handmade armor with light-up accents and a foam visor.",
  constructionType:"mostly_handmade",dayPreference:"either",
  adultAck:"on",contactConsent:"on",rulesAck:"on",
 }).forEach(([key,value])=>data.set(key,value));
 return data;
}
describe("cosplay contest registration validation",()=>{
 it("accepts an adult individual submission",()=>{
  const result=parseCosplayEntry(valid());
  assert.equal(result.ok,true);
  if(result.ok)assert.equal(result.fields.publicName,"Neon Knight");
 });
 it("requires adult contact and policy acknowledgment",()=>{
  const d=valid();d.delete("adultAck");d.delete("rulesAck");
  const result=parseCosplayEntry(d);
  assert.equal(result.ok,false);
  if(!result.ok)assert.ok(result.errors.adultAck&&result.errors.rulesAck);
 });
 it("requires guardian confirmation when minors participate",()=>{
  const d=valid();d.set("ageBand","teen");
  const failed=parseCosplayEntry(d);
  assert.equal(failed.ok,false);
  if(!failed.ok)assert.ok(failed.errors.guardianAck);
  d.set("guardianAck","on");
  const passed=parseCosplayEntry(d);
  assert.equal(passed.ok,true);
  if(passed.ok)assert.equal(passed.guardianConfirmed,true);
 });
 it("requires guardian confirmation for children under 13",()=>{
  const d=valid();d.set("ageBand","child");
  const result=parseCosplayEntry(d);
  assert.equal(result.ok,false);
  if(!result.ok)assert.ok(result.errors.guardianAck);
 });
 it("validates group size and entry type consistency",()=>{
  const d=valid();d.set("entryType","group");d.set("groupSize","1");
  const result=parseCosplayEntry(d);
  assert.equal(result.ok,false);
  if(!result.ok)assert.ok(result.errors.groupSize);
  d.set("groupSize","3");
  assert.equal(parseCosplayEntry(d).ok,true);
 });
 it("rejects invalid divisions and oversized answers",()=>{
  const d=valid();d.set("divisionPreference","best-in-show");
  d.set("buildNotes","x".repeat(4100));
  const result=parseCosplayEntry(d);
  assert.equal(result.ok,false);
  if(!result.ok)assert.ok(result.errors.divisionPreference&&result.errors.buildNotes);
 });
});
