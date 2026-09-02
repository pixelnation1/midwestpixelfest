import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAdminRole, isOrganizerAuthorized } from "./authorization";
import { formatAdminDateTime } from "./time";
import { organizerActionError } from "./safe-error";

describe("organizer authorization", () => {
  it("accepts owner, admin, and staff roles", () => {
    assert.equal(isAdminRole("owner"), true);
    assert.equal(isAdminRole("admin"), true);
    assert.equal(isAdminRole("staff"), true);
    assert.equal(isAdminRole("visitor"), false);
  });

  it("requires an active authorized organizer", () => {
    assert.equal(
      isOrganizerAuthorized({ userId: "abc", role: "admin", active: true }),
      true,
    );
    assert.equal(
      isOrganizerAuthorized({ userId: "abc", role: "admin", active: false }),
      false,
    );
    assert.equal(
      isOrganizerAuthorized({ userId: null, role: "admin", active: true }),
      false,
    );
  });
});

describe("admin timestamps", () => {
  it("formats Chicago time without a raw ISO string", () => {
    const formatted = formatAdminDateTime("2026-09-02T12:36:00.000Z");
    assert.equal(formatted.includes("T12:36"), false);
    assert.equal(formatted.includes("CT"), true);
  });
});

describe("organizer action errors", () => {
  it("keeps workflow messages and hides database errors", () => {
    assert.equal(
      organizerActionError(new Error("Cannot change status from submitted to confirmed."), "Could not update status."),
      "Cannot change status from submitted to confirmed.",
    );
    assert.equal(
      organizerActionError(new Error("permission denied for table vendor_applications"), "Could not update status."),
      "Could not update status.",
    );
  });
});
