# Forms and email delivery

Midwest Pixel Fest forms use Next.js Server Actions (`src/app/actions/forms.ts`).
Nothing is stored in a database. Delivery is environment-driven.

If no provider is configured for that form type, the form **does not pretend to succeed**.

## What exists today

| Form | Route | Kind | Delivery |
| --- | --- | --- | --- |
| Newsletter | Homepage, Tickets, News, Travel, FAQ | `newsletter` | `NEWSLETTER_WEBHOOK_URL` only |
| Contact | `/contact` | `contact` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback |
| Vendor interest | `/vendors/interest` | `vendor_interest` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback |
| Official vendor / artist application | `/vendors/apply/vendor`, `/vendors/apply/artist` | `vendor_application` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback. Applications remain closed until flags are opened. |
| Sponsor inquiry | `/sponsors/inquiry` | `sponsor_inquiry` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback |
| Sponsorship commitment | `/sponsors/commitment` | `sponsor_commitment` | Same delivery path. Form is closed until the contracting entity is confirmed. Not a public CTA. |
| Sponsor assets | `/sponsors/assets` | `sponsor_assets` | Same delivery path. Form is closed until organizer-issued collection is enabled. Logo storage is not connected. |
| Volunteer interest | `/volunteer/interest` | `volunteer_interest` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback |
| Guest / talent | `/guests/inquiry` | `guest_inquiry` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback |
| Press | `/press/inquiry` | `press_inquiry` | Resend (preferred) or `FORM_WEBHOOK_URL` fallback |

Shared UI lives in `src/components/forms/`.
Validation lives in `src/lib/forms/validate.ts` and `src/lib/forms/parse.ts`.
Delivery orchestration lives in `src/lib/forms/deliver.ts`.

Honeypot, field limits, and spam handling are unchanged. Honeypot fields are never emailed or posted.

## Operational email (Resend)

Resend is the production provider for inquiry and application notifications. It is **not** used for newsletter list signup.

`midwestpixelfest.com` is the verified sending domain. The API key is server-only (`RESEND_API_KEY`). Never use `NEXT_PUBLIC_` for it.

| Variable | Scope | Required? | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Server-only | Required in production for inquiry email | Resend API key |
| `FORM_FROM_EMAIL` | Server-only | Optional | From override. Default: `Midwest Pixel Fest <website@midwestpixelfest.com>` |
| `CONTACT_NOTIFICATION_EMAIL` | Server-only | Optional | Ops inbox. Default: `hello@midwestpixelfest.com` |

Behavior:

- From is never taken from user input
- Notification goes to `CONTACT_NOTIFICATION_EMAIL`, or `hello@midwestpixelfest.com` when that variable is unset
- Subject examples: `[Midwest Pixel Fest] New Contact Message`, `[Midwest Pixel Fest] New Vendor Interest — Business Name`
- Body includes form type, timestamp, source page, and sanitized fields (HTML + plain text)
- Organizer-facing timestamps display as `September 2, 2026 at 7:36 AM CT` (no raw ISO timestamp in the visible email)
- Honeypot values, secrets, and analytics IDs are not emailed
- `Reply-To` is set to the submitter email after validation
- Failures do not expose API responses, keys, or stack traces
- User-facing error: `We couldn't send your submission right now. Please try again or contact hello@midwestpixelfest.com.`
- Success is shown only when Resend accepts the send (when Resend is the configured channel)
- Submitted field contents are never logged

If `FORM_FROM_EMAIL` or `CONTACT_NOTIFICATION_EMAIL` is set to an invalid value, Resend is treated as not configured. The site still builds without these variables.

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

Preferred production behavior: **Resend when `RESEND_API_KEY` is set.** The webhook is a fallback when Resend is not configured. Both channels are not used together unless `FORM_WEBHOOK_WITH_RESEND` is explicitly set to `true`, `1`, or `yes`.

When Resend is configured, the form succeeds only if Resend accepts the email. A webhook posted alongside Resend cannot mark the submission successful if Resend failed.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `FORM_WEBHOOK_URL` | Server-only | HTTPS JSON POST for operational forms |
| `EMAIL_PROVIDER_API_KEY` | Server-only | Optional `Authorization: Bearer` for that webhook |
| `FORM_WEBHOOK_WITH_RESEND` | Server-only | Optional. Set only to also POST the webhook when Resend is configured |

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

Do not put `RESEND_API_KEY` in local env unless you intentionally want to send real email. Unconfigured forms show a clear error instead of a fake thank-you. GA does not load. The rest of the site renders normally.

## Tickets

Official checkout is `event.ticketUrl` in `src/lib/site.ts`. All ticket CTAs read that value through `src/lib/tickets.ts`. Do not hardcode the Ticketleap URL in components, and do not use the Ticketleap homepage, a dashboard URL, or a guessed slug.

When `ticketUrl` is a valid `https` URL, ticket CTAs track `ticket_click` and open checkout in a new tab (`rel="noopener noreferrer"`). Leave it `null` only to take public checkout offline.
