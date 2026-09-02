-- Server-side operational grants for Midwest Pixel Fest organizer persistence.
--
-- 0001_organizer_ops.sql revokes table privileges from PUBLIC. In PostgreSQL
-- that also removes default DML from service_role, leaving only REFERENCES,
-- TRIGGER, and TRUNCATE. Public form inserts and storage orchestration run
-- through the Next.js service-role client, which must be able to SELECT,
-- INSERT, UPDATE, and DELETE these tables.
--
-- These grants are for server-side operational access only.
-- The service role key remains server-only and must never be prefixed with
-- NEXT_PUBLIC_ or imported into Client Components.
-- This migration does not loosen RLS and does not grant anon/public CRUD.

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.admin_users
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.vendor_interests
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.vendor_applications
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.vendor_offers
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.vendor_status_history
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.vendor_internal_notes
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.sponsorships
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.sponsorship_commitments
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.sponsor_assets
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.sponsor_fulfillment
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.sponsor_status_history
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.sponsor_internal_notes
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.public_vendor_listings
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.public_sponsor_listings
  TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.organizer_audit_log
  TO service_role;
