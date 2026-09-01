# Midwest Pixel Fest

Official website for **Midwest Pixel Fest**, a gaming, cosplay, collectibles, and pop-culture convention in Emporia, Kansas.

- Production: https://midwestpixelfest.com
- Dates: October 16–17, 2027
- Presented by [PixelNation](https://pixelnation.co)

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

No email, newsletter, or analytics provider is required to run the site locally. Forms fail safely until delivery is configured. See `docs/forms-and-email.md`.

## Environment variables

Copy `.env.example` to `.env.local`. Never commit `.env.local` or real secrets.

**Never prefix secret keys with `NEXT_PUBLIC_`.** Anything with that prefix is exposed to the browser.

| Variable | Visibility | Required? | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Optional locally. Set in production. | Canonical origin. Defaults to `https://midwestpixelfest.com`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Optional | Public business inbox shown on Contact and Privacy. Not used to send mail. |
| `RESEND_API_KEY` | Server-only | Required for live inquiry email | Resend API key. Never use `NEXT_PUBLIC_`. |
| `FORM_FROM_EMAIL` | Server-only | Optional | From override. Default: `Midwest Pixel Fest <website@midwestpixelfest.com>`. |
| `CONTACT_NOTIFICATION_EMAIL` | Server-only | Optional | Inbox that receives inquiry notifications. Default: `hello@midwestpixelfest.com`. |
| `NEWSLETTER_WEBHOOK_URL` | Server-only | Required for live newsletter signup | JSON POST endpoint for list signup. |
| `FORM_WEBHOOK_URL` | Server-only | Optional | Fallback JSON webhook when Resend is not configured. |
| `FORM_WEBHOOK_WITH_RESEND` | Server-only | Optional | Set to `true` only to also POST the webhook when Resend is configured. |
| `EMAIL_PROVIDER_API_KEY` | Server-only | Optional | Bearer token for `FORM_WEBHOOK_URL`. |
| `GOOGLE_SITE_VERIFICATION` | Server-only | Optional until Search Console is connected | HTML-tag `content` value only. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Optional | GA4 ID (`G-…`). Scripts load only when set. |

Live inquiry forms need `RESEND_API_KEY` (preferred) and/or `FORM_WEBHOOK_URL`. From and destination default to the verified midwestpixelfest.com website sender and `hello@midwestpixelfest.com`. Do not put the Resend API key in `.env.example`, source, or git.

Live newsletter signup needs `NEWSLETTER_WEBHOOK_URL`. Newsletter leads are **not** emailed to the operational inbox.

### Google Search Console

Search Console is **not** connected until `GOOGLE_SITE_VERIFICATION` is set and the property is verified.

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add a property for `https://midwestpixelfest.com`.
3. Choose a verification method (HTML tag is the one this site supports via env).
4. If using HTML tag verification, add `GOOGLE_SITE_VERIFICATION` in Vercel (the `content` value only, not the full meta tag).
5. Redeploy.
6. Submit `https://midwestpixelfest.com/sitemap.xml`.

Sitemap: https://midwestpixelfest.com/sitemap.xml  
Robots: https://midwestpixelfest.com/robots.txt

### Analytics (optional)

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to a real `G-` measurement ID. GA4 loads with Next.js `afterInteractive` scripts only when that value is present. `trackEvent` is a no-op if GA is not configured.

### Tickets

Official checkout is `event.ticketUrl` in `src/lib/site.ts` (Ticketleap). All ticket CTAs read that value through `src/lib/tickets.ts`. Do not hardcode the Ticketleap URL in components. Leave `ticketUrl` null only to take public checkout offline.

### Contact inbox

`NEXT_PUBLIC_CONTACT_EMAIL` is the public business address shown on Contact and Privacy. Do not put a personal address there.

## Production checklist (manual)

Do this after credentials are in Vercel. There is no public admin dashboard.

- [ ] Submit the contact form and confirm a notification email arrives
- [ ] Submit a vendor inquiry and confirm the notification
- [ ] Submit the newsletter form and confirm the webhook/list provider received it
- [ ] Confirm inquiry email subject, fields, and Reply-To
- [ ] Confirm GA4 events (`contact_submit`, `vendor_interest_submit`, `newsletter_signup`, `ticket_click`)
- [ ] Open https://midwestpixelfest.com/sitemap.xml
- [ ] Open https://midwestpixelfest.com/robots.txt
- [ ] Verify the domain in Google Search Console and submit the sitemap
- [ ] Confirm header and homepage Tickets CTAs open the official Ticketleap checkout URL
