import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { vendorPricing } from "../vendors";
import { isEligibleForDirectoryPublication } from "./directory";
import { createPriceSnapshot, liveSpacePrice } from "./pricing";
import { refundPercentForCalendarDate } from "./refunds";
import {
  applyStatus,
  approveApplication,
  canTransition,
  createSubmittedRecord,
  effectivePaymentDueOn,
  extendPaymentDeadline,
  recordPaymentReceived,
} from "./workflow";

describe("founding price snapshots", () => {
  it("uses Founding Vendor Rate when the offer is issued before the deadline", () => {
    const snapshot = createPriceSnapshot({
      offeredSpace: "standard10x10",
      extraBadges: 1,
      extraTables: 0,
      electricityRequested: false,
      offerIssuedAt: "2027-04-29T12:00:00-05:00",
    });
    assert.equal(snapshot.pricingTier, "founding");
    assert.equal(snapshot.basePrice, vendorPricing.standard10x10.founding);
    assert.equal(snapshot.total, vendorPricing.standard10x10.founding + vendorPricing.extraBadge);
    assert.equal(snapshot.paymentDueOn, "2027-05-06");
    assert.equal(snapshot.locked, true);
  });

  it("keeps the locked Founding rate after the Founding deadline during the payment window", () => {
    const snapshot = createPriceSnapshot({
      offeredSpace: "standard10x10",
      extraBadges: 0,
      extraTables: 0,
      electricityRequested: false,
      offerIssuedAt: "2027-04-29T18:00:00-05:00",
    });
    const liveAfterDeadline = liveSpacePrice("standard10x10", "2027-05-01");
    assert.equal(liveAfterDeadline.tier, "regular");
    assert.equal(liveAfterDeadline.price, vendorPricing.standard10x10.regular);
    assert.equal(snapshot.pricingTier, "founding");
    assert.equal(snapshot.basePrice, vendorPricing.standard10x10.founding);
    assert.equal(snapshot.paymentDueOn, "2027-05-06");
  });

  it("uses regular pricing for offers issued after the Founding deadline", () => {
    const snapshot = createPriceSnapshot({
      offeredSpace: "standard10x10",
      extraBadges: 0,
      extraTables: 0,
      electricityRequested: false,
      offerIssuedAt: "2027-05-01T09:00:00-05:00",
    });
    assert.equal(snapshot.pricingTier, "regular");
    assert.equal(snapshot.basePrice, vendorPricing.standard10x10.regular);
  });

  it("does not assign a Founding rate to Premium Double Corner", () => {
    const snapshot = createPriceSnapshot({
      offeredSpace: "premiumDoubleCorner10x20",
      extraBadges: 0,
      extraTables: 0,
      electricityRequested: false,
      offerIssuedAt: "2027-04-15T12:00:00-05:00",
    });
    assert.equal(snapshot.pricingTier, "regular");
    assert.equal(snapshot.basePrice, vendorPricing.premiumDoubleCorner10x20.regular);
    assert.equal(snapshot.electricityPrice, null);
  });
});

describe("payment deadlines", () => {
  it("sets payment due seven calendar days after the offer date", () => {
    const snapshot = createPriceSnapshot({
      offeredSpace: "artistAlley",
      extraBadges: 0,
      extraTables: 0,
      electricityRequested: false,
      offerIssuedAt: "2027-09-01T10:00:00-05:00",
    });
    assert.equal(snapshot.offerIssuedOn, "2027-09-01");
    assert.equal(snapshot.paymentDueOn, "2027-09-08");
  });

  it("supports a payment deadline override without changing the locked price", () => {
    let record = createSubmittedRecord({
      reference: "MPF-TEST01",
      applicationType: "Vendor Hall",
      requestedSpace: "corner10x10",
      displayName: "Test Vendor",
    });
    record = applyStatus(record, "under_review", "organizer");
    record = approveApplication(
      record,
      {
        businessName: "Test Vendor",
        requestedSpace: "corner10x10",
        offeredSpace: "standard10x10",
        extraBadges: 0,
        extraTables: 0,
        electricityRequested: false,
        offerIssuedAt: "2027-09-01T12:00:00-05:00",
      },
      "organizer",
    );
    assert.ok(record.offer);
    assert.equal(record.offer.requestedSpace, "corner10x10");
    assert.equal(record.offer.offeredSpace, "standard10x10");
    assert.notEqual(record.offer.requestedSpace, record.offer.offeredSpace);
    assert.equal(effectivePaymentDueOn(record.offer), "2027-09-08");

    const originalTotal = record.offer.snapshot.total;
    record = extendPaymentDeadline(
      record,
      "2027-09-15",
      "Vendor travel delay",
      "organizer",
      "2027-09-07T12:00:00-05:00",
    );
    assert.equal(effectivePaymentDueOn(record.offer!), "2027-09-15");
    assert.equal(record.offer!.paymentDeadlineOverride?.originalDueOn, "2027-09-08");
    assert.equal(record.offer!.snapshot.total, originalTotal);
  });
});

describe("refund schedule", () => {
  it("returns 75% through July 31, 2027", () => {
    assert.equal(refundPercentForCalendarDate("2027-07-20"), 75);
    assert.equal(refundPercentForCalendarDate("2027-07-31"), 75);
  });

  it("returns 50% from August 1 through September 15, 2027", () => {
    assert.equal(refundPercentForCalendarDate("2027-08-01"), 50);
    assert.equal(refundPercentForCalendarDate("2027-08-20"), 50);
    assert.equal(refundPercentForCalendarDate("2027-09-15"), 50);
  });

  it("returns 0% after September 15, 2027", () => {
    assert.equal(refundPercentForCalendarDate("2027-09-16"), 0);
    assert.equal(refundPercentForCalendarDate("2027-10-01"), 0);
  });
});

describe("confirmation rules", () => {
  it("does not treat approval as confirmation and only confirms after payment", () => {
    let record = createSubmittedRecord({
      reference: "MPF-TEST02",
      applicationType: "Artist Alley",
      requestedSpace: "artistAlley",
      displayName: "Test Artist",
    });
    record = applyStatus(record, "under_review", "organizer");
    record = approveApplication(
      record,
      {
        businessName: "Test Artist",
        requestedSpace: "artistAlley",
        offeredSpace: "artistAlley",
        extraBadges: 0,
        extraTables: 0,
        electricityRequested: false,
        offerIssuedAt: "2027-06-01T12:00:00-05:00",
      },
      "organizer",
    );
    assert.equal(record.status, "approved");
    assert.equal(record.offer?.confirmedAt, null);
    assert.equal(isEligibleForDirectoryPublication({
      status: record.status,
      publishInDirectory: true,
    }), false);
    assert.equal(canTransition("approved", "confirmed"), false);

    assert.throws(() => applyStatus(record, "confirmed", "organizer"));

    record = recordPaymentReceived(record, {
      paidAt: "2027-06-03T15:00:00-05:00",
      amountPaid: record.offer!.snapshot.total,
    });
    assert.equal(record.status, "confirmed");
    assert.ok(record.offer?.confirmedAt);
    assert.equal(record.offer?.invoice.status, "paid");
    assert.equal(
      isEligibleForDirectoryPublication({
        status: record.status,
        publishInDirectory: true,
      }),
      true,
    );
    assert.equal(
      isEligibleForDirectoryPublication({
        status: record.status,
        publishInDirectory: false,
      }),
      false,
    );
  });
});
