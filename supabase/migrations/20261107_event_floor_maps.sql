-- Midwest PixelFest 2027: private editable floor map sections and locations.
create table if not exists public.event_floor_maps (
 id uuid primary key default gen_random_uuid(),
 map_key text not null unique,
 title text not null,
 description text not null default '',
 image_path text,
 alt_text text not null default '',
 is_published boolean not null default false,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint floor_map_key_pattern check(map_key ~ '^[a-z0-9][a-z0-9-]{1,48}$'),
 constraint floor_map_title_size check(char_length(title) between 2 and 120),
 constraint floor_map_description_size check(char_length(description)<=1200),
 constraint floor_map_alt_text_size check(char_length(alt_text)<=240),
 constraint floor_map_publish_needs_image check(not is_published or image_path is not null)
);

create table if not exists public.event_floor_pins (
 id uuid primary key default gen_random_uuid(),
 map_id uuid not null references public.event_floor_maps(id) on delete cascade,
 label text not null,
 category text not null check(category in (
 'entrance','information','accessibility','restroom','vendor','artist','gaming',
 'tabletop','cosplay','panels','guests','food','exit','other')),
 description text not null default '',
 x_pct numeric(5,2) not null check(x_pct between 0 and 100),
 y_pct numeric(5,2) not null check(y_pct between 0 and 100),
 booth_label text,
 exhibitor_id uuid references public.public_vendor_listings(id) on delete set null,
 is_visible boolean not null default false,
 sort_order integer not null default 0,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint floor_pin_label_size check(char_length(label) between 2 and 100),
 constraint floor_pin_description_size check(char_length(description)<=1000),
 constraint floor_pin_booth_size check(booth_label is null or char_length(booth_label)<=100)
);
create index if not exists event_floor_pin_map_idx on public.event_floor_pins(map_id,sort_order,created_at);
create index if not exists event_floor_maps_publish_idx on public.event_floor_maps(is_published,sort_order);

drop trigger if exists event_floor_maps_set_updated_at on public.event_floor_maps;
create trigger event_floor_maps_set_updated_at before update on public.event_floor_maps
 for each row execute function public.set_updated_at();
drop trigger if exists event_floor_pins_set_updated_at on public.event_floor_pins;
create trigger event_floor_pins_set_updated_at before update on public.event_floor_pins
 for each row execute function public.set_updated_at();

alter table public.event_floor_maps enable row level security;
alter table public.event_floor_pins enable row level security;
drop policy if exists floor_maps_organizer_access on public.event_floor_maps;
create policy floor_maps_organizer_access on public.event_floor_maps
 for all to authenticated using(public.is_active_organizer())
 with check(public.is_active_organizer());
drop policy if exists floor_pins_organizer_access on public.event_floor_pins;
create policy floor_pins_organizer_access on public.event_floor_pins
 for all to authenticated using(public.is_active_organizer())
 with check(public.is_active_organizer());
revoke all on table public.event_floor_maps,public.event_floor_pins from public,anon,authenticated;
grant select,insert,update,delete on public.event_floor_maps,public.event_floor_pins to authenticated;
grant select,insert,update,delete on public.event_floor_maps,public.event_floor_pins to service_role;

-- Private uploads, signed when a section is explicitly published.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('event-floor-plans','event-floor-plans',false,10485760,
 array['image/png','image/jpeg','image/webp'])
 on conflict(id) do update set public=false,file_size_limit=10485760,
 allowed_mime_types=array['image/png','image/jpeg','image/webp'];
