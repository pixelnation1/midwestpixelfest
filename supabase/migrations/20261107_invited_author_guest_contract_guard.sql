-- A previously announced author must disappear when the linked guest is unpublished or uncontracted.
create or replace function public.unpublish_invited_authors_for_unavailable_guest()
returns trigger language plpgsql set search_path=public as $$
begin
  if new.booking_status <> 'contracted' or new.is_published=false then
    update public.invited_author_guests
      set is_published=false
      where guest_experience_id=new.id and is_published=true;
  end if;
  return new;
end;
$$;
drop trigger if exists guest_status_unpublish_invited_authors on public.guest_experiences;
create trigger guest_status_unpublish_invited_authors
after update of booking_status,is_published on public.guest_experiences
for each row execute function public.unpublish_invited_authors_for_unavailable_guest();
revoke all on function public.unpublish_invited_authors_for_unavailable_guest()
  from public,anon,authenticated;
