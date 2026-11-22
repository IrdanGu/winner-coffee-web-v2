-- Supabase Schema for Winner Coffee Menu & Admin Management

-- 1. Categories Table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text,
  icon_name text not null default 'Coffee',
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Menu Items Table
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  category_id text not null references public.categories(id) on delete cascade on update cascade,
  price numeric not null,
  description text,
  image_url text,
  is_available boolean not null default true,
  is_favorite boolean not null default false,
  is_promo boolean not null default false,
  badge text,
  temperature_options text default 'hot_and_ice',
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexing for fast search and filtering
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_menu_items_available on public.menu_items(is_available);
create index if not exists idx_menu_items_sort on public.menu_items(sort_order);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

-- Public Read Policies
create policy "Public can read categories" on public.categories
  for select using (true);

create policy "Public can read menu items" on public.menu_items
  for select using (true);

-- Allow full mutations for service role and anon (server-side authenticated via Admin Session)
create policy "Allow all on categories for anon and service_role" on public.categories
  for all using (true) with check (true);

create policy "Allow all on menu_items for anon and service_role" on public.menu_items
  for all using (true) with check (true);

-- 3. Storage Bucket Setup for Menu Images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set public = true;

-- Storage Policies
create policy "Public can view menu images" on storage.objects
  for select using (bucket_id = 'menu-images');

create policy "Allow upload menu images" on storage.objects
  for insert with check (bucket_id = 'menu-images');

create policy "Allow update menu images" on storage.objects
  for update using (bucket_id = 'menu-images');

create policy "Allow delete menu images" on storage.objects
  for delete using (bucket_id = 'menu-images');
