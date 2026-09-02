# Organizer database and admin setup

This site uses **Supabase Postgres + Auth** for vendor and sponsorship operations. Do not put credentials in this file.

Public forms still validate on the server. When `SUPABASE_SERVICE_ROLE_KEY` is set, vendor interest, vendor applications, and sponsorship records are persisted **before** Resend notification. If persistence fails, the submission fails. If Resend fails after a successful insert, the visitor still sees success so they do not create duplicates.

## 1. Create a Supabase project

Create a project in the Supabase dashboard. Do not enable public user signup for organizer accounts.

Recommended Auth settings:

- Disable public sign-ups
- Email/password enabled
- Confirm emails if you want; the first organizer can be created in the dashboard

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Never commit `.env.local`. Never prefix the service role with `NEXT_PUBLIC_`. The service role is used only in Next.js server modules for public form inserts and private storage uploads.

## 3. Apply SQL migrations

In the Supabase SQL editor, run:

`supabase/migrations/0001_organizer_ops.sql`

Or with the CLI from this repo:

```bash
supabase db push
```

The migration enables Row Level Security on all private tables. Anonymous users cannot select vendor applications, sponsorship inquiries, notes, or payment fields.

## 4. Create the first organizer Auth user

In **Authentication → Users**, add a user with email and password. Do **not** add a public “Create Admin Account” page.

## 5. Attach that user to `admin_users`

In the SQL editor (replace the placeholders):

```sql
INSERT INTO public.admin_users (user_id, role, display_name, active)
VALUES (
  'AUTH_USER_UUID',
  'owner',
  'Organizer name',
  true
);
```

Only rows with `active = true` can use `/admin`.

## 6. Verify RLS

Using the anon key (not the service role):

- `select * from vendor_applications;` must return no rows / permission error
- `select * from sponsorships;` must return no rows / permission error
- `select * from public_sponsor_listings where published = true;` is allowed

## 7. Deploy

Add the same environment variables in Vercel (or your host). Redeploy.

## 8. Test public form persistence

Submit Vendor Interest and Sponsorship Inquiry on the live site. Confirm:

- a row appears in `vendor_interests` / `sponsorships`
- a Resend notification still arrives at `hello@midwestpixelfest.com`
- double-submit does not create a second row (same `submissionId`)

Official vendor applications remain **closed**.

## 9. Test admin authentication

Open `/admin/login`. Sign in with the organizer user. You should reach `/admin`. Sign out returns to `/admin/login`.

A signed-in Auth user who is **not** in `admin_users` must not see private records.

## 10. Test vendor / sponsor records

From `/admin`, open Vendor Interests, Vendor Applications, Sponsors, and Payments. Empty pipelines should show zero / empty states, not sample companies.

## Storage

Private logos go to the `sponsor-assets` bucket. Approved PNG/JPEG copies may be published to `public-sponsor-logos`. SVG stays private. Organizer upload is authenticated; there is no anonymous upload endpoint.
