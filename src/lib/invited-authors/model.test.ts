import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canPublishInvitedAuthor,validAuthorEmail,validAuthorStatus,
} from "./model";

const valid={
  authorConfirmed:true,guestContracted:true,guestPublished:true,
  approval:true,hasName:true,hasBio:true,
};

describe("invited author publication gate",()=>{
 it("requires agreement, guest contract, publication and approval",()=>{
  assert.equal(canPublishInvitedAuthor(valid),true);
  for(const key of Object.keys(valid) as (keyof typeof valid)[]){
   assert.equal(canPublishInvitedAuthor({...valid,[key]:false}),false,key);
  }
 });
 it("accepts only known invitation statuses",()=>{
  assert.equal(validAuthorStatus("interested"),true);
  assert.equal(validAuthorStatus("confirmed"),true);
  assert.equal(validAuthorStatus("vendor_confirmed"),false);
 });
 it("validates optional email addresses",()=>{
  assert.equal(validAuthorEmail(null),true);
  assert.equal(validAuthorEmail("author@example.com"),true);
  assert.equal(validAuthorEmail("not-an-email"),false);
  assert.equal(validAuthorEmail("a".repeat(256)+"@example.com"),false);
 });
});
