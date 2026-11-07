-- Keep tournament signups closed after any match is seeded, including manually
-- managed double-elimination tournaments.
create or replace function public.tournament_auto_close()
returns trigger language plpgsql set search_path=public as $$
begin
 if new.status<>'confirmed' or not new.is_published
    or (new.registration_open and exists (
       select 1 from public.tournament_matches where tournament_id=new.id
    )) then
   new.registration_open:=false;
 end if;
 return new;
end;
$$;

create or replace function public.tournament_lock_signup_after_match()
returns trigger language plpgsql set search_path=public as $$
begin
 update public.tournament_events set registration_open=false
   where id=new.tournament_id and registration_open=true;
 return new;
end;
$$;

drop trigger if exists tournament_match_auto_close_registration on public.tournament_matches;
create trigger tournament_match_auto_close_registration
after insert on public.tournament_matches
for each row execute function public.tournament_lock_signup_after_match();

revoke all on function public.tournament_lock_signup_after_match() from public,anon,authenticated;
revoke all on function public.tournament_auto_close() from public,anon,authenticated;
