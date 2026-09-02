import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPackageById } from "../sponsorships";
import { isEligibleForSponsorPublication, publicSponsorFields } from "./directory";
import { createFulfillmentChecklist, setFulfillmentStatus } from "./fulfillment";
import { listedPackagePrice, createCommitmentSnapshot } from "./snapshot";
import {
  activateSponsor,
  allowedNextStatuses,
  allowedOrganizerStatusChoices,
  canTransition,
  commitSponsorship,
  createInquiryRecord,
  createSponsorInvoice,
  markSponsorContacted,
  markSponsorInvoiceSent,
  markSponsorNegotiating,
  recordSponsorshipPayment,
  recordSponsorAssetsReceived,
} from "./workflow";

function negotiatingSponsor() {
  return markSponsorNegotiating(
    markSponsorContacted(
      createInquiryRecord({
        businessName: "Example Company",
        contactName: "Alex",
        contactEmail: "alex@example.com",
        reference: "MPF-S-ABCDEF",
      }),
    ),
  );
}

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

  it("creates a commitment snapshot once and moves negotiating to committed", () => {
    const record = commitSponsorship(negotiatingSponsor(), {
      packageId: "community",
      paymentDueAt: "2026-09-20",
    });
    assert.equal(record.status, "committed");
    assert.equal(record.amountCommitted, 250);
    assert.equal(record.commitment?.packageId, "community");
    assert.equal(record.commitment?.packageName, "Community Sponsor");
    assert.ok(record.committedAt);
    assert.equal(record.history.at(-1)?.status, "committed");
    assert.ok(record.history.some((entry) => entry.status === "negotiating"));

    const second = commitSponsorship(record, {
      packageId: "gold",
      agreedAmount: 2500,
      paymentDueAt: "2026-10-01",
    });
    assert.equal(second.status, "committed");
    assert.equal(second.commitment, record.commitment);
    assert.equal(second.commitment?.packageId, "community");
    assert.equal(second.amountCommitted, 250);
  });

  it("syncs committed status from an existing snapshot without replacing it", () => {
    const snapshot = createCommitmentSnapshot({
      sponsorReference: "MPF-S-ABCDEF",
      businessName: "Example Company",
      packageId: "community",
      agreedAmount: 250,
      committedAt: "2026-09-02T12:00:00.000Z",
      paymentDueAt: "2026-09-20",
    });
    const stuck = { ...negotiatingSponsor(), commitment: snapshot };
    const synced = commitSponsorship(stuck, {
      packageId: "gold",
      agreedAmount: 2500,
      paymentDueAt: "2026-10-01",
    });
    assert.equal(synced.status, "committed");
    assert.equal(synced.commitment, snapshot);
    assert.equal(synced.commitment?.packageId, "community");
    assert.equal(synced.amountCommitted, 250);
    assert.equal(synced.selectedLevel, "Community Sponsor");
    assert.equal(synced.history.at(-1)?.status, "committed");
  });

  it("creates an invoice only from committed, then sent, then paid without activating", () => {
    const committed = commitSponsorship(negotiatingSponsor(), {
      packageId: "community",
      paymentDueAt: "2026-09-20",
    });
    const invoiced = createSponsorInvoice(committed);
    assert.equal(invoiced.status, "invoice_created");
    assert.equal(invoiced.invoice.status, "created");
    assert.ok(invoiced.invoiceCreatedAt);
    assert.equal(invoiced.history.at(-1)?.status, "invoice_created");

    const sent = markSponsorInvoiceSent(invoiced);
    assert.equal(sent.status, "invoice_sent");
    assert.equal(sent.invoice.status, "sent");
    assert.ok(sent.invoiceSentAt);
    assert.equal(sent.history.at(-1)?.status, "invoice_sent");

    const paid = recordSponsorshipPayment(sent, { amountPaid: 250 });
    assert.equal(paid.status, "paid");
    assert.equal(paid.invoice.status, "paid");
    assert.equal(paid.amountPaid, 250);
    assert.ok(paid.paidAt);
    assert.equal(paid.history.at(-1)?.status, "paid");
  });

  it("rejects invoice creation and payment from earlier states", () => {
    const negotiating = negotiatingSponsor();
    assert.throws(
      () => createSponsorInvoice(negotiating),
      /Current sponsorship status is negotiating\. Create the commitment before creating an invoice\./,
    );
    assert.throws(
      () => recordSponsorshipPayment(negotiating, { amountPaid: 250 }),
      /Current sponsorship status is negotiating\. Create the commitment before recording payment\./,
    );

    const stuck = {
      ...negotiating,
      commitment: createCommitmentSnapshot({
        sponsorReference: "MPF-S-ABCDEF",
        businessName: "Example Company",
        packageId: "community",
        committedAt: "2026-09-02T12:00:00.000Z",
        paymentDueAt: "2026-09-20",
      }),
    };
    assert.throws(
      () => createSponsorInvoice(stuck),
      /Commitment exists but sponsorship status is negotiating\./,
    );
  });

  it("offers status selector choices from the current persisted status", () => {
    assert.deepEqual([...allowedNextStatuses("committed")], ["invoice_created", "withdrawn", "declined"]);
    const committedChoices = allowedOrganizerStatusChoices("committed", true);
    assert.ok(committedChoices.includes("invoice_created"));
    assert.equal(committedChoices.includes("contacted"), false);
    assert.deepEqual(
      [...allowedOrganizerStatusChoices("invoice_created", true)],
      ["invoice_sent", "cancelled", "withdrawn"],
    );
    assert.equal(allowedOrganizerStatusChoices("negotiating", false).includes("committed"), false);
    assert.ok(allowedOrganizerStatusChoices("negotiating", true).includes("committed"));
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
