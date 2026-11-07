-- Added to the Midwest PixelFest Supabase project before activating panel submissions.
-- Private panel proposals: anonymous clients cannot read or write directly.
CREATE TABLE IF NOT EXISTS public.panel_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  idempotency_key uuid UNIQUE,
  contact_name text NOT NULL,
  display_name text,
  email text NOT NULL,
  phone text,
  social_url text,
  panel_title text NOT NULL,
  topic_category text NOT NULL,
  panel_format text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes IN (30,45,60)),
  description text NOT NULL,
  audience text NOT NULL,
  estimated_attendance text NOT NULL,
  co_presenters text,
  past_experience text,
  av_needs text,
  scheduling_notes text,
  accessibility_needs text,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','under_review','shortlisted','accepted','waitlisted','declined','withdrawn')),
  internal_notes text NOT NULL DEFAULT '',
  source_page text NOT NULL DEFAULT '/panels/submit',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS panel_submissions_status_created_idx
  ON public.panel_submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS panel_submissions_email_idx
  ON public.panel_submissions (lower(email));
DROP TRIGGER IF EXISTS panel_submissions_set_updated_at ON public.panel_submissions;
CREATE TRIGGER panel_submissions_set_updated_at
  BEFORE UPDATE ON public.panel_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.panel_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS panel_submissions_organizer_all ON public.panel_submissions;
CREATE POLICY panel_submissions_organizer_all
  ON public.panel_submissions FOR ALL TO authenticated
  USING (public.is_active_organizer())
  WITH CHECK (public.is_active_organizer());
REVOKE ALL ON TABLE public.panel_submissions FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.panel_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.panel_submissions TO service_role;
