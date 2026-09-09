-- Cosplay Creator / Vendor extras for vendor interest registrations.
-- applicant_type and primary_category remain unconstrained text so new
-- labels can be stored without a CHECK-constraint change.
-- This does not loosen RLS and does not change service_role table grants.

ALTER TABLE public.vendor_interests
  ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '{}'::jsonb;
