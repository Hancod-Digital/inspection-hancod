-- Existing application upload targets. Keep these names stable across local,
-- staging, and production. The storage object policies are defined separately.
insert into storage.buckets (id, name, public)
values
  ('user', 'user', true),
  ('students', 'students', true)
on conflict (id) do update set public = excluded.public;
