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

## Environment variables

Copy `.env.example`. None are required for a local preview. Forms will not accept submissions until `FORM_WEBHOOK_URL` is set. See `docs/forms-and-email.md`.

### Google Search Console

1. In Search Console, choose **HTML tag** verification.
2. Copy only the `content` value from the meta tag (not the full tag).
3. In Vercel: **Project → Settings → Environment Variables**.
4. Add `GOOGLE_SITE_VERIFICATION` for Production (and Preview if you want).
5. Redeploy.

Sitemap: https://midwestpixelfest.com/sitemap.xml  
Robots: https://midwestpixelfest.com/robots.txt

### Analytics (optional)

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to a `G-` measurement ID. GA4 scripts load only when that value is present.

### Tickets

Set `event.ticketUrl` in `src/lib/site.ts` to the public Ticketleap URL when it is ready. Leave it `null` until then. Do not invent a checkout link.

### Contact inbox

`NEXT_PUBLIC_CONTACT_EMAIL` is the public business address shown on Contact and Privacy. Do not put a personal address there.
