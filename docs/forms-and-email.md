# Forms and email delivery

Midwest Pixel Fest forms use Next.js Server Actions (`src/app/actions/forms.ts`).
Nothing is stored in a database yet. Delivery is environment-driven.

## What exists today

| Form | Route | Kind |
| --- | --- | --- |
| Newsletter | Homepage, Tickets, News, Travel, FAQ | `newsletter` |
| Contact | `/contact` | `contact` |
| Vendor interest | `/vendors/interest` | `vendor_interest` |
| Sponsor inquiry | `/sponsors/inquiry` | `sponsor_inquiry` |
| Volunteer interest | `/volunteer/interest` | `volunteer_interest` |
| Guest / talent | `/guests/inquiry` | `guest_inquiry` |
| Press | `/press/inquiry` | `press_inquiry` |

Shared UI lives in `src/components/forms/`.
Validation lives in `src/lib/forms/validate.ts` and `src/lib/forms/parse.ts`.
Delivery lives in `src/lib/forms/deliver.ts`.

If no provider is configured, the form **does not pretend to succeed**.
The visitor sees an error that the submission was not recorded.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `FORM_WEBHOOK_URL` | Yes, for live delivery | HTTPS endpoint that accepts JSON POST |
| `CONTACT_NOTIFICATION_EMAIL` | Optional | Included in the JSON as `notify` for the consumer |
| `EMAIL_PROVIDER_API_KEY` | Optional | Sent as `Authorization: Bearer …` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Public business inbox shown on Contact / Privacy |

Do not add `NEXT_PUBLIC_` to API keys.

## Webhook payload

```json
{
  "kind": "contact",
  "submittedAt": "2027-01-01T00:00:00.000Z",
  "fields": { "name": "…", "email": "…" },
  "notify": "ops@example.com"
}
```

Field contents are not logged by the app.

## Connecting a real provider later

Point `FORM_WEBHOOK_URL` at whichever service you choose:

- **Mailchimp / Brevo / ConvertKit** — use that platform’s inbound webhook or a tiny worker that maps `kind` + `email` into a list
- **Resend / transactional email** — worker sends `CONTACT_NOTIFICATION_EMAIL` a copy of the sanitized fields
- **Supabase / PostgreSQL / CRM** — worker inserts a row, then optionally emails

The app does not need a new form component when you switch providers. Only the
webhook consumer (or `deliverSubmission` in `src/lib/forms/deliver.ts`) changes.

Suggested `kind` handling:

- `newsletter` → marketing list (only when `updatesConsent` is present)
- all other kinds → ops inbox / CRM, not a marketing blast

## Tickets

Set `event.ticketUrl` once in `src/lib/site.ts` when the public Ticketleap (or
other) checkout URL exists. Header, homepage, and `/tickets` all read that
value. Leave it `null` until sales are real.

## Analytics

`src/lib/analytics.ts` is a no-op helper. Wire GA4 or similar inside
`trackEvent` later. Event names are already used by CTAs and form success.
