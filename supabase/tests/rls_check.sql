-- RLS check. Run on a throwaway database that has the migrations and seed applied.
-- Creates two fake users, runs assertions as anon / non-admin / admin, then rolls everything back.
begin;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-0000000000a1'),   -- administrator
  ('00000000-0000-0000-0000-0000000000b2');   -- signed-in user who is NOT an administrator
insert into public.admin_profiles (id, full_name, role)
  values ('00000000-0000-0000-0000-0000000000a1', 'Test Owner', 'super_admin');

insert into public.products (name, slug, category_id, image_url, status)
  select 'Published Sheet', 'published-sheet', id, 'x.jpg', 'published' from public.categories where slug = 'bedsheets';
insert into public.products (name, slug, category_id, status)
  select 'Draft Sheet', 'draft-sheet', id, 'draft' from public.categories where slug = 'bedsheets';

-- 1. Anonymous visitor
set local role anon;
do $$ begin
  assert (select count(*) from public.products) = 1, 'anon must see only published products';
  assert (select count(*) from public.categories) = 7, 'anon must see active categories';
  begin
    insert into public.products (name, slug, category_id) select 'Hack', 'hack', id from public.categories limit 1;
    assert false, 'anon insert must be blocked';
  exception when insufficient_privilege then null; end;
  begin
    perform public.dashboard_stats();
    assert false, 'anon must not call dashboard_stats';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- 2. Signed in, but not an administrator
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000b2', true);
do $$ begin
  assert (select count(*) from public.products) = 1, 'non-admin must see only published products';
  begin
    update public.products set name = 'Hacked';
    assert (select count(*) from public.products where name = 'Hacked') = 0, 'non-admin update must change nothing';
  end;
  begin
    insert into public.admin_profiles (id, role) values ('00000000-0000-0000-0000-0000000000b2', 'super_admin');
    assert false, 'self-promotion must be blocked';
  exception when insufficient_privilege then null; end;
  begin
    perform public.dashboard_stats();
    assert false, 'non-admin must not read stats';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- 3. Administrator
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
do $$
declare c text; s json;
begin
  assert (select count(*) from public.products) = 2, 'admin must see drafts too';

  insert into public.products (name, slug, category_id)
    select 'Auto Code Duvet', 'auto-code-duvet', id from public.categories where slug = 'duvets' returning product_code into c;
  assert c ~ '^APX-DUV-[0-9]{4}$', 'product code must auto-generate, got ' || c;

  begin
    insert into public.products (name, slug, category_id, status)
      select 'No Image', 'no-image', id, 'published' from public.categories limit 1;
    assert false, 'publishing without an image must fail';
  exception when check_violation then null; end;

  begin
    delete from public.categories where slug = 'bedsheets';
    assert false, 'deleting a category with products must fail';
  exception when foreign_key_violation then null; end;

  begin
    insert into public.products (name, slug, category_id, product_code)
      select 'Dup Code', 'dup-code', id, c from public.categories limit 1;
    assert false, 'duplicate product code must fail';
  exception when unique_violation then null; end;

  s := public.dashboard_stats();
  assert (s->>'total_products')::int = 3 and (s->>'published_products')::int = 1, 'stats mismatch: ' || s::text;
end $$;
reset role;

-- 4. Inactive category hides its published products from the public
update public.categories set is_active = false where slug = 'bedsheets';
set local role anon;
do $$ begin
  assert (select count(*) from public.products) = 0, 'products in an inactive category must be hidden';
  assert (select count(*) from public.categories) = 6, 'inactive category must be hidden';
end $$;
reset role;

select 'ALL RLS CHECKS PASSED' as result;
rollback;
