drop extension if exists "pg_net";


  create policy "students_bucket_policy insert"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'students'::text));



  create policy "students_bucket_policy select"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'students'::text));



  create policy "user_bucket_policy insert"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'user'::text));



  create policy "user_bucket_policy select"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'user'::text));



