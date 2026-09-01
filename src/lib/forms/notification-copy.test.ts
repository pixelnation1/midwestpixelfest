import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  operationalEmailSubject,
  operationalSourcePath,
} from "./notification-copy";

describe("operational email subjects", () => {
  it("uses the contact subject", () => {
    assert.equal(
      operationalEmailSubject("contact", {}),
      "[Midwest Pixel Fest] New Contact Message",
    );
  });

  it("sanitizes vendor interest business names in the subject", () => {
    assert.equal(
      operationalEmailSubject("vendor_interest", {
        businessName: "Pixel Games\r\nLLC",
      }),
      "[Midwest Pixel Fest] New Vendor Interest — Pixel Games LLC",
    );
  });

  it("uses sponsorship inquiry company names", () => {
    assert.equal(
      operationalEmailSubject("sponsor_inquiry", { company: "Arcade Co" }),
      "[Midwest Pixel Fest] New Sponsorship Inquiry — Arcade Co",
    );
  });

  it("uses vendor and artist application prefixes", () => {
    assert.equal(
      operationalEmailSubject("vendor_application", {
        applicationType: "Vendor Hall",
        businessName: "Pixel Games LLC",
      }),
      "[MPF 2027 Vendor Application] Pixel Games LLC",
    );
    assert.equal(
      operationalEmailSubject("vendor_application", {
        applicationType: "Artist Alley",
        businessName: "Neon Ink",
      }),
      "[MPF 2027 Artist Application] Neon Ink",
    );
  });
});

describe("operational source paths", () => {
  it("maps form kinds to public routes", () => {
    assert.equal(operationalSourcePath("contact"), "/contact");
    assert.equal(operationalSourcePath("vendor_interest"), "/vendors/interest");
    assert.equal(
      operationalSourcePath("vendor_application", { applicationType: "Artist Alley" }),
      "/vendors/apply/artist",
    );
    assert.equal(operationalSourcePath("sponsor_inquiry"), "/sponsors/inquiry");
  });
});
