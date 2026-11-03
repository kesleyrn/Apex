# Supabase setup

1. Create a Supabase project. In **Authentication > Providers > Email**, turn **off** "Allow new users to sign up".
2. Run the files in `migrations/` in order (SQL editor, or `supabase db push`), then `seed.sql`.
3. Create the owner in **Authentication > Users** (Add user), then promote them in the SQL editor:

```sql
insert into public.admin_profiles (id, full_name, role)
select id, 'Owner', 'super_admin' from auth.users where email = 'OWNER_EMAIL';
```

4. Copy the project URL and anon key into `.env.local`.
5. Verify the policies: `supabase/tests/rls_check.sql` (run against a local or throwaway database).

Notes
- Images live in a **public** bucket. Anyone holding an image URL can load it. Paths contain a random UUID, so drafts are not guessable, but they are not strictly private.
- A published product is hidden from the public site if its category is set inactive.
- Product codes look like `APX-BED-0001`. Leave the field empty to auto-generate, or type your own.
