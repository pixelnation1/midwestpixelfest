import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePanelSubmission } from "./schema";

function valid(): FormData {
  const form = new FormData();
  Object.entries({
    contactName: "Test Speaker", email: "test@example.com",
    panelTitle: "Arcade Community Stories",
    topicCategory: "Video Games & Retro Gaming",
    panelFormat: "Panel Discussion",
    durationMinutes: "45",
    description: "An engaging panel about gaming history and community.",
    audience: "All Ages", estimatedAttendance: "25–50",
    contactConsent: "on", panelAck: "on",
  }).forEach(([key, value]) => form.set(key,value));
  return form;
}
describe("panel submission validation", () => {
  it("accepts a valid proposal", () => {
    const parsed=parsePanelSubmission(valid());
    assert.equal(parsed.ok,true);
    if(parsed.ok) assert.equal(parsed.fields.panelTitle,"Arcade Community Stories");
  });
  it("rejects unsupported durations", () => {
    const form=valid();form.set("durationMinutes","35");
    const parsed=parsePanelSubmission(form);
    assert.equal(parsed.ok,false);
    if(!parsed.ok) assert.ok(parsed.errors.durationMinutes);
  });
  it("requires consent and acknowledgment", () => {
    const form=valid();form.delete("panelAck");form.delete("contactConsent");
    const parsed=parsePanelSubmission(form);
    assert.equal(parsed.ok,false);
    if(!parsed.ok) assert.ok(parsed.errors.panelAck && parsed.errors.contactConsent);
  });
  it("rejects invalid category and oversized notes", () => {
    const form=valid();form.set("topicCategory","Bogus");form.set("avNeeds","a".repeat(4100));
    const parsed=parsePanelSubmission(form);
    assert.equal(parsed.ok,false);
    if(!parsed.ok) assert.ok(parsed.errors.topicCategory && parsed.errors.avNeeds);
  });
});
