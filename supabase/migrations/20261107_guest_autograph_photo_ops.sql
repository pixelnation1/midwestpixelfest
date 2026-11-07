-- Official guest appearance and fan-experience records for Midwest PixelFest 2027.
-- Draft negotiations remain private; publication requires an executed agreement.
create table if not exists public.guest_experiences (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique,
 display_name text not null,
 role_label text not null default '',
 bio text not null default '',
 image_url text,
 booking_status text not null default 'inquiry'
  check (booking_status in ('inquiry','negotiating','contracted','cancelled')),
 is_published boolean not null default false,
 sort_order integer not null default 0,
 autograph_available boolean not null default false,
 autograph_price_cents integer,
 selfie_available boolean not null default false,
 selfie_price_cents integer,
 photo_op_available boolean not null default false,
 photo_op_price_cents integer,
 combo_price_cents integer,
 autograph_details text not null default '',
 photo_details text not null default '',
 sales_notes text not null default '',
 purchase_url text,
 location_notes text not null default '',
 public_schedule_notes text not null default '',
 internal_notes text not null default '',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint guest_experience_slug_check check(slug ~ '^[a-z0-9][a-z0-9-]{1,79}$'),
 constraint guest_experience_name_check check(char_length(display_name) between 2 and 160),
 constraint guest_experience_role_check check(char_length(role_label)<=140),
 constraint guest_experience_bio_check check(char_length(bio)<=3500),
 constraint guest_experience_notes_check check(
  char_length(autograph_details)<=2000 and char_length(photo_details)<=2000
  and char_length(sales_notes)<=2000 and char_length(location_notes)<=400
  and char_length(public_schedule_notes)<=1200 and char_length(internal_notes)<=4000),
 constraint guest_experience_prices_check check(
  (autograph_price_cents is null or autograph_price_cents between 0 and 100000)
  and (selfie_price_cents is null or selfie_price_cents between 0 and 100000)
  and (photo_op_price_cents is null or photo_op_price_cents between 0 and 100000)
  and (combo_price_cents is null or combo_price_cents between 0 and 100000)),
 constraint guest_experience_publish_only_contracted check (
  not is_published or booking_status='contracted')
);
create index if not exists guest_experiences_public_idx
 on public.guest_experiences(is_published,booking_status,sort_order,display_name);

create table if not exists public.guest_experience_sessions (
 id uuid primary key default gen_random_uuid(),
 guest_id uuid not null references public.guest_experiences(id) on delete cascade,
 session_type text not null check(session_type in ('autograph','photo_op','selfie','meet_and_greet')),
 session_date date not null check(session_date in ('2027-10-16'::date,'2027-10-17'::date)),
 start_time time without time zone not null,
 end_time time without time zone not null,
 location_label text not null default '',
 public_note text not null default '',
 is_published boolean not null default false,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint guest_session_order_check check(end_time>start_time),
 constraint guest_session_location_length check(char_length(location_label)<=120),
 constraint guest_session_note_length check(char_length(public_note)<=500)
);
create index if not exists guest_experience_sessions_guest_idx
 on public.guest_experience_sessions(guest_id,is_published,session_date,start_time);

drop trigger if exists guest_experiences_set_updated_at on public.guest_experiences;
create trigger guest_experiences_set_updated_at before update on public.guest_experiences
 for each row execute function public.set_updated_at();
drop trigger if exists guest_experience_sessions_set_updated_at on public.guest_experience_sessions;
create trigger guest_experience_sessions_set_updated_at before update on public.guest_experience_sessions
 for each row execute function public.set_updated_at();

create or replace function public.guest_experience_unpublish_without_contract()
returns trigger language plpgsql set search_path=public as $$
begin
 if new.booking_status <> 'contracted' then new.is_published := false; end if;
 return new;
end;
$$;
drop trigger if exists guest_experience_unpublish_without_contract on public.guest_experiences;
create trigger guest_experience_unpublish_without_contract
 before update on public.guest_experiences
 for each row execute function public.guest_experience_unpublish_without_contract();
revoke all on function public.guest_experience_unpublish_without_contract()
 from public,anon,authenticated;

alter table public.guest_experiences enable row level security;
alter table public.guest_experience_sessions enable row level security;
drop policy if exists guest_experiences_organizer_only on public.guest_experiences;
create policy guest_experiences_organizer_only on public.guest_experiences
 for all to authenticated using(public.is_active_organizer())
 with check(public.is_active_organizer());
drop policy if exists guest_sessions_organizer_only on public.guest_experience_sessions;
create policy guest_sessions_organizer_only on public.guest_experience_sessions
 for all to authenticated using(public.is_active_organizer())
 with check(public.is_active_organizer());
revoke all on table public.guest_experiences,public.guest_experience_sessions
 from public,anon,authenticated;
grant select,insert,update,delete on table public.guest_experiences,public.guest_experience_sessions to authenticated;
grant select,insert,update,delete on table public.guest_experiences,public.guest_experience_sessions to service_role;
