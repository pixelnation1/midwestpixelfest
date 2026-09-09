import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAndValidate } from "./parse";
import { parseVendorApplication } from "./vendor-application";
import { operationalEmailSubject, operationalSourcePath } from "./notification-copy";
import { OFFICIAL_APPLICATION_TYPES } from "../vendor-application";
import {
  COSPLAY_PRIMARY_CATEGORY,
  VENDOR_APPLICANT_TYPES,
  VENDOR_PRIMARY_CATEGORIES,
  applicantTypeAnalyticsId,
  artistApplicationsOpen,
  cosplayVendorApplicationsOpen,
  showsCosplayVendorFields,
  spacesForApplicationType,
  vendorApplicationsOpen,
  vendorPricing,
  vendorSpaces,
} from "../vendors";

function interestForm(overrides: Record<string, string | string[]> = {}): FormData {
  const form = new FormData();
  form.set("kind", "vendor_interest");
  form.set("contactName", "Alex Rivera");
  form.set("businessName", "Pixel Prints");
  form.set("email", "alex@example.com");
  form.set("vendorType", "Vendor");
  form.set("vendorCategory", "Art / Prints");
  form.set("whatYouSell", "Original prints and stickers.");
  form.set("notifyApplications", "on");
  form.set("contactConsent", "on");
  for (const [key, value] of Object.entries(overrides)) {
    if (Array.isArray(value)) {
      form.delete(key);
      for (const item of value) form.append(key, item);
    } else {
      form.set(key, value);
    }
  }
  return form;
}

describe("cosplay vendor pathway", () => {
  it("keeps applications closed and does not change listed prices", () => {
    assert.equal(vendorApplicationsOpen, false);
    assert.equal(artistApplicationsOpen, false);
    assert.equal(cosplayVendorApplicationsOpen, false);
    assert.equal(vendorPricing.artistAlley.founding, 75);
    assert.equal(vendorPricing.artistAlley.regular, 100);
    assert.equal(vendorPricing.standard10x10.founding, 175);
    assert.equal(vendorPricing.standard10x10.regular, 200);
    assert.equal(vendorPricing.corner10x10.regular, 250);
    assert.equal(vendorPricing.double10x20.regular, 375);
    assert.equal(vendorPricing.premiumDoubleCorner10x20.regular, 450);
    assert.equal(vendorSpaces.length, 5);
  });

  it("adds Cosplay Creator / Vendor to interest and official application types", () => {
    assert.deepEqual([...VENDOR_APPLICANT_TYPES], [
      "Vendor",
      "Artist Alley",
      "Cosplay Creator / Vendor",
      "Not Sure",
    ]);
    assert.ok(VENDOR_PRIMARY_CATEGORIES.includes(COSPLAY_PRIMARY_CATEGORY));
    assert.deepEqual([...OFFICIAL_APPLICATION_TYPES], [
      "Vendor Hall",
      "Artist Alley",
      "Cosplay Creator / Vendor",
    ]);
    assert.equal((OFFICIAL_APPLICATION_TYPES as readonly string[]).includes("Not Sure"), false);
    assert.equal(applicantTypeAnalyticsId("Cosplay Creator / Vendor"), "cosplay_creator_vendor");
    assert.equal(showsCosplayVendorFields("Cosplay Creator / Vendor", "Art / Prints"), true);
    assert.equal(showsCosplayVendorFields("Vendor", COSPLAY_PRIMARY_CATEGORY), true);
    assert.equal(showsCosplayVendorFields("Vendor", "Art / Prints"), false);
  });

  it("lets cosplay creator applicants choose existing Artist Alley and Vendor Hall spaces", () => {
    const artist = spacesForApplicationType("Artist Alley").map((space) => space.id);
    const hall = spacesForApplicationType("Vendor Hall").map((space) => space.id);
    const cosplay = spacesForApplicationType("Cosplay Creator / Vendor").map((space) => space.id);
    assert.deepEqual(artist, ["artistAlley"]);
    assert.equal(hall.includes("artistAlley"), false);
    assert.deepEqual(cosplay, vendorSpaces.map((space) => space.id));
    assert.ok(cosplay.includes("artistAlley"));
    assert.ok(cosplay.includes("standard10x10"));
    assert.ok(cosplay.includes("premiumDoubleCorner10x20"));
  });

  it("accepts Cosplay Creator / Vendor interest with product types", () => {
    const result = parseAndValidate(
      interestForm({
        vendorType: "Cosplay Creator / Vendor",
        vendorCategory: COSPLAY_PRIMARY_CATEGORY,
        cosplaySellTypes: ["Props", "Prints / signed prints"],
        socialPlatforms: ["Instagram", "TikTok"],
        programmingInterest: "Maybe",
      }),
    );
    assert.equal(result.ok, true);
    if (!result.ok || result.spam) throw new Error("expected a valid interest submission");
    assert.equal(result.data.fields.vendorType, "Cosplay Creator / Vendor");
    assert.deepEqual(result.data.fields.cosplaySellTypes, ["Props", "Prints / signed prints"]);
    assert.equal(result.data.fields.programmingInterest, "Maybe");
  });

  it("still accepts ordinary Vendor and Artist Alley interest", () => {
    const vendor = parseAndValidate(interestForm());
    assert.equal(vendor.ok, true);
    const artist = parseAndValidate(
      interestForm({
        vendorType: "Artist Alley",
        vendorCategory: "Handmade / Maker",
      }),
    );
    assert.equal(artist.ok, true);
  });

  it("requires product types when cosplay fields are shown", () => {
    const result = parseAndValidate(
      interestForm({
        vendorType: "Cosplay Creator / Vendor",
        vendorCategory: "Art / Prints",
      }),
    );
    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected validation failure");
    assert.match(result.fieldErrors.cosplaySellTypes ?? "", /at least one option/);
  });

  it("keeps official cosplay applications closed and does not skip Vendor Hall validation", () => {
    const form = new FormData();
    form.set("applicationType", "Cosplay Creator / Vendor");
    const parsed = parseVendorApplication(form);
    assert.match(
      parsed.errors.applicationType ?? "",
      /Cosplay Creator \/ Vendor applications are not open yet/,
    );

    const hall = new FormData();
    hall.set("applicationType", "Vendor Hall");
    const hallParsed = parseVendorApplication(hall);
    assert.match(hallParsed.errors.applicationType ?? "", /Vendor Hall applications are not open yet/);
    assert.equal(hallParsed.errors.inventoryTypes, "Choose at least one inventory type.");
  });

  it("labels cosplay vendor emails without calling them guests", () => {
    assert.equal(
      operationalEmailSubject("vendor_application", {
        applicationType: "Cosplay Creator / Vendor",
        businessName: "Pixel Prints",
      }),
      "[MPF 2027 Cosplay Vendor Application] Pixel Prints",
    );
    assert.equal(
      operationalSourcePath("vendor_application", {
        applicationType: "Cosplay Creator / Vendor",
      }),
      "/vendors/apply/cosplay",
    );
    assert.equal(
      operationalEmailSubject("vendor_interest", { businessName: "Pixel Prints" }),
      "[Midwest Pixel Fest] New Vendor Interest — Pixel Prints",
    );
  });
});
