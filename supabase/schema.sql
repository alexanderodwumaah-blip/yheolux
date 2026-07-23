-- ============================================================
-- YHEOLUX  —  Supabase schema
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- ADMIN PROFILES ----------
-- Every row here marks a Supabase Auth user as an admin allowed into /admin.
-- After an admin signs up (via /admin/signup) you MUST add a row here yourself
-- (or run the promote statement at the bottom) before they can log in to the dashboard.
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------- DELIVERY LOCATIONS ----------
create table if not exists delivery_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  sort_order int not null default 0
);

insert into delivery_locations (name, sort_order) values
  ('Akuse', 1),
  ('Asutuarey', 2),
  ('Kpong', 3),
  ('Agormanya', 4),
  ('Somanya', 5),
  ('Natriku', 6)
on conflict (name) do nothing;

-- ---------- PRODUCTS ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  main_category text not null default 'Fashion',   -- top-level: Fashion, Accessories, etc.
  category text not null default 'General',         -- sub-category: Bags, Clothing, Jewellery, etc.
  original_price numeric(10,2),      -- optional "was" price, shown struck-through
  selling_price numeric(10,2) not null,
  seller_phone text not null,        -- WhatsApp / call number for this product's orders
  images text[] not null default '{}', -- up to 4 image URLs (Supabase Storage public URLs)
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_created_at_idx on products (created_at desc);

-- ---------- ORDERS ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  buyer_phone text not null,
  delivery_location text not null,
  payment_option text not null check (payment_option in ('preorder', 'pay_on_delivery')),
  contact_method text not null check (contact_method in ('whatsapp', 'call')),
  items jsonb not null,              -- [{product_id, name, selling_price, qty, image}]
  total numeric(10,2) not null default 0,
  payment_made boolean not null default false,
  delivered boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);

-- ---------- NEWSLETTER SUBSCRIBERS ----------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table admin_profiles enable row level security;
alter table delivery_locations enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table subscribers enable row level security;

-- admin_profiles: an admin can read their own row (used to gate the dashboard)
drop policy if exists "admin can read own profile" on admin_profiles;
create policy "admin can read own profile" on admin_profiles
  for select using (auth.uid() = id);

drop policy if exists "user can insert own pending profile" on admin_profiles;
create policy "user can insert own pending profile" on admin_profiles
  for insert with check (auth.uid() = id);

-- delivery_locations: public read
drop policy if exists "public read locations" on delivery_locations;
create policy "public read locations" on delivery_locations
  for select using (true);

drop policy if exists "admin manage locations" on delivery_locations;
create policy "admin manage locations" on delivery_locations
  for all using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

-- products: public read, admin write
drop policy if exists "public read products" on products;
create policy "public read products" on products
  for select using (true);

drop policy if exists "admin manage products" on products;
create policy "admin manage products" on products
  for all using (exists (select 1 from admin_profiles where id = auth.uid()))
  with check (exists (select 1 from admin_profiles where id = auth.uid()));

-- orders: anyone (even signed-out buyers) can create an order.
-- Only admins can read / update the order list (so buyers can't see each other's orders).
drop policy if exists "public can place order" on orders;
create policy "public can place order" on orders
  for insert with check (true);

drop policy if exists "admin read orders" on orders;
create policy "admin read orders" on orders
  for select using (exists (select 1 from admin_profiles where id = auth.uid()));

drop policy if exists "admin update orders" on orders;
create policy "admin update orders" on orders
  for update using (exists (select 1 from admin_profiles where id = auth.uid()));

-- Explicitly grant INSERT on orders to the anon role so unauthenticated
-- buyers can place orders (RLS policy alone is not enough if table-level
-- privileges were not granted when the table was created outside Supabase UI).
grant insert on table orders to anon;
grant insert on table subscribers to anon;

-- subscribers: anyone can sign up, only admins can read the list
drop policy if exists "public can subscribe" on subscribers;
create policy "public can subscribe" on subscribers
  for insert with check (true);

drop policy if exists "admin read subscribers" on subscribers;
create policy "admin read subscribers" on subscribers
  for select using (exists (select 1 from admin_profiles where id = auth.uid()));

-- ============================================================
-- STORAGE (product images)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert with check (
    bucket_id = 'product-images'
    and exists (select 1 from admin_profiles where id = auth.uid())
  );

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete using (
    bucket_id = 'product-images'
    and exists (select 1 from admin_profiles where id = auth.uid())
  );

-- ============================================================
-- SEED PRODUCTS
-- ============================================================
insert into products (name, description, main_category, category, original_price, selling_price, seller_phone, images, featured)
values
(
  'The Island Muse Tote & Clutch Set',
  'A tropical, bohemian art-print tote paired with a matching small clutch. Bold African art print on durable canvas with rope handles and tassel detail. Comes with a matching zip clutch — a statement set that carries everything you need in style.',
  'Fashion',
  'Bags',
  110.00,
  74.99,
  '233541901749',
  array['/products/island-muse-tote.png', '/products/island-muse-clutch.png', '/products/island-muse-tote-set.png'],
  true
),
(
  'The "Queen of Rhythm" Artisan Clutch',
  'A rich, high-definition portrait tote featuring a woman in profile wearing a multicolored patterned headwrap and traditional layered beads, set against a warm burnt-orange background. Durable woven-texture fabric with a smooth top zipper — ideal for daily essentials or a special occasion.',
  'Fashion',
  'Bags',
  99.00,
  74.99,
  '233541901749',
  array['/products/queen-of-rhythm-clutch.png', '/products/queen-of-rhythm-tote-set.png'],
  true
)
on conflict do nothing;

-- ============================================================
-- UPDATE EXISTING LIVE RECORDS (run this if products already exist)
-- Fixes prices, categories, and adds multiple images
-- ============================================================
update products
set
  original_price = 110.00,
  selling_price  = 74.99,
  main_category  = 'Fashion',
  category       = 'Bags',
  seller_phone   = '233541901749',
  images         = array['/products/island-muse-tote.png', '/products/island-muse-clutch.png', '/products/island-muse-tote-set.png']
where name = 'The Island Muse Tote & Clutch Set';

update products
set
  original_price = 99.00,
  selling_price  = 74.99,
  main_category  = 'Fashion',
  category       = 'Bags',
  seller_phone   = '233541901749',
  images         = array['/products/queen-of-rhythm-clutch.png', '/products/queen-of-rhythm-tote-set.png']
where name ilike '%Queen of Rhythm%';

-- Migrate any other existing products with old category format
update products set main_category = 'Fashion', category = 'Bags'
  where category in ('Bags & Totes') and (main_category is null or main_category = '');
update products set main_category = 'Fashion', category = 'Clothing'
  where category in ('Clothing', 'Clothes') and (main_category is null or main_category = '');
update products set main_category = 'Fashion'
  where (main_category is null or main_category = '');

-- ============================================================
-- HOW TO MAKE YOURSELF AN ADMIN
-- ============================================================
-- 1. Go to your site's /admin/signup page and create an account (email + password).
-- 2. Come back here and run the statement below, replacing the email:
--
--   insert into admin_profiles (id, full_name)
--   select id, 'Store Admin' from auth.users where email = 'you@example.com'
--   on conflict (id) do nothing;
--
-- 3. Log in at /admin/login.
