import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createPriceSnapshot } from "../vendor-ops/pricing";
import { publicDirectoryFields } from "../vendor-ops/directory";
import { isEligibleForSponsorPublication, publicSponsorFields } from "../sponsor-ops/directory";
import { parseIdempotencyKey, isPersistedFormKind } from "./fields";

describe("price snapshot persistence shape", () => {
  it("locks founding or regular price at offer time", () => {
    const snapshot = createPriceSnapshot({
      offeredSpace: "standard10x10",
      extraBadges: 0,
      extraTables: 0,
      electricityRequested: false,
      offerIssuedAt: "2026-01-15T12:00:00.000Z",
    });
    assert.equal(snapshot.locked, true);
    assert.equal(typeof snapshot.total, "number");
    assert.equal(snapshot.spaceId, "standard10x10");
  });
});

describe("public private separation", () => {
  it("omits unpublished vendor directory profiles", () => {
    assert.equal(
      publicDirectoryFields({
        publishInDirectory: false,
        displayName: "Hidden",
        category: "Art",
        shortDescription: "n/a",
        logo: null,
        website: null,
        socialUrl: null,
      }),
      null,
    );
  });

  it("does not publish sponsors that are not active", () => {
    assert.equal(
      isEligibleForSponsorPublication({
        status: "paid",
        publicDirectoryEnabled: true,
      }),
      false,
    );
  });

  it("omits private contact fields from public sponsor cards", () => {
    const card = publicSponsorFields({
      publishInDirectory: true,
      displayName: "Shown",
      levelLabel: "Gold",
      packageId: "gold",
      logo: "/logo.png",
      website: "https://example.com",
      publicDescription: "Public blurb",
      publicSocialUrl: "https://example.com/social",
      sponsoredArea: "Artist Alley",
      featured: false,
      sortOrder: 1,
    });
    assert.ok(card);
    assert.equal("contactEmail" in card, false);
    assert.equal("contactPhone" in card, false);
    assert.equal(card.displayName, "Shown");
  });
});

describe("form persistence helpers", () => {
  it("persists vendor and sponsor operational forms", () => {
    assert.equal(isPersistedFormKind("vendor_interest"), true);
    assert.equal(isPersistedFormKind("sponsor_inquiry"), true);
    assert.equal(isPersistedFormKind("contact"), false);
  });

  it("accepts UUID idempotency keys only", () => {
    assert.equal(parseIdempotencyKey("not-a-uuid"), null);
    assert.match(
      parseIdempotencyKey("2c1a0d6a-4b3e-4a11-9c8d-1234567890ab") ?? "",
      /^2c1a0d6a-4b3e-4a11-9c8d-1234567890ab$/,
    );
  });
});
