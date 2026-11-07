import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { floorPinType, parsePercent, validMapKey, validMapUpload } from "./model";

describe("event floor map input validation",()=>{
 it("accepts percentages within image bounds",()=>{
  assert.equal(parsePercent("0"),0);
  assert.equal(parsePercent("100"),100);
  assert.equal(parsePercent("34.52"),34.52);
 });
 it("rejects negative, oversized, nonnumeric and overly precise positions",()=>{
  for(const value of ["-1","100.01","12.345","NaN","","1e2","10px"])
   assert.equal(parsePercent(value),null);
 });
 it("accepts known map zones only",()=>{
  assert.equal(floorPinType("tabletop"),true);
  assert.equal(floorPinType("entrance"),true);
  assert.equal(floorPinType("admin"),false);
 });
 it("enforces simple lowercase section keys",()=>{
  assert.equal(validMapKey("main-hall"),true);
  assert.equal(validMapKey("lobby-a"),true);
  assert.equal(validMapKey("lobby a"),false);
  assert.equal(validMapKey("../bad"),false);
 });
 it("rejects non-images and oversized floor plans",()=>{
  const badType=new File(["hello"],"floor.txt",{type:"text/plain"});
  assert.ok(validMapUpload(badType));
  const empty=new File([],"empty.png",{type:"image/png"});
  assert.ok(validMapUpload(empty));
  const tooBig=new File([new Uint8Array(3*1024*1024+1)],"huge.png",{type:"image/png"});
  assert.ok(validMapUpload(tooBig));
 });
});
