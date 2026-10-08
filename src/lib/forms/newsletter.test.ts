import assert from "node:assert/strict";
import { test } from "node:test";
import { deliverNewsletterSignup, getNewsletterProvider } from "./newsletter";

const payload = { kind: "newsletter" as const, submittedAt: "2026-10-08T20:00:00.000Z", fields: { email: " Visitor@Example.com ", firstName: "Alex", updatesConsent: "yes" } };

test("newsletter provider saves consent, preserves duplicates, and reports failures", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  t.after(() => { globalThis.fetch = originalFetch; process.env = originalEnv; });
  delete process.env.NEWSLETTER_WEBHOOK_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  assert.equal(getNewsletterProvider().id, "none");
  assert.deepEqual(await deliverNewsletterSignup(payload), { ok: false, code: "not_configured" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://newsletter-test.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-placeholder";
  let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++;
    assert.match(String(input), /newsletter_subscribers\?on_conflict=email/);
    assert.match(new Headers(init?.headers).get("prefer") ?? "", /resolution=ignore-duplicates/);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.email, "visitor@example.com");
    assert.equal(body.consent, true);
    assert.equal(body.consented_at, payload.submittedAt);
    assert.equal(body.consent_text, "I want updates about Midwest Pixel Fest.");
    assert.equal(body.status, "subscribed");
    return new Response(null, { status: 201 });
  };
  assert.equal(getNewsletterProvider().id, "supabase");
  assert.deepEqual(await deliverNewsletterSignup(payload), { ok: true });
  assert.equal(calls, 1);
  assert.deepEqual(await deliverNewsletterSignup({ ...payload, fields: { ...payload.fields, updatesConsent: "no" } }), { ok: false, code: "delivery_failed" });
  assert.deepEqual(await deliverNewsletterSignup({ ...payload, fields: { ...payload.fields, email: "invalid" } }), { ok: false, code: "delivery_failed" });
  assert.equal(calls, 1);
  globalThis.fetch = async () => new Response(JSON.stringify({ message: "unavailable" }), { status: 500 });
  assert.deepEqual(await deliverNewsletterSignup(payload), { ok: false, code: "delivery_failed" });
  globalThis.fetch = async () => { throw new Error("offline"); };
  assert.deepEqual(await deliverNewsletterSignup(payload), { ok: false, code: "delivery_failed" });
  process.env.NEWSLETTER_WEBHOOK_URL = "https://example.com/newsletter";
  assert.equal(getNewsletterProvider().id, "webhook");
  globalThis.fetch = async (input) => {
    assert.equal(String(input), process.env.NEWSLETTER_WEBHOOK_URL);
    return new Response(null, { status: 503 });
  };
  assert.deepEqual(await deliverNewsletterSignup(payload), { ok: false, code: "delivery_failed" });
});
