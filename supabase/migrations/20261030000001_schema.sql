-- Apex Furnishing Rwanda: core schema
create extension if not exists pg_trgm with schema extensions;

-- Enums ---------------------------------------------------------------
create type public.product_status as enum ('draft', 'published');
create type public.availability_status as enum ('in_stock', 'out_of_stock');
create type public.admin_role as enum ('admin', 'super_admin');

-- Shared trigger: keep updated_at current ------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Admin profiles (one row per administrator, linked to Supabase Auth) ---
create table public.admin_profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null default '',
  role       public.admin_role not null default 'admin',
  created_at timestamptz not null default now()
);

-- Authorisation helpers (SECURITY DEFINER so they bypass RLS on admin_profiles)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid());
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_profiles where id = auth.uid() and role = 'super_admin');
$$;

-- Categories -------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 2 and 60),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  code_prefix text not null unique check (code_prefix ~ '^[A-Z]{2,4}$'), -- used in product codes, e.g. BED
  image_url   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create unique index categories_name_lower_key on public.categories (lower(btrim(name)));

-- Products ---------------------------------------------------------------
create sequence public.product_code_seq start 1;

create table public.products (
  id           uuid primary key default gen_random_uuid(),
  product_code text not null unique check (product_code ~ '^[A-Z0-9][A-Z0-9-]{2,29}$'),
  name         text not null check (char_length(btrim(name)) between 2 and 150),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_id  uuid not null references public.categories (id) on delete restrict,
  description  text not null default '',
  price        numeric(12,2) check (price is null or price >= 0), -- RWF; null = price on request
  image_url    text,
  gallery      jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery) = 'array'),
  sizes        text[] not null default '{}',
  colors       text[] not null default '{}',
  availability public.availability_status not null default 'in_stock',
  status       public.product_status not null default 'draft',
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- a product cannot go live without a main image
  constraint published_requires_image check (status <> 'published' or image_url is not null)
);

-- Auto-generate a unique public code (APX-BED-0001) when none is supplied
create or replace function public.set_product_code()
returns trigger language plpgsql security definer set search_path = public as $$
declare prefix text;
begin
  if new.product_code is null or btrim(new.product_code) = '' then
    select code_prefix into prefix from public.categories where id = new.category_id;
    new.product_code := 'APX-' || coalesce(prefix, 'GEN') || '-' || lpad(nextval('public.product_code_seq')::text, 4, '0');
  else
    new.product_code := upper(btrim(new.product_code));
  end if;
  return new;
end $$;

create trigger products_set_code    before insert on public.products for each row execute function public.set_product_code();
create trigger products_updated_at  before update on public.products for each row execute function public.set_updated_at();

-- Indexes for the shop queries ------------------------------------------
create index products_status_created_idx   on public.products (status, created_at desc);
create index products_category_status_idx  on public.products (category_id, status, created_at desc);
create index products_status_price_idx     on public.products (status, price);
create index products_featured_idx         on public.products (created_at desc) where is_featured and status = 'published';
create index products_name_trgm_idx        on public.products using gin (name extensions.gin_trgm_ops);

-- Dashboard statistics (admins only) -------------------------------------
create or replace function public.dashboard_stats()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorised' using errcode = '42501';
  end if;
  return json_build_object(
    'total_products',    (select count(*) from public.products),
    'total_categories',  (select count(*) from public.categories),
    'published_products',(select count(*) from public.products where status = 'published'),
    'draft_products',    (select count(*) from public.products where status = 'draft'),
    'out_of_stock',      (select count(*) from public.products where availability = 'out_of_stock')
  );
end $$;
