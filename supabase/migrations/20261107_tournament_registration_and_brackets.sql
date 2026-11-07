-- Applied in Midwest PixelFest's Supabase project (2026-11-07).
-- Private registration data; server-side service_role-only tournament RPCs.

-- tournament_registration_and_bracket_management_2027
-- Midwest PixelFest 2027 tournament registration / check-in / bracket pipeline
create table if not exists public.tournament_events (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check(slug ~ '^[a-z0-9][a-z0-9-]{1,79}$'),
 title text not null check(char_length(title) between 3 and 160),
 game_title text not null check(char_length(game_title) between 2 and 160),
 category text not null check(category in ('video_games','trading_cards','tabletop','other')),
 platform text not null default '',
 format text not null default 'single_elimination'
  check(format in ('single_elimination','double_elimination','round_robin')),
 entry_type text not null default 'individual' check(entry_type in ('individual','team')),
 team_size integer not null default 1 check(team_size between 1 and 8),
 capacity integer not null default 32 check(capacity between 2 and 256),
 description text not null default '',
 rules text not null default '',
 prize_notes text not null default '',
 fee_notes text not null default '',
 entry_fee_cents integer not null default 0 check(entry_fee_cents between 0 and 50000),
 event_date date not null check(event_date in ('2027-10-16'::date,'2027-10-17'::date)),
 start_time time without time zone not null,
 location_notes text not null default '',
 age_policy text not null default 'all_ages' check(age_policy in ('all_ages','age_13_plus','age_18_plus')),
 status text not null default 'draft' check(status in ('draft','confirmed','in_progress','completed','cancelled')),
 is_published boolean not null default false,
 registration_open boolean not null default false,
 waitlist_enabled boolean not null default true,
 bracket_published boolean not null default false,
 registration_deadline timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint tournament_team_size_check check((entry_type='individual' and team_size=1) or (entry_type='team' and team_size between 2 and 8)),
 constraint tournament_public_confirmed_check check(not is_published or status in ('confirmed','in_progress','completed','cancelled')),
 constraint tournament_reg_open_check check(not registration_open or (is_published and status='confirmed')),
 constraint tournament_fee_disclosure_check check(entry_fee_cents=0 or char_length(fee_notes)>0),
 constraint tournament_text_length_check check(
  char_length(platform)<=120 and char_length(description)<=3500 and char_length(rules)<=9000
  and char_length(prize_notes)<=2000 and char_length(fee_notes)<=1000 and char_length(location_notes)<=240)
);
create index if not exists tournament_events_public_idx on public.tournament_events(is_published,event_date,start_time);

create table if not exists public.tournament_registrations (
 id uuid primary key default gen_random_uuid(),
 tournament_id uuid not null references public.tournament_events(id) on delete cascade,
 reference text not null unique,
 idempotency_key uuid not null unique,
 contact_name text not null check(char_length(contact_name) between 2 and 120),
 contact_email text not null check(char_length(contact_email) between 4 and 254),
 player_name text not null check(char_length(player_name) between 2 and 100),
 roster_notes text not null default '' check(char_length(roster_notes)<=900),
 age_band text not null check(age_band in ('adult','minor')),
 guardian_confirmed boolean not null default false,
 public_name_consent boolean not null default false,
 status text not null default 'registered'
  check(status in ('registered','waitlisted','checked_in','withdrawn','disqualified')),
 checked_in_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint tournament_minor_guardian_check check(age_band='adult' or guardian_confirmed=true)
);
create unique index if not exists tournament_registrations_identity_idx
 on public.tournament_registrations(tournament_id,lower(contact_email),lower(player_name));
create index if not exists tournament_registrations_queue_idx
 on public.tournament_registrations(tournament_id,status,created_at);

create table if not exists public.tournament_matches (
 id uuid primary key default gen_random_uuid(),
 tournament_id uuid not null references public.tournament_events(id) on delete cascade,
 bracket_side text not null default 'winners'
  check(bracket_side in ('winners','losers','grand_final','round_robin')),
 round_number integer not null check(round_number between 1 and 32),
 match_number integer not null check(match_number between 1 and 256),
 player_a uuid references public.tournament_registrations(id) on delete set null,
 player_b uuid references public.tournament_registrations(id) on delete set null,
 score_a integer check(score_a between 0 and 999),
 score_b integer check(score_b between 0 and 999),
 winner_id uuid references public.tournament_registrations(id) on delete set null,
 status text not null default 'pending' check(status in ('pending','completed','bye')),
 public_notes text not null default '' check(char_length(public_notes)<=500),
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint tournament_match_participants_check check(player_a is null or player_b is null or player_a<>player_b),
 constraint tournament_match_winner_check check(winner_id is null or winner_id=player_a or winner_id=player_b),
 unique(tournament_id,bracket_side,round_number,match_number)
);
create index if not exists tournament_matches_event_idx on public.tournament_matches(tournament_id,bracket_side,round_number,match_number);

drop trigger if exists tournament_events_updated_at on public.tournament_events;
create trigger tournament_events_updated_at before update on public.tournament_events
 for each row execute function public.set_updated_at();
drop trigger if exists tournament_registrations_updated_at on public.tournament_registrations;
create trigger tournament_registrations_updated_at before update on public.tournament_registrations
 for each row execute function public.set_updated_at();
drop trigger if exists tournament_matches_updated_at on public.tournament_matches;
create trigger tournament_matches_updated_at before update on public.tournament_matches
 for each row execute function public.set_updated_at();

create or replace function public.tournament_auto_close()
returns trigger language plpgsql set search_path=public as $$
begin
 if new.status<>'confirmed' or not new.is_published then
   new.registration_open:=false;
 end if;
 return new;
end;
$$;
drop trigger if exists tournament_auto_close_trigger on public.tournament_events;
create trigger tournament_auto_close_trigger before update on public.tournament_events
 for each row execute function public.tournament_auto_close();

alter table public.tournament_events enable row level security;
alter table public.tournament_registrations enable row level security;
alter table public.tournament_matches enable row level security;
drop policy if exists tournament_events_organizer on public.tournament_events;
create policy tournament_events_organizer on public.tournament_events
 for all to authenticated using(public.is_active_organizer()) with check(public.is_active_organizer());
drop policy if exists tournament_registrations_organizer on public.tournament_registrations;
create policy tournament_registrations_organizer on public.tournament_registrations
 for all to authenticated using(public.is_active_organizer()) with check(public.is_active_organizer());
drop policy if exists tournament_matches_organizer on public.tournament_matches;
create policy tournament_matches_organizer on public.tournament_matches
 for all to authenticated using(public.is_active_organizer()) with check(public.is_active_organizer());
revoke all on public.tournament_events,public.tournament_registrations,public.tournament_matches from public,anon,authenticated;
grant select,insert,update,delete on public.tournament_events,public.tournament_registrations,public.tournament_matches to authenticated;
grant select,insert,update,delete on public.tournament_events,public.tournament_registrations,public.tournament_matches to service_role;

-- Atomic, lock-protected registration. The server-only service role is the ONLY caller.
-- One registration entry consumes one slot; a team is one entry with a declared roster.
create or replace function public.register_tournament_entry(
 p_tournament_id uuid,
 p_reference text,
 p_idempotency_key uuid,
 p_contact_name text,
 p_contact_email text,
 p_player_name text,
 p_roster_notes text,
 p_age_band text,
 p_guardian_confirmed boolean,
 p_public_name_consent boolean
)
returns table(result_reference text,result_status text)
language plpgsql security definer set search_path=public as $$
declare
 t public.tournament_events%rowtype;
 existing public.tournament_registrations%rowtype;
 count_active integer;
 next_status text;
begin
 select * into t from public.tournament_events where id=p_tournament_id for update;
 if not found then raise exception 'tournament_unavailable'; end if;
 select * into existing from public.tournament_registrations where idempotency_key=p_idempotency_key;
 if found then
   if existing.tournament_id<>p_tournament_id then raise exception 'idempotency_conflict'; end if;
   return query select existing.reference,existing.status;
   return;
 end if;
 if t.status<>'confirmed' or not t.is_published or not t.registration_open
   or (t.registration_deadline is not null and now()>=t.registration_deadline) then
   raise exception 'registration_closed';
 end if;
 if t.age_policy='age_18_plus' and p_age_band<>'adult' then raise exception 'age_restriction'; end if;
 if t.age_policy='age_13_plus' and p_age_band='under_13' then raise exception 'age_restriction'; end if;
 if p_age_band<>'adult' and not p_guardian_confirmed then raise exception 'guardian_required'; end if;
 if t.entry_type='team' and char_length(trim(p_roster_notes))<2 then raise exception 'roster_required'; end if;
 if char_length(p_contact_name) not between 2 and 120 or char_length(p_player_name) not between 2 and 100
   or char_length(p_contact_email) not between 4 and 254 or char_length(p_roster_notes)>900 then
   raise exception 'invalid_entry';
 end if;
 select count(*) into count_active from public.tournament_registrations
  where tournament_id=p_tournament_id and status in ('registered','checked_in');
 next_status:=case when count_active<t.capacity then 'registered'
   when t.waitlist_enabled then 'waitlisted' else null end;
 if next_status is null then raise exception 'tournament_full'; end if;
 insert into public.tournament_registrations(
  tournament_id,reference,idempotency_key,contact_name,contact_email,
  player_name,roster_notes,age_band,guardian_confirmed,public_name_consent,status
 ) values (
  p_tournament_id,p_reference,p_idempotency_key,p_contact_name,p_contact_email,
  p_player_name,p_roster_notes,p_age_band,p_guardian_confirmed,p_public_name_consent,next_status
 );
 return query select p_reference,next_status;
end;
$$;
revoke all on function public.register_tournament_entry(uuid,text,uuid,text,text,text,text,text,boolean,boolean) from public,anon,authenticated;
grant execute on function public.register_tournament_entry(uuid,text,uuid,text,text,text,text,text,boolean,boolean) to service_role;

-- Lock-protected admin status changes with FIFO waitlist promotion.
create or replace function public.manage_tournament_entry(
 p_entry_id uuid,p_next_status text
)
returns table(result_status text,promoted_reference text)
language plpgsql security definer set search_path=public as $$
declare
 e public.tournament_registrations%rowtype;
 t public.tournament_events%rowtype;
 q public.tournament_registrations%rowtype;
 promoted text := null;
begin
 select * into e from public.tournament_registrations where id=p_entry_id;
 if not found then raise exception 'entry_not_found'; end if;
 select * into t from public.tournament_events where id=e.tournament_id for update;
 select * into e from public.tournament_registrations where id=p_entry_id for update;
 if p_next_status not in ('registered','waitlisted','checked_in','withdrawn','disqualified')
   then raise exception 'invalid_entry_status'; end if;
 if p_next_status='checked_in' and e.status not in ('registered','checked_in')
   then raise exception 'cannot_check_in'; end if;
 if p_next_status='registered' and e.status='waitlisted' and
   (select count(*) from public.tournament_registrations
     where tournament_id=e.tournament_id and status in ('registered','checked_in'))>=t.capacity
   then raise exception 'capacity_full'; end if;
 if p_next_status in ('registered','checked_in') and e.status not in ('registered','checked_in') and
   (select count(*) from public.tournament_registrations
     where tournament_id=e.tournament_id and status in ('registered','checked_in'))>=t.capacity
   then raise exception 'capacity_full'; end if;
 update public.tournament_registrations set status=p_next_status,
   checked_in_at=case when p_next_status='checked_in' then coalesce(checked_in_at,now()) else null end
   where id=e.id;
 if e.status in ('registered','checked_in') and p_next_status in ('withdrawn','disqualified','waitlisted')
    and t.status='confirmed' then
   select * into q from public.tournament_registrations where tournament_id=e.tournament_id
     and status='waitlisted' and id<>e.id order by created_at,id limit 1 for update;
   if found then
    update public.tournament_registrations set status='registered' where id=q.id;
    promoted:=q.reference;
   end if;
 end if;
 return query select p_next_status,promoted;
end;
$$;
revoke all on function public.manage_tournament_entry(uuid,text) from public,anon,authenticated;
grant execute on function public.manage_tournament_entry(uuid,text) to service_role;

-- Organizer server precomputes verified bracket seeds; this RPC saves them atomically.
create or replace function public.seed_tournament_matches(
 p_tournament_id uuid,p_matches jsonb
)
returns integer
language plpgsql security definer set search_path=public as $$
declare
 t public.tournament_events%rowtype;
 cnt integer;
begin
 select * into t from public.tournament_events where id=p_tournament_id for update;
 if not found then raise exception 'tournament_not_found'; end if;
 if t.status not in ('confirmed','in_progress') then raise exception 'invalid_tournament_status'; end if;
 if exists (select 1 from public.tournament_matches where tournament_id=p_tournament_id) then
   raise exception 'bracket_already_exists';
 end if;
 if jsonb_typeof(p_matches)<>'array' or jsonb_array_length(p_matches)<1
   or jsonb_array_length(p_matches)>2000 then raise exception 'invalid_matches'; end if;
 insert into public.tournament_matches(
  tournament_id,bracket_side,round_number,match_number,
  player_a,player_b,winner_id,status
 )
 select p_tournament_id,entry.bracket_side,entry.round_number,entry.match_number,
   entry.player_a,entry.player_b,entry.winner_id,entry.status
 from jsonb_to_recordset(p_matches) as entry(
  bracket_side text,round_number integer,match_number integer,
  player_a uuid,player_b uuid,winner_id uuid,status text
 );
 get diagnostics cnt=row_count;
 update public.tournament_events set registration_open=false where id=p_tournament_id;
 return cnt;
end;
$$;
revoke all on function public.seed_tournament_matches(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.seed_tournament_matches(uuid,jsonb) to service_role;

-- Atomic result entry and automatic winner advancement for single elimination.
create or replace function public.complete_tournament_match(
 p_match_id uuid,p_winner_id uuid,p_score_a integer,p_score_b integer
)
returns text
language plpgsql security definer set search_path=public as $$
declare
 m public.tournament_matches%rowtype;
 t public.tournament_events%rowtype;
 nxt public.tournament_matches%rowtype;
begin
 select * into m from public.tournament_matches where id=p_match_id;
 if not found then raise exception 'match_not_found'; end if;
 select * into t from public.tournament_events where id=m.tournament_id for update;
 select * into m from public.tournament_matches where id=p_match_id for update;
 if m.status='completed' or m.status='bye' then raise exception 'match_already_complete'; end if;
 if p_winner_id is null or (p_winner_id is distinct from m.player_a and p_winner_id is distinct from m.player_b) then
   raise exception 'winner_not_in_match'; end if;
 if m.player_a is null or m.player_b is null then raise exception 'match_not_ready'; end if;
 if t.status not in ('confirmed','in_progress') then raise exception 'tournament_not_active'; end if;
 update public.tournament_matches set winner_id=p_winner_id,status='completed',
  score_a=p_score_a,score_b=p_score_b where id=m.id;
 if t.format='single_elimination' and m.bracket_side='winners' then
   select * into nxt from public.tournament_matches
    where tournament_id=m.tournament_id and bracket_side='winners'
      and round_number=m.round_number+1
      and match_number=ceil(m.match_number::numeric/2)::integer
    for update;
   if found then
     if (m.match_number%2)=1 then
       if nxt.player_a is not null and nxt.player_a<>p_winner_id then raise exception 'next_match_conflict'; end if;
       update public.tournament_matches set player_a=p_winner_id where id=nxt.id;
     else
       if nxt.player_b is not null and nxt.player_b<>p_winner_id then raise exception 'next_match_conflict'; end if;
       update public.tournament_matches set player_b=p_winner_id where id=nxt.id;
     end if;
   end if;
 end if;
 return 'completed';
end;
$$;
revoke all on function public.complete_tournament_match(uuid,uuid,integer,integer) from public,anon,authenticated;
grant execute on function public.complete_tournament_match(uuid,uuid,integer,integer) to service_role;


-- tournament_age_bands_for_youth_2027
alter table public.tournament_registrations drop constraint if exists tournament_registrations_age_band_check;
alter table public.tournament_registrations add constraint tournament_registrations_age_band_check
 check (age_band in ('adult','minor','under_13'));
alter table public.tournament_registrations drop constraint if exists tournament_minor_guardian_check;
alter table public.tournament_registrations add constraint tournament_minor_guardian_check
 check (age_band='adult' or guardian_confirmed=true);