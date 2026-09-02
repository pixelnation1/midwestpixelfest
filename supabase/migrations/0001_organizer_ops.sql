-- Midwest Pixel Fest 2027 organizer operations
-- Apply in the Supabase SQL editor or with the Supabase CLI.
-- Do not put credentials in this file.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Admin authorization
-- is_active_organizer() must be created after admin_users exists.
-- PostgreSQL SQL functions resolve relation names at CREATE time.
-- ---------------------------------------------------------------------------

CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true
);

CREATE INDEX admin_users_active_idx ON public.admin_users (active);

CREATE OR REPLACE FUNCTION public.is_active_organizer()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_organizer() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_organizer() TO authenticated;

-- ---------------------------------------------------------------------------
-- Vendor interest (not official applications)
-- ---------------------------------------------------------------------------

CREATE TABLE public.vendor_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  idempotency_key uuid UNIQUE,
  contact_name text NOT NULL,
  business_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  social_media text,
  applicant_type text NOT NULL,
  primary_category text NOT NULL,
  description text NOT NULL,
  city text,
  state text,
  notify_when_open boolean NOT NULL DEFAULT true,
  source_page text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vendor_interests_status_idx ON public.vendor_interests (status);
CREATE INDEX vendor_interests_created_at_idx ON public.vendor_interests (created_at DESC);
CREATE INDEX vendor_interests_business_name_idx ON public.vendor_interests (lower(business_name));

CREATE TRIGGER vendor_interests_set_updated_at
BEFORE UPDATE ON public.vendor_interests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Vendor applications
-- ---------------------------------------------------------------------------

CREATE TABLE public.vendor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  idempotency_key uuid UNIQUE,
  application_type text NOT NULL,
  contact_name text NOT NULL,
  business_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  social_primary text,
  social_additional text,
  street text,
  city text,
  state text,
  zip text,
  country text,
  primary_category text NOT NULL,
  requested_space text NOT NULL,
  extra_badges integer NOT NULL DEFAULT 0,
  extra_tables integer NOT NULL DEFAULT 0,
  electricity_requested boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN (
      'submitted',
      'under_review',
      'approved',
      'invoice_sent',
      'payment_overdue',
      'confirmed',
      'waitlisted',
      'declined',
      'withdrawn',
      'cancelled'
    )),
  waitlist_position integer,
  vendor_agreement_version text,
  source_page text,
  merchandise jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_setup jsonb NOT NULL DEFAULT '{}'::jsonb,
  compliance jsonb NOT NULL DEFAULT '{}'::jsonb,
  staff jsonb NOT NULL DEFAULT '{}'::jsonb,
  booth_sharing jsonb NOT NULL DEFAULT '{}'::jsonb,
  acknowledgments jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature jsonb NOT NULL DEFAULT '{}'::jsonb,
  directory jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vendor_applications_status_idx ON public.vendor_applications (status);
CREATE INDEX vendor_applications_reference_idx ON public.vendor_applications (reference);
CREATE INDEX vendor_applications_submitted_at_idx ON public.vendor_applications (submitted_at DESC);
CREATE INDEX vendor_applications_application_type_idx ON public.vendor_applications (application_type);
CREATE INDEX vendor_applications_primary_category_idx ON public.vendor_applications (primary_category);
CREATE INDEX vendor_applications_business_name_idx ON public.vendor_applications (lower(business_name));

CREATE TRIGGER vendor_applications_set_updated_at
BEFORE UPDATE ON public.vendor_applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.vendor_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL UNIQUE REFERENCES public.vendor_applications (id) ON DELETE CASCADE,
  requested_space text NOT NULL,
  offered_space text NOT NULL,
  pricing_tier text NOT NULL,
  base_price numeric(10, 2) NOT NULL,
  add_ons jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10, 2) NOT NULL,
  offer_issued_at timestamptz NOT NULL DEFAULT now(),
  original_payment_due_at date NOT NULL,
  payment_due_at date NOT NULL,
  deadline_override jsonb,
  invoice_status text NOT NULL DEFAULT 'not_created'
    CHECK (invoice_status IN ('not_created', 'created', 'sent', 'paid', 'overdue', 'cancelled')),
  square_invoice_id text,
  square_invoice_url text,
  amount_invoiced numeric(10, 2),
  amount_paid numeric(10, 2),
  paid_at timestamptz,
  confirmed_at timestamptz,
  agreement_version text,
  custom_pricing_internal_note text,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vendor_offers_invoice_status_idx ON public.vendor_offers (invoice_status);
CREATE INDEX vendor_offers_payment_due_at_idx ON public.vendor_offers (payment_due_at);

CREATE TRIGGER vendor_offers_set_updated_at
BEFORE UPDATE ON public.vendor_offers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.vendor_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.vendor_applications (id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  note text,
  changed_by uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vendor_status_history_application_idx
  ON public.vendor_status_history (application_id, created_at DESC);

CREATE TABLE public.vendor_internal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.vendor_applications (id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX vendor_internal_notes_application_idx
  ON public.vendor_internal_notes (application_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Sponsorships
-- ---------------------------------------------------------------------------

CREATE TABLE public.sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  idempotency_key uuid UNIQUE,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  contact_title text,
  business_address text,
  city text,
  state text,
  zip text,
  website text,
  social_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  selected_level text,
  custom_amount numeric(10, 2),
  custom_amount_proposed text,
  areas_of_interest jsonb NOT NULL DEFAULT '[]'::jsonb,
  inquiry_comments text,
  inquiry_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'inquiry_received'
    CHECK (status IN (
      'inquiry_received',
      'contacted',
      'negotiating',
      'committed',
      'invoice_created',
      'invoice_sent',
      'paid',
      'assets_needed',
      'assets_received',
      'active',
      'completed',
      'declined',
      'withdrawn',
      'cancelled'
    )),
  inquiry_received_at timestamptz NOT NULL DEFAULT now(),
  contacted_at timestamptz,
  committed_at timestamptz,
  invoice_created_at timestamptz,
  invoice_sent_at timestamptz,
  payment_due_at date,
  paid_at timestamptz,
  amount_committed numeric(10, 2),
  amount_invoiced numeric(10, 2),
  amount_paid numeric(10, 2),
  invoice_status text NOT NULL DEFAULT 'not_created'
    CHECK (invoice_status IN (
      'not_created',
      'created',
      'sent',
      'paid',
      'overdue',
      'cancelled',
      'refunded',
      'partially_refunded'
    )),
  square_invoice_id text,
  square_invoice_url text,
  assets_needed boolean NOT NULL DEFAULT false,
  assets_received_at timestamptz,
  activated_at timestamptz,
  activation_override boolean NOT NULL DEFAULT false,
  activation_override_reason text,
  public_directory_enabled boolean NOT NULL DEFAULT false,
  acknowledgment jsonb NOT NULL DEFAULT '{}'::jsonb,
  directory jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_page text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sponsorships_status_idx ON public.sponsorships (status);
CREATE INDEX sponsorships_reference_idx ON public.sponsorships (reference);
CREATE INDEX sponsorships_created_at_idx ON public.sponsorships (inquiry_received_at DESC);
CREATE INDEX sponsorships_business_name_idx ON public.sponsorships (lower(business_name));

CREATE TRIGGER sponsorships_set_updated_at
BEFORE UPDATE ON public.sponsorships
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.sponsorship_commitments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL UNIQUE REFERENCES public.sponsorships (id) ON DELETE CASCADE,
  package_id text NOT NULL,
  package_name text NOT NULL,
  agreed_amount numeric(10, 2) NOT NULL,
  amount_label text,
  included_benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  excluded_benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  areas_sponsored jsonb NOT NULL DEFAULT '[]'::jsonb,
  exclusivity jsonb NOT NULL DEFAULT '{"granted":false}'::jsonb,
  committed_at timestamptz NOT NULL DEFAULT now(),
  payment_due_at date,
  agreement_version text NOT NULL,
  contracting_entity_status text,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sponsor_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL UNIQUE REFERENCES public.sponsorships (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_requested'
    CHECK (status IN ('not_requested', 'requested', 'partial', 'received', 'approved')),
  requested_at timestamptz,
  received_at timestamptz,
  approved_at timestamptz,
  public_business_name text,
  website text,
  primary_social_url text,
  additional_social_url text,
  public_description text,
  organizer_edited_description text,
  marketing_contact_name text,
  marketing_contact_email text,
  marketing_contact_phone text,
  preferred_public_url text,
  brand_guidelines_url text,
  logos jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER sponsor_assets_set_updated_at
BEFORE UPDATE ON public.sponsor_assets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.sponsor_fulfillment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL REFERENCES public.sponsorships (id) ON DELETE CASCADE,
  item_id text NOT NULL,
  label text NOT NULL,
  status text NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'planned', 'completed', 'not_applicable')),
  UNIQUE (sponsorship_id, item_id)
);

CREATE TABLE public.sponsor_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL REFERENCES public.sponsorships (id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  note text,
  changed_by uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sponsor_status_history_sponsorship_idx
  ON public.sponsor_status_history (sponsorship_id, created_at DESC);

CREATE TABLE public.sponsor_internal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL REFERENCES public.sponsorships (id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sponsor_internal_notes_sponsorship_idx
  ON public.sponsor_internal_notes (sponsorship_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Public directory copies (sanitized). Never store private contacts here.
-- ---------------------------------------------------------------------------

CREATE TABLE public.public_vendor_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL UNIQUE REFERENCES public.vendor_applications (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  category text,
  short_description text,
  logo_url text,
  website text,
  social_url text,
  booth_location text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX public_vendor_listings_published_idx
  ON public.public_vendor_listings (published, sort_order);

CREATE TRIGGER public_vendor_listings_set_updated_at
BEFORE UPDATE ON public.public_vendor_listings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.public_sponsor_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL UNIQUE REFERENCES public.sponsorships (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  level_label text,
  package_id text,
  logo_url text,
  website text,
  public_description text,
  public_social_url text,
  sponsored_area text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX public_sponsor_listings_published_idx
  ON public.public_sponsor_listings (published, sort_order);

CREATE TRIGGER public_sponsor_listings_set_updated_at
BEFORE UPDATE ON public.public_sponsor_listings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Lightweight organizer audit (no note bodies / PII payloads)
-- ---------------------------------------------------------------------------

CREATE TABLE public.organizer_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  entity_reference text,
  actor_user_id uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX organizer_audit_log_created_at_idx
  ON public.organizer_audit_log (created_at DESC);
CREATE INDEX organizer_audit_log_entity_idx
  ON public.organizer_audit_log (entity_type, entity_reference);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public anonymous users cannot read private vendor/sponsor/admin data.
-- Form inserts are performed with the service role from Next.js server actions.
-- ---------------------------------------------------------------------------

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_fulfillment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_vendor_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_sponsor_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_users_select_organizers
  ON public.admin_users FOR SELECT TO authenticated
  USING (public.is_active_organizer());

CREATE POLICY admin_users_update_self
  ON public.admin_users FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND public.is_active_organizer())
  WITH CHECK (user_id = auth.uid() AND public.is_active_organizer());

CREATE POLICY vendor_interests_organizer_all
  ON public.vendor_interests FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY vendor_applications_organizer_all
  ON public.vendor_applications FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY vendor_offers_organizer_all
  ON public.vendor_offers FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY vendor_status_history_organizer_all
  ON public.vendor_status_history FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY vendor_internal_notes_organizer_all
  ON public.vendor_internal_notes FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY sponsorships_organizer_all
  ON public.sponsorships FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY sponsorship_commitments_organizer_all
  ON public.sponsorship_commitments FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY sponsor_assets_organizer_all
  ON public.sponsor_assets FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY sponsor_fulfillment_organizer_all
  ON public.sponsor_fulfillment FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY sponsor_status_history_organizer_all
  ON public.sponsor_status_history FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY sponsor_internal_notes_organizer_all
  ON public.sponsor_internal_notes FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY public_vendor_listings_public_read
  ON public.public_vendor_listings FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY public_vendor_listings_organizer_write
  ON public.public_vendor_listings FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY public_sponsor_listings_public_read
  ON public.public_sponsor_listings FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY public_sponsor_listings_organizer_write
  ON public.public_sponsor_listings FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());

CREATE POLICY organizer_audit_log_organizer_select
  ON public.organizer_audit_log FOR SELECT TO authenticated
  USING (public.is_active_organizer());

CREATE POLICY organizer_audit_log_organizer_insert
  ON public.organizer_audit_log FOR INSERT TO authenticated
  WITH CHECK (public.is_active_organizer());

-- ---------------------------------------------------------------------------
-- Grants: anon cannot touch private tables. Authenticated is still gated by RLS.
-- ---------------------------------------------------------------------------

REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.vendor_interests FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.vendor_applications FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.vendor_offers FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.vendor_status_history FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.vendor_internal_notes FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.sponsorships FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.sponsorship_commitments FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.sponsor_assets FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.sponsor_fulfillment FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.sponsor_status_history FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.sponsor_internal_notes FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.organizer_audit_log FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.public_vendor_listings FROM anon, authenticated, PUBLIC;
REVOKE ALL ON TABLE public.public_sponsor_listings FROM anon, authenticated, PUBLIC;

GRANT SELECT, UPDATE ON TABLE public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.vendor_interests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.vendor_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.vendor_offers TO authenticated;
GRANT SELECT, INSERT ON TABLE public.vendor_status_history TO authenticated;
GRANT SELECT, INSERT ON TABLE public.vendor_internal_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.sponsorships TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.sponsorship_commitments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.sponsor_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sponsor_fulfillment TO authenticated;
GRANT SELECT, INSERT ON TABLE public.sponsor_status_history TO authenticated;
GRANT SELECT, INSERT ON TABLE public.sponsor_internal_notes TO authenticated;
GRANT SELECT, INSERT ON TABLE public.organizer_audit_log TO authenticated;
GRANT SELECT ON TABLE public.public_vendor_listings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.public_vendor_listings TO authenticated;
GRANT SELECT ON TABLE public.public_sponsor_listings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.public_sponsor_listings TO authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private sponsor assets; public copies only after organizer publish
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sponsor-assets',
  'sponsor-assets',
  false,
  8388608,
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-sponsor-logos',
  'public-sponsor-logos',
  true,
  8388608,
  ARRAY['image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY sponsor_assets_storage_organizer_read
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'sponsor-assets' AND public.is_active_organizer());

CREATE POLICY sponsor_assets_storage_organizer_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'sponsor-assets' AND public.is_active_organizer());

CREATE POLICY sponsor_assets_storage_organizer_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'sponsor-assets' AND public.is_active_organizer())
  WITH CHECK (bucket_id = 'sponsor-assets' AND public.is_active_organizer());

CREATE POLICY public_sponsor_logos_read
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'public-sponsor-logos');

CREATE POLICY public_sponsor_logos_organizer_write
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public-sponsor-logos' AND public.is_active_organizer());

CREATE POLICY public_sponsor_logos_organizer_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'public-sponsor-logos' AND public.is_active_organizer())
  WITH CHECK (bucket_id = 'public-sponsor-logos' AND public.is_active_organizer());
