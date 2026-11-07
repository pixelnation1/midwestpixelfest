-- Midwest Pixel Fest 2027 cosplay contest registration and organizer review
-- Registration is an APPLICATION, not an automatic confirmed contest slot.
CREATE TABLE IF NOT EXISTS public.cosplay_contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  idempotency_key uuid NOT NULL UNIQUE,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  public_name text NOT NULL,
  age_band text NOT NULL CHECK (age_band IN ('adult','teen','child')),
  guardian_confirmed boolean NOT NULL DEFAULT false,
  entry_type text NOT NULL CHECK (entry_type IN ('individual','group')),
  group_size smallint NOT NULL DEFAULT 1 CHECK (group_size BETWEEN 1 AND 10),
  division_preference text NOT NULL CHECK (division_preference IN
    ('beginner','experienced','group','youth','showcase')),
  character_name text NOT NULL,
  series_name text,
  costume_description text NOT NULL,
  construction_type text NOT NULL CHECK (construction_type IN
    ('mostly_handmade','mixed','purchased','commissioned','other')),
  build_notes text,
  props_description text,
  reference_url text,
  day_preference text NOT NULL CHECK (day_preference IN ('saturday','sunday','either')),
  stage_notes text,
  accessibility_needs text,
  contact_consent boolean NOT NULL DEFAULT false,
  rules_acknowledged boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','under_review','shortlisted','accepted','waitlisted','declined','withdrawn')),
  internal_notes text NOT NULL DEFAULT '',
  source_page text NOT NULL DEFAULT '/cosplay/contest/register',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT minor_guardian_required CHECK (age_band = 'adult' OR guardian_confirmed = true),
  CONSTRAINT group_size_matches_type CHECK (
    (entry_type='individual' AND group_size=1) OR (entry_type='group' AND group_size >= 2)
  ),
  CONSTRAINT applicant_consents_required CHECK (contact_consent AND rules_acknowledged)
);
CREATE INDEX IF NOT EXISTS cosplay_contest_status_created_idx
  ON public.cosplay_contest_entries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS cosplay_contest_email_idx
  ON public.cosplay_contest_entries (lower(email));
DROP TRIGGER IF EXISTS cosplay_contest_entries_set_updated_at ON public.cosplay_contest_entries;
CREATE TRIGGER cosplay_contest_entries_set_updated_at
 BEFORE UPDATE ON public.cosplay_contest_entries
 FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.cosplay_contest_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cosplay_contest_organizer_all ON public.cosplay_contest_entries;
CREATE POLICY cosplay_contest_organizer_all ON public.cosplay_contest_entries
 FOR ALL TO authenticated
 USING (public.is_active_organizer())
 WITH CHECK (public.is_active_organizer());
REVOKE ALL ON TABLE public.cosplay_contest_entries FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.cosplay_contest_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cosplay_contest_entries TO service_role;
