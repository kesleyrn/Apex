insert into public.categories (name, slug, code_prefix) values
  ('Bedsheets',  'bedsheets',  'BED'),
  ('Pillows',    'pillows',    'PIL'),
  ('Duvets',     'duvets',     'DUV'),
  ('Towels',     'towels',     'TOW'),
  ('Décor',      'decor',      'DEC'),
  ('Robes',      'robes',      'ROB'),
  ('Bed Covers', 'bed-covers', 'BCV')
on conflict (slug) do nothing;
insert into public.admin_profiles (id, full_name, role)
