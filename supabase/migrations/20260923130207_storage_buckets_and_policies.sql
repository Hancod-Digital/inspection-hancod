begin;

-- Application upload targets. Keep these bucket IDs stable across local,
-- staging, and production environments.
insert into storage.buckets (id, name, public)
values
  ('user', 'user', true),
  ('students', 'students', true)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

-- Recreate the policies so this migration can be imported into an existing
-- database as well as applied to a fresh local Docker instance.
drop policy if exists "students_bucket_policy insert" on storage.objects;
drop policy if exists "students_bucket_policy select" on storage.objects;
drop policy if exists "user_bucket_policy insert" on storage.objects;
drop policy if exists "user_bucket_policy select" on storage.objects;

create policy "students_bucket_policy insert"
on storage.objects
as permissive
for insert
to authenticated
with check (bucket_id = 'students');

create policy "students_bucket_policy select"
on storage.objects
as permissive
for select
to authenticated
using (bucket_id = 'students');

create policy "user_bucket_policy insert"
on storage.objects
as permissive
for insert
to authenticated
with check (bucket_id = 'user');

create policy "user_bucket_policy select"
on storage.objects
as permissive
for select
to authenticated
using (bucket_id = 'user');

commit;
