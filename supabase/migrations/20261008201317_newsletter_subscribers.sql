-- Server-only newsletter capture. No public table access.
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(btrim(email)) and char_length(email) between 3 and 254),
  first_name text check (char_length(first_name) <= 200),
  consent boolean not null check (consent),
  consent_text text not null,
  consented_at timestamptz not null,
  source text not null default 'website_newsletter',
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed', 'suppressed')),
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_subscribers to service_role;
comment on table public.newsletter_subscribers is 'Explicit single opt-in newsletter requests; email ownership is not verified. Preserve unsubscribe and suppression status on duplicate signup.';
notify pgrst, 'reload schema';
