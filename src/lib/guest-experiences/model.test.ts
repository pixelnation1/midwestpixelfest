import assert from "node:assert/strict";
import {describe,it} from "node:test";
import {
  dollarsToCents,centsToDollars,formatGuestPrice,
  validGuestSlug,validGuestTime,validGuestEventDate,validSessionType,
} from "./model";

describe("guest autograph and photo-op input validation",()=>{
 it("accepts valid USD prices and blank pending prices",()=>{
  assert.equal(dollarsToCents(""),null);
  assert.equal(dollarsToCents("0"),0);
  assert.equal(dollarsToCents("35"),3500);
  assert.equal(dollarsToCents("49.99"),4999);
  assert.equal(centsToDollars(4999),"49.99");
  assert.equal(formatGuestPrice(null),"Price to be announced");
 });
 it("rejects unsafe or malformed prices",()=>{
  for(const raw of ["-1","35.999","$25","NaN","1000.01","1e2","123456789"]) {
    assert.equal(dollarsToCents(raw),undefined);
  }
 });
 it("accepts only 2027 festival dates and properly formatted times",()=>{
  assert.equal(validGuestEventDate("2027-10-16"),true);
  assert.equal(validGuestEventDate("2027-10-17"),true);
  assert.equal(validGuestEventDate("2027-10-18"),false);
  assert.equal(validGuestTime("09:30"),true);
  assert.equal(validGuestTime("24:00"),false);
 });
 it("rejects unsafe guest slugs and invalid experience types",()=>{
  assert.equal(validGuestSlug("guest-performer"),true);
  assert.equal(validGuestSlug("../secret"),false);
  assert.equal(validGuestSlug("Guest Name"),false);
  assert.equal(validSessionType("autograph"),true);
  assert.equal(validSessionType("photo_op"),true);
  assert.equal(validSessionType("private_dinner"),false);
 });
});
