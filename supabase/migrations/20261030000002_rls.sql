-- Row Level Security and table privileges
alter table public.admin_profiles enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;

-- Privileges (defence in depth: RLS still decides which rows)
revoke all on public.admin_profiles, public.categories, public.products from anon, authenticated;
grant select on public.categories, public.products to anon;
grant select, insert, update, delete on public.admin_profiles, public.categories, public.products to authenticated;
grant usage on sequence public.product_code_seq to authenticated;

revoke all on function public.is_admin(), public.is_super_admin(), public.dashboard_stats() from public;
grant execute on function public.is_admin(), public.is_super_admin() to anon, authenticated;
grant execute on function public.dashboard_stats() to authenticated;

-- Categories ---------------------------------------------------------------
create policy "Public reads active categories" on public.categories
  for select to anon, authenticated using (is_active);

create policy "Admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Products -------------------------------------------------------------------
-- Published products are public only while their category is active.
create policy "Public reads published products" on public.products
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (select 1 from public.categories c where c.id = category_id and c.is_active)
  );

create policy "Admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admin profiles ---------------------------------------------------------------
create policy "Admins read own profile" on public.admin_profiles
  for select to authenticated using (id = auth.uid() or public.is_super_admin());

create policy "Super admins manage profiles" on public.admin_profiles
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
