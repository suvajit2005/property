-- Dream Property Hub - Supabase bootstrap schema
-- Run this in Supabase SQL Editor for project:
-- https://sowjdkokhtrsboxjpvfz.supabase.co

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('buyer', 'seller', 'broker', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'owner_type') then
    create type public.owner_type as enum ('individual', 'broker');
  end if;
  if not exists (select 1 from pg_type where typname = 'property_type') then
    create type public.property_type as enum ('residential', 'commercial');
  end if;
  if not exists (select 1 from pg_type where typname = 'listing_type') then
    create type public.listing_type as enum ('sale', 'rent');
  end if;
  if not exists (select 1 from pg_type where typname = 'property_status') then
    create type public.property_status as enum ('pending', 'active', 'sold', 'rented', 'inactive');
  end if;
end $$;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  phone text,
  whatsapp text,
  avatar_url text,
  role public.user_role not null default 'buyer',
  owner_type public.owner_type,
  city text,
  bio text,
  onboarded boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- properties
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_type public.owner_type not null default 'individual',
  property_type public.property_type not null,
  listing_type public.listing_type not null,
  title text not null,
  description text not null,
  category text,
  price numeric not null check (price > 0),
  city text not null default 'Purulia',
  state text not null default 'West Bengal',
  locality text,
  address text,
  pincode text,
  latitude double precision,
  longitude double precision,
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  furnishing text,
  floor_number integer,
  total_floors integer,
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  contact_phone text,
  contact_whatsapp text,
  status public.property_status not null default 'pending',
  is_featured boolean not null default false,
  is_verified boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_owner_id on public.properties(owner_id);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_listing_type on public.properties(listing_type);
create index if not exists idx_properties_property_type on public.properties(property_type);
create index if not exists idx_properties_city_locality on public.properties(city, locality);

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

-- saved_properties
create table if not exists public.saved_properties (
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

create index if not exists idx_saved_properties_property_id on public.saved_properties(property_id);

-- Auto-profile creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role, onboarded, preferences)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'buyer',
    false,
    '{}'::jsonb
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.saved_properties enable row level security;

-- profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

-- properties policies
drop policy if exists "properties_public_read_active" on public.properties;
create policy "properties_public_read_active"
on public.properties for select
to anon, authenticated
using (status = 'active');

drop policy if exists "properties_insert_own" on public.properties;
create policy "properties_insert_own"
on public.properties for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "properties_update_own" on public.properties;
create policy "properties_update_own"
on public.properties for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "properties_delete_own" on public.properties;
create policy "properties_delete_own"
on public.properties for delete
to authenticated
using (auth.uid() = owner_id);

-- saved_properties policies
drop policy if exists "saved_properties_select_own" on public.saved_properties;
create policy "saved_properties_select_own"
on public.saved_properties for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "saved_properties_insert_own" on public.saved_properties;
create policy "saved_properties_insert_own"
on public.saved_properties for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "saved_properties_delete_own" on public.saved_properties;
create policy "saved_properties_delete_own"
on public.saved_properties for delete
to authenticated
using (auth.uid() = user_id);

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('property-images', 'property-images', true),
  ('property-documents', 'property-documents', false),
  ('user-avatars', 'user-avatars', true),
  ('user-documents', 'user-documents', false)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'property-images');

drop policy if exists "property_images_auth_upload" on storage.objects;
create policy "property_images_auth_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-images');

drop policy if exists "property_images_auth_update" on storage.objects;
create policy "property_images_auth_update"
on storage.objects for update
to authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

drop policy if exists "property_images_auth_delete" on storage.objects;
create policy "property_images_auth_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'property-images');

drop policy if exists "user_avatars_public_read" on storage.objects;
create policy "user_avatars_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'user-avatars');

drop policy if exists "user_avatars_auth_upload" on storage.objects;
create policy "user_avatars_auth_upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'user-avatars');

drop policy if exists "user_avatars_auth_update" on storage.objects;
create policy "user_avatars_auth_update"
on storage.objects for update
to authenticated
using (bucket_id = 'user-avatars')
with check (bucket_id = 'user-avatars');

drop policy if exists "user_avatars_auth_delete" on storage.objects;
create policy "user_avatars_auth_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'user-avatars');

drop policy if exists "private_docs_owner_read" on storage.objects;
create policy "private_docs_owner_read"
on storage.objects for select
to authenticated
using (
  bucket_id in ('property-documents', 'user-documents')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "private_docs_owner_insert" on storage.objects;
create policy "private_docs_owner_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('property-documents', 'user-documents')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "private_docs_owner_update" on storage.objects;
create policy "private_docs_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id in ('property-documents', 'user-documents')
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id in ('property-documents', 'user-documents')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "private_docs_owner_delete" on storage.objects;
create policy "private_docs_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('property-documents', 'user-documents')
  and (storage.foldername(name))[1] = auth.uid()::text
);
