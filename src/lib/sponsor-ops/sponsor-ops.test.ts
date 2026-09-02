import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPackageById } from "../sponsorships";
import { isEligibleForSponsorPublication, publicSponsorFields } from "./directory";
import { createFulfillmentChecklist, setFulfillmentStatus } from "./fulfillment";
import { listedPackagePrice, createCommitmentSnapshot } from "./snapshot";
import { canTransition } from "./workflow";
import {
  activateSponsor,
  commitSponsorship,
  createInquiryRecord,
  createSponsorInvoice,
  markSponsorContacted,
  markSponsorInvoiceSent,
  markSponsorNegotiating,
  recordSponsorshipPayment,
  recordSponsorAssetsReceived,
} from "./workflow";

describe("package price lookup", () => {
  it("reads listed prices from centralized sponsorship config", () => {
    assert.equal(getPackageById("community")?.price, 250);
    assert.equal(getPackageById("bronze")?.price, 500);
    assert.equal(getPackageById("silver")?.price, 1000);
    assert.equal(getPackageById("gold")?.price, 2500);
    assert.equal(getPackageById("presenting")?.price, 5000);
    assert.equal(getPackageById("custom")?.price, null);
    assert.equal(listedPackagePrice("gold"), 2500);
  });
});

describe("commitment snapshots", () => {
  it("locks the Gold package price at commitment time", () => {
    const snapshot = createCommitmentSnapshot({
      sponsorReference: "MPF-S-ABCDEF",
      businessName: "Example Company",
      packageId: "gold",
      committedAt: "2026-09-02T12:00:00-05:00",
      paymentDueAt: "2026-09-16",
    });
    assert.equal(snapshot.agreedAmount, 2500);
    assert.equal(snapshot.packageName, "Gold Sponsor");
    assert.equal(snapshot.locked, true);
    assert.ok(snapshot.includedBenefits.length > 0);
    assert.equal(snapshot.exclusivity.granted, false);
  });

  it("requires an agreed amount for custom sponsorships", () => {
    assert.throws(() =>
      createCommitmentSnapshot({
        sponsorReference: "MPF-S-ABCDEF",
        businessName: "Example Company",
        packageId: "custom",
        committedAt: "2026-09-02T12:00:00-05:00",
        paymentDueAt: null,
      }),
    );
  });

  it("stores a custom agreed amount without treating it as a public package price", () => {
    const snapshot = createCommitmentSnapshot({
      sponsorReference: "MPF-S-ABCDEF",
      businessName: "Example Company",
      packageId: "custom",
      agreedAmount: 1800,
      committedAt: "2026-09-02T12:00:00-05:00",
      paymentDueAt: "2026-10-01",
      customBenefits: [
        {
          id: "area-1",
          type: "cosplay_sponsorship",
          label: "Cosplay sponsorship",
          description: "Approved cosplay area support",
        },
      ],
    });
    assert.equal(snapshot.agreedAmount, 1800);
    assert.equal(snapshot.customBenefits.length, 1);
    assert.equal(snapshot.customBenefits[0]?.organizerApproved, true);
  });
});

describe("status transitions", () => {
  it("does not treat an inquiry as a commitment or active sponsor", () => {
    assert.equal(canTransition("inquiry_received", "committed"), false);
    assert.equal(canTransition("inquiry_received", "active"), false);
    assert.equal(canTransition("inquiry_received", "paid"), false);
    assert.equal(canTransition("negotiating", "committed"), true);
  });

  it("moves inquiry through commitment, invoice, payment, assets, and activation", () => {
    let record = createInquiryRecord({
      businessName: "Example Company",
      contactName: "Alex",
      contactEmail: "alex@example.com",
      reference: "MPF-S-ABCDEF",
    });
    assert.equal(record.status, "inquiry_received");
    assert.equal(record.commitment, null);

    record = markSponsorContacted(record);
    record = markSponsorNegotiating(record);
    record = commitSponsorship(record, {
      packageId: "silver",
      paymentDueAt: "2026-09-20",
    });
    assert.equal(record.status, "committed");
    assert.equal(record.amountCommitted, 1000);
    assert.equal(record.commitment?.agreedAmount, 1000);

    record = createSponsorInvoice(record);
    record = markSponsorInvoiceSent(record);
    record = recordSponsorshipPayment(record, { amountPaid: 1000 });
    assert.equal(record.status, "paid");
    assert.equal(isEligibleForSponsorPublication(record), false);

    record = recordSponsorAssetsReceived(record, {
      publicBusinessName: "Example Company",
      website: "https://example.com",
      publicDescription: "A Midwest business supporting the fest.",
      marketingContactName: "Alex",
      marketingContactEmail: "alex@example.com",
      preferredPublicUrl: "https://example.com",
    });
    assert.equal(record.status, "assets_received");

    record = activateSponsor(record, { publishInDirectory: true });
    assert.equal(record.status, "active");
    assert.equal(isEligibleForSponsorPublication(record), true);
  });
});

describe("public and private sponsor data", () => {
  it("omits private contact and invoice fields from public cards", () => {
    const publicCard = publicSponsorFields({
      publishInDirectory: true,
      displayName: "Example Company",
      levelLabel: "Gold Sponsor",
      packageId: "gold",
      logo: "/sponsors/example.svg",
      website: "https://example.com",
      publicDescription: "Public blurb",
      publicSocialUrl: "https://instagram.com/example",
      sponsoredArea: "Cosplay",
      featured: false,
      sortOrder: 1,
    });
    assert.ok(publicCard);
    assert.equal("contactEmail" in publicCard, false);
    assert.equal("contactPhone" in publicCard, false);
    assert.equal("amountPaid" in publicCard, false);
    assert.equal(publicCard.displayName, "Example Company");
  });
});

describe("benefit fulfillment", () => {
  it("creates a simple checklist from a commitment snapshot", () => {
    const snapshot = createCommitmentSnapshot({
      sponsorReference: "MPF-S-ABCDEF",
      businessName: "Example Company",
      packageId: "gold",
      committedAt: "2026-09-02T12:00:00-05:00",
      paymentDueAt: "2026-09-20",
    });
    const checklist = createFulfillmentChecklist(snapshot);
    assert.ok(checklist.some((item) => item.id === "website_recognition"));
    assert.ok(checklist.every((item) => item.status === "not_started"));
    const updated = setFulfillmentStatus(checklist, "dedicated_social_post", "planned");
    assert.equal(
      updated.find((item) => item.id === "dedicated_social_post")?.status,
      "planned",
    );
  });
});
