-- Exhibitor & Artist Directory: public type and automatic unpublication safeguard.
-- Applied in Supabase Midwest PixelFest project before activating the public directory.
alter table public.public_vendor_listings
  add column if not exists exhibitor_type text not null default 'Vendor Hall';

update public.public_vendor_listings listing
set exhibitor_type = application.application_type
from public.vendor_applications application
where listing.application_id = application.id
  and application.application_type in ('Vendor Hall', 'Artist Alley', 'Cosplay Creator / Vendor');

alter table public.public_vendor_listings
  drop constraint if exists public_vendor_listing_type_check;
alter table public.public_vendor_listings
  add constraint public_vendor_listing_type_check
  check (exhibitor_type in ('Vendor Hall', 'Artist Alley', 'Cosplay Creator / Vendor'));

create index if not exists public_vendor_listings_type_published_idx
  on public.public_vendor_listings (published, exhibitor_type, sort_order);

create or replace function public.unpublish_unconfirmed_vendor_listing()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.status <> 'confirmed' then
    update public.public_vendor_listings
      set published = false
      where application_id = new.id and published = true;
  end if;
  return new;
end;
$$;

drop trigger if exists vendor_directory_unpublish_on_status_change on public.vendor_applications;
create trigger vendor_directory_unpublish_on_status_change
  after update of status on public.vendor_applications
  for each row execute function public.unpublish_unconfirmed_vendor_listing();

revoke all on function public.unpublish_unconfirmed_vendor_listing() from public, anon, authenticated;
