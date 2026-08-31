# Forms and email delivery

Midwest Pixel Fest forms use Next.js Server Actions (`src/app/actions/forms.ts`).
Nothing is stored in a database. Delivery is environment-driven.

If no provider is configured for that form type, the form **does not pretend to succeed**.

## What exists today

| Form | Route | Kind | Delivery |
| --- | --- | --- | --- |
| Newsletter | Homepage, Tickets, News, Travel, FAQ | `newsletter` | `NEWSLETTER_WEBHOOK_URL` only |
| Contact | `/contact` | `contact` | Resend and/or `FORM_WEBHOOK_URL` |
| Vendor interest | `/vendors/interest` | `vendor_interest` | Resend and/or `FORM_WEBHOOK_URL` |
| Sponsor inquiry | `/sponsors/inquiry` | `sponsor_inquiry` | Resend and/or `FORM_WEBHOOK_URL` |
| Volunteer interest | `/volunteer/interest` | `volunteer_interest` | Resend and/or `FORM_WEBHOOK_URL` |
| Guest / talent | `/guests/inquiry` | `guest_inquiry` | Resend and/or `FORM_WEBHOOK_URL` |
| Press | `/press/inquiry` | `press_inquiry` | Resend and/or `FORM_WEBHOOK_URL` |

Shared UI lives in `src/components/forms/`.
Validation lives in `src/lib/forms/validate.ts` and `src/lib/forms/parse.ts`.
Delivery orchestration lives in `src/lib/forms/deliver.ts`.

Honeypot, field limits, and spam handling are unchanged. Honeypot fields are never emailed or posted.

## Operational email (Resend)

Resend is the first-class transactional provider for inquiry forms. It is **not** used for newsletter list signup.

All three variables are required before Resend is treated as configured:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Server-only | Resend API key |
| `FORM_FROM_EMAIL` | Server-only | Verified sender (`hello@midwestpixelfest.com` or `Midwest Pixel Fest <hello@…>`) |
| `CONTACT_NOTIFICATION_EMAIL` | Server-only | Inbox that receives notifications |

Behavior:

- Notification goes to `CONTACT_NOTIFICATION_EMAIL`
- Subject examples: `[Midwest Pixel Fest] Vendor Interest`
- Body includes submission type, timestamp, and sanitized fields
- `Reply-To` is set when the visitor submitted a valid email
- HTML is escaped; a plain-text part is included
- Failures do not expose API responses, keys, or stack traces
- User-facing error: `We couldn't send your submission. Please try again.`
- Submitted field contents are never logged

`FORM_FROM_EMAIL` must be a domain verified in Resend. The site will still build without these variables.

## Newsletter provider

Newsletter signup is a **separate** integration from operational email.

Do not automatically add newsletter addresses to Resend or the ops inbox.

Current provider: environment-driven webhook.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEWSLETTER_WEBHOOK_URL` | Server-only | HTTPS endpoint that accepts a JSON POST |

Payload:

```json
{
  "email": "visitor@example.com",
  "consent": true,
  "submittedAt": "2027-01-01T00:00:00.000Z",
  "firstName": "Alex"
}
```

`firstName` is omitted when blank. `consent` is `true` only after the visitor confirmed updates.

Abstraction: `src/lib/forms/newsletter.ts` (`getNewsletterProvider()`).

To connect a named ESP later, add a provider in that file. The form UI does not need to change. Intended future adapters:

- Brevo
- Mailchimp
- ConvertKit
- Supabase
- another CRM / list tool

Until `NEWSLETTER_WEBHOOK_URL` is set, newsletter forms fail safely (no fake success).

## Optional operational webhook

`FORM_WEBHOOK_URL` remains supported for inquiry forms (not newsletter).

If both Resend and the webhook are configured, both are attempted. The submission succeeds if **at least one** configured channel succeeds.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `FORM_WEBHOOK_URL` | Server-only | HTTPS JSON POST for operational forms |
| `EMAIL_PROVIDER_API_KEY` | Server-only | Optional `Authorization: Bearer` for that webhook |

Webhook body:

```json
{
  "kind": "contact",
  "submittedAt": "2027-01-01T00:00:00.000Z",
  "fields": { "name": "…", "email": "…" },
  "notify": "ops@example.com"
}
```

## Rate limiting

`src/lib/forms/rate-limit.ts` uses an in-process sliding window keyed by a hashed client IP (about 8 submissions / 10 minutes).

This stops obvious rapid repeats on a warm instance. It is **not** a reliable distributed limit on Vercel: each serverless isolate has its own memory. A determined client can retry across instances.

Do not store form bodies. Missing IP headers fail open so real visitors are not blocked.

For production-grade distributed limits, add an external store (Upstash Redis, Vercel KV) later. Do not treat the in-memory Map as sufficient at scale.

## Local development

None of these providers are required to run `npm run dev` or `npm run build`.

Unconfigured forms show a clear error instead of a fake thank-you. GA does not load. The rest of the site renders normally.

## Tickets

Set `event.ticketUrl` once in `src/lib/site.ts` when the public Ticketleap checkout URL exists. Leave it `null` until then. Do not use the Ticketleap homepage, a dashboard URL, or a guessed slug.

When it is a valid `https` URL, ticket CTAs track `ticket_click` and open checkout in a new tab (`rel="noopener noreferrer"`).
