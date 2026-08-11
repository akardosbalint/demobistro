-- Zöld Sarok Vegan Bistro — initial schema
-- Táblák: restaurants, menu_categories, menu_items, bookings, reviews, unavailability, admin_users

create extension if not exists "pgcrypto";

-- Generic updated_at trigger helper
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- restaurants
-- ---------------------------------------------------------------------------
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  phone text,
  email text,
  hours jsonb not null default '[]'::jsonb,
  max_daily_guests integer not null default 120,
  table_config jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger restaurants_set_updated_at
  before update on restaurants
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- menu_categories
-- ---------------------------------------------------------------------------
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create trigger menu_categories_set_updated_at
  before update on menu_categories
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- menu_items
-- ---------------------------------------------------------------------------
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price integer not null check (price >= 0), -- HUF, no decimals
  image_url text,
  dietary_info text[] not null default '{}', -- vegan / gluten-free / nut-free
  allergens text[] not null default '{}',
  is_available boolean not null default true,
  seasonal boolean not null default false,
  is_new boolean not null default false,
  portion_size text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_category_id_idx on menu_items(category_id);

create trigger menu_items_set_updated_at
  before update on menu_items
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create type booking_status as enum ('confirmed', 'checked-in', 'no-show', 'cancelled');

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete set null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  guest_count integer not null check (guest_count > 0),
  booking_date date not null,
  booking_time time not null,
  table_type text not null default 'standard',
  special_requests text,
  dietary_restrictions text[] not null default '{}',
  booking_status booking_status not null default 'confirmed',
  confirmation_token uuid not null default gen_random_uuid(),
  reminder_sent_24h boolean not null default false,
  reminder_sent_2h boolean not null default false,
  review_invite_sent boolean not null default false,
  deposit_required boolean not null default false,
  deposit_amount integer,
  stripe_payment_intent_id text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_booking_date_idx on bookings(booking_date);
create index if not exists bookings_status_idx on bookings(booking_status);
create unique index if not exists bookings_confirmation_token_idx on bookings(confirmation_token);

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  guest_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_is_published_idx on reviews(is_published);

-- ---------------------------------------------------------------------------
-- unavailability (zárva napok / blocked slots)
-- ---------------------------------------------------------------------------
create table if not exists unavailability (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  date date not null,
  full_day boolean not null default true,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists unavailability_date_idx on unavailability(date);

-- ---------------------------------------------------------------------------
-- admin_users (linked to Supabase Auth users)
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff', -- 'owner' | 'manager' | 'staff'
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table restaurants enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table unavailability enable row level security;
alter table admin_users enable row level security;

-- Helper: is the current auth.uid() an admin user?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql stable security definer;

-- restaurants: public read, admin write
create policy "restaurants_public_read" on restaurants for select using (true);
create policy "restaurants_admin_write" on restaurants for all using (is_admin()) with check (is_admin());

-- menu_categories: public read, admin write
create policy "menu_categories_public_read" on menu_categories for select using (true);
create policy "menu_categories_admin_write" on menu_categories for all using (is_admin()) with check (is_admin());

-- menu_items: public read, admin write
create policy "menu_items_public_read" on menu_items for select using (true);
create policy "menu_items_admin_write" on menu_items for all using (is_admin()) with check (is_admin());

-- bookings: guests can create bookings; only admins can read/update/delete directly.
-- (The public booking API route uses the service role for confirmation lookups.)
create policy "bookings_public_insert" on bookings for insert with check (true);
create policy "bookings_admin_all" on bookings for all using (is_admin()) with check (is_admin());

-- reviews: public can read published reviews; admin manages everything
create policy "reviews_public_read_published" on reviews for select using (is_published = true);
create policy "reviews_admin_write" on reviews for all using (is_admin()) with check (is_admin());

-- unavailability: public read (needed to disable full days in the booking calendar), admin write
create policy "unavailability_public_read" on unavailability for select using (true);
create policy "unavailability_admin_write" on unavailability for all using (is_admin()) with check (is_admin());

-- admin_users: admins can see the admin roster
create policy "admin_users_self_read" on admin_users for select using (is_admin());
create policy "admin_users_admin_write" on admin_users for all using (is_admin()) with check (is_admin());
