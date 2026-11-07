-- Midwest PixelFest 2027: invitation-only author programming, separate
-- from paid Artist Alley vendor applications.
-- Private candidate/contact/negotiation data never goes to the public directory.
create table if not exists public.invited_author_guests (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  contact_email text,
  website_url text,
  work_or_series text not null default '',
  private_programming_ideas text not null default '',
  private_terms_notes text not null default '',
  invitation_status text not null default 'prospect'
    check (invitation_status in ('prospect','contacted','interested','terms_discussion','confirmed','declined','withdrawn')),
  guest_experience_id uuid unique references public.guest_experiences(id) on delete set null,
  public_name text not null default '',
  public_bio text not null default '',
  public_activities text not null default '',
  public_books text not null default '',
  public_signing_notes text not null default '',
  image_url text,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint author_name_size check (char_length(author_name) between 2 and 160),
  constraint author_contact_size check (contact_email is null or char_length(contact_email)<=254),
  constraint author_url_size check (website_url is null or char_length(website_url)<=500),
  constraint author_series_size check (char_length(work_or_series)<=1200),
  constraint author_private_ideas_size check (char_length(private_programming_ideas)<=4000),
  constraint author_terms_size check (char_length(private_terms_notes)<=4000),
  constraint author_public_name_size check (char_length(public_name)<=160),
  constraint author_public_bio_size check (char_length(public_bio)<=3500),
  constraint author_public_activities_size check (char_length(public_activities)<=1600),
  constraint author_public_books_size check (char_length(public_books)<=1000),
  constraint author_public_signing_size check (char_length(public_signing_notes)<=1600),
  constraint author_sort_order check (sort_order between 0 and 9999),
  constraint author_publish_requires_confirmation check (
    not is_published or (invitation_status='confirmed' and guest_experience_id is not null
      and char_length(public_name)>0 and char_length(public_bio)>0)
  )
);
create index if not exists invited_authors_public_idx
  on public.invited_author_guests(is_published,invitation_status,sort_order,public_name);
drop trigger if exists invited_authors_set_updated_at on public.invited_author_guests;
create trigger invited_authors_set_updated_at before update on public.invited_author_guests
  for each row execute function public.set_updated_at();

create or replace function public.unpublish_unconfirmed_author()
returns trigger language plpgsql set search_path=public as $$
begin
  if new.invitation_status <> 'confirmed' or new.guest_experience_id is null then
    new.is_published := false;
  end if;
  return new;
end;
$$;
drop trigger if exists invited_author_unpublish_on_status_change on public.invited_author_guests;
create trigger invited_author_unpublish_on_status_change
  before update on public.invited_author_guests
  for each row execute function public.unpublish_unconfirmed_author();
revoke all on function public.unpublish_unconfirmed_author() from public,anon,authenticated;

alter table public.invited_author_guests enable row level security;
drop policy if exists invited_author_organizer_only on public.invited_author_guests;
create policy invited_author_organizer_only on public.invited_author_guests
  for all to authenticated
  using (public.is_active_organizer())
  with check (public.is_active_organizer());
revoke all on table public.invited_author_guests from public,anon,authenticated;
grant select,insert,update,delete on table public.invited_author_guests to authenticated;
grant select,insert,update,delete on table public.invited_author_guests to service_role;
