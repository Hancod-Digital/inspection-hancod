begin;

-- Production migration: no empty-local bootstrap and no automatic assignment of
-- new profiles to an existing business. Run on a backed-up staging branch first.
do $$ begin
  create type public.business_role as enum ('OWNER', 'ADMIN', 'EMPLOYEE', 'VIEWER');
exception when duplicate_object then null;
end $$;

create temp table _multitenant_cfg (business_id uuid, name text, slug text, training_prefix text) on commit drop;
insert into _multitenant_cfg
select gen_random_uuid(), 'Qube Inspection', 'qube-inspection', 'QRS-TRA';

create table public.business (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,40}$'),
  status public.status not null default 'ACTIVE',
  job_prefix text not null default 'JOB',
  certificate_prefix text not null default 'CRT',
  training_prefix text not null default 'TRA',
  settings jsonb not null default '{}'::jsonb
);

create table public.business_members (
  business_id uuid not null references public.business(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.business_role not null default 'EMPLOYEE',
  status public.status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);
create index business_members_user_idx on public.business_members (user_id);

create table public.business_counters (
  business_id uuid not null references public.business(id) on delete cascade,
  kind text not null check (kind in ('job', 'certificate', 'training')),
  last_value bigint not null default 0,
  primary key (business_id, kind)
);

insert into public.business (id, name, slug, training_prefix)
select business_id, name, slug, training_prefix from _multitenant_cfg;

alter table public.business enable row level security;
alter table public.business_members enable row level security;
alter table public.business_counters enable row level security;

grant select, update on public.business to authenticated;
grant select, insert, update, delete on public.business_members to authenticated;
grant all on public.business, public.business_members, public.business_counters to service_role;

alter table public."user"
  add column active_business_id uuid references public.business(id) on delete set null;
alter table public."user" alter column role set default 'EMPLOYEE';

do $$
declare v_business uuid := (select business_id from _multitenant_cfg);
declare v_owner uuid;
begin
  select u.id into v_owner
  from public."user" u
  join auth.users a on a.id = u.id
  where u.role = 'SUPERADMIN'
  order by u.created_at, u.id
  limit 1;

  if v_owner is null then
    select u.id into v_owner
    from public."user" u
    join auth.users a on a.id = u.id
    order by u.created_at, u.id
    limit 1;
  end if;

  if v_owner is null then
    raise exception 'No public.user row matches auth.users; resolve identity before running this migration';
  end if;

  insert into public.business_members (business_id, user_id, role)
  select v_business, u.id,
    case
      when u.id = v_owner then 'OWNER'::public.business_role
      when u.role = 'SUPERADMIN' then 'ADMIN'::public.business_role
      else 'EMPLOYEE'::public.business_role
    end
  from public."user" u
  join auth.users a on a.id = u.id
  on conflict do nothing;

  update public."user" set active_business_id = v_business
  where exists (select 1 from public.business_members m where m.user_id = public."user".id);

  insert into public.business_counters (business_id, kind, last_value)
  values
    (v_business, 'job', coalesce((select case when is_called then last_value else 0 end from public.job_no_sequence), 0)),
    (v_business, 'certificate', coalesce((select case when is_called then last_value else 0 end from public.transaction_certificate_id_seq), 0)),
    (v_business, 'training', coalesce((select case when is_called then last_value else 0 end from public.certificate_id_seq), 0));
end $$;

create function public.current_business_id()
returns uuid
language sql stable security definer set search_path = '' as $$
  select m.business_id
  from public.business_members m
  join public.business b on b.id = m.business_id
  where m.user_id = auth.uid()
    and m.status = 'ACTIVE'
    and b.status = 'ACTIVE'
    and (
      m.business_id = nullif(auth.jwt() ->> 'business_id', '')::uuid
      or (
        nullif(auth.jwt() ->> 'business_id', '') is null
        and (select count(*) from public.business_members x
             where x.user_id = m.user_id and x.status = 'ACTIVE') = 1
      )
    )
  limit 1
$$;

create function public.current_business_role()
returns public.business_role
language sql stable security definer set search_path = '' as $$
  select m.role
  from public.business_members m
  where m.user_id = auth.uid()
    and m.status = 'ACTIVE'
    and m.business_id = public.current_business_id()
$$;

create function public.is_business_admin()
returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.current_business_role() in ('OWNER', 'ADMIN'), false)
$$;

revoke execute on function public.current_business_id(), public.current_business_role(), public.is_business_admin()
  from public, anon;
grant execute on function public.current_business_id(), public.current_business_role(), public.is_business_admin()
  to authenticated;

do $$
declare
  v_business uuid := (select business_id from _multitenant_cfg);
  t text;
begin
  foreach t in array array[
    'area','site','location','authority','owner','manufacturer','surveyor',
    'surveyor_competency','job_orders','equipment','lifting_equipment',
    'lifting_gear_single','lifting_gear_multi','lifting_gear_multi_equipments',
    'students_credentials'
  ] loop
    execute format(
      'alter table public.%I add column business_id uuid not null default %L references public.business(id)',
      t, v_business
    );
    execute format('alter table public.%I alter column business_id set default public.current_business_id()', t);
    execute format('create index %I on public.%I (business_id)', t || '_business_id_idx', t);
  end loop;

  foreach t in array array[
    'standard','annexure','property','property_list',
    'equipment_type','major_category','minor_category'
  ] loop
    execute format(
      'alter table public.%I add column business_id uuid references public.business(id)',
      t
    );
    execute format('alter table public.%I alter column business_id set default public.current_business_id()', t);
    execute format('create index %I on public.%I (business_id)', t || '_business_id_idx', t);
  end loop;
end $$;

create function public.assert_same_business()
returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  col text := tg_argv[0];
  parent text := tg_argv[1];
  ref bigint := (to_jsonb(new) ->> tg_argv[0])::bigint;
  ok boolean;
begin
  if ref is null then return new; end if;
  execute format(
    'select exists (
       select 1 from public.%I p
       where p.id = $1 and (p.business_id is null or p.business_id is not distinct from $2)
     )',
    parent
  ) into ok using ref, new.business_id;
  if not ok then
    raise exception 'cross-business reference: %.% -> %(%)', tg_table_name, col, parent, ref
      using errcode = '23503';
  end if;
  return new;
end $$;

do $$
declare r record;
begin
  for r in select * from (values
    ('equipment','annexure','annexure'), ('equipment','location','location'),
    ('equipment','manufacturer','manufacturer'), ('equipment','minor_category','minor_category'),
    ('equipment','owner_id','owner'), ('equipment','standard','standard'),
    ('job_orders','location','location'), ('job_orders','surveyor','surveyor'),
    ('lifting_equipment','authority','authority'), ('lifting_equipment','equipment_no','equipment'),
    ('lifting_equipment','job_order_no','job_orders'), ('lifting_equipment','location','location'),
    ('lifting_equipment','manufacturer','manufacturer'), ('lifting_equipment','owner_id','owner'),
    ('lifting_equipment','site','site'), ('lifting_equipment','standard','standard'),
    ('lifting_equipment','surveyor','surveyor'),
    ('lifting_gear_multi','area','area'), ('lifting_gear_multi','authority','authority'),
    ('lifting_gear_multi','equipment_no','equipment'), ('lifting_gear_multi','job_order_no','job_orders'),
    ('lifting_gear_multi','location','location'), ('lifting_gear_multi','manufacturer','manufacturer'),
    ('lifting_gear_multi','owner_address','owner'), ('lifting_gear_multi','owner_name','owner'),
    ('lifting_gear_multi','site','site'), ('lifting_gear_multi','standard','standard'),
    ('lifting_gear_multi','surveyor','surveyor'),
    ('lifting_gear_multi_equipments','lifting_gear_multi_id','lifting_gear_multi'),
    ('lifting_gear_single','authority','authority'), ('lifting_gear_single','equipment_no','equipment'),
    ('lifting_gear_single','job_order_no','job_orders'), ('lifting_gear_single','location','location'),
    ('lifting_gear_single','manufacturer','manufacturer'), ('lifting_gear_single','owner_name','owner'),
    ('lifting_gear_single','site','site'), ('lifting_gear_single','standard','standard'),
    ('lifting_gear_single','surveyor','surveyor'),
    ('location','site','site'), ('site','area','area'),
    ('surveyor_competency','surveyor_id','surveyor'),
    ('major_category','equipment_type','equipment_type'),
    ('minor_category','major_category','major_category'), ('minor_category','standard','standard'),
    ('property_list','annexure_id','annexure')
  ) as v(child, col, parent) loop
    execute format(
      'create trigger %I before insert or update of %I, business_id on public.%I
       for each row execute function public.assert_same_business(%L, %L)',
      'bz_chk_' || r.child || '_' || r.col, r.col, r.child, r.col, r.parent
    );
  end loop;
end $$;

do $$
declare t text; p record;
begin
  foreach t in array array[
    'area','site','location','authority','owner','manufacturer','surveyor',
    'surveyor_competency','job_orders','equipment','lifting_equipment',
    'lifting_gear_single','lifting_gear_multi','lifting_gear_multi_equipments',
    'students_credentials','standard','annexure','property','property_list',
    'equipment_type','major_category','minor_category','roles','user','A'
  ] loop
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
  end loop;
end $$;

do $$
declare t text;
begin
  foreach t in array array[
    'area','site','location','authority','owner','manufacturer','surveyor',
    'surveyor_competency','job_orders','equipment','lifting_equipment',
    'lifting_gear_single','lifting_gear_multi','lifting_gear_multi_equipments',
    'students_credentials'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy tenant_isolation on public.%I for all to authenticated
       using (business_id = (select public.current_business_id()))
       with check (business_id = (select public.current_business_id()))', t
    );
  end loop;

  foreach t in array array[
    'standard','annexure','property','property_list',
    'equipment_type','major_category','minor_category'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy catalog_select on public.%I for select to authenticated
       using (business_id is null or business_id = (select public.current_business_id()))', t
    );
    execute format(
      'create policy catalog_insert on public.%I for insert to authenticated
       with check (business_id = (select public.current_business_id()))', t
    );
    execute format(
      'create policy catalog_update on public.%I for update to authenticated
       using (business_id = (select public.current_business_id()))
       with check (business_id = (select public.current_business_id()))', t
    );
    execute format(
      'create policy catalog_delete on public.%I for delete to authenticated
       using (business_id = (select public.current_business_id()))', t
    );
  end loop;

  alter table public.roles enable row level security;
  create policy roles_read on public.roles for select to authenticated using (true);
  alter table public."A" enable row level security;
end $$;

create policy business_select on public.business for select to authenticated
  using (id in (select business_id from public.business_members
                where user_id = (select auth.uid()) and status = 'ACTIVE'));
create policy business_update on public.business for update to authenticated
  using (id = (select public.current_business_id()) and (select public.is_business_admin()))
  with check (id = (select public.current_business_id()) and (select public.is_business_admin()));

create policy members_select on public.business_members for select to authenticated
  using (user_id = (select auth.uid()) or business_id = (select public.current_business_id()));
create policy members_insert on public.business_members for insert to authenticated
  with check (business_id = (select public.current_business_id()) and (select public.is_business_admin()));
create policy members_update on public.business_members for update to authenticated
  using (business_id = (select public.current_business_id()) and (select public.is_business_admin()))
  with check (business_id = (select public.current_business_id()) and (select public.is_business_admin()));
create policy members_delete on public.business_members for delete to authenticated
  using (business_id = (select public.current_business_id()) and (select public.is_business_admin()));

create policy user_select on public."user" for select to authenticated
  using (id = (select auth.uid()) or id in (
    select user_id from public.business_members where business_id = (select public.current_business_id())
  ));
create policy user_insert on public."user" for insert to authenticated
  with check (id = (select auth.uid()));
create policy user_update on public."user" for update to authenticated
  using (id = (select auth.uid()) or (
    (select public.is_business_admin()) and id in (
      select user_id from public.business_members where business_id = (select public.current_business_id())
    )
  ))
  with check (true);

revoke update on public."user" from authenticated;
grant update (name, phone, avatar, code) on public."user" to authenticated;

alter view public.lifting_equipment_view set (security_invoker = true);
alter view public.lifting_gear_multi_view set (security_invoker = true);
alter view public.lifting_gear_single_view set (security_invoker = true);
alter view public.v_equipment set (security_invoker = true);
alter view public.unique_companies set (security_invoker = true);
alter view public.unique_courses set (security_invoker = true);
alter view public.unique_model_levels set (security_invoker = true);

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke execute on all functions in schema public from anon;

create function public.next_business_number(p_business uuid, p_kind text)
returns bigint language sql security definer set search_path = '' as $$
  insert into public.business_counters as c (business_id, kind, last_value)
  values (p_business, p_kind, 1)
  on conflict (business_id, kind) do update set last_value = c.last_value + 1
  returning last_value
$$;
revoke execute on function public.next_business_number(uuid, text) from public, anon, authenticated;

create or replace function public.set_job_no()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.job_no = (select b.job_prefix from public.business b where b.id = new.business_id)
             || '-' || to_char(current_date, 'YY')
             || '-' || lpad(public.next_business_number(new.business_id, 'job')::text, 4, '0');
  return new;
end $$;

drop function if exists public.generate_transaction_no();
create function public.generate_transaction_no(p_business uuid)
returns text language sql security definer set search_path = '' as $$
  select b.certificate_prefix || '-' || to_char(current_date, 'YY')
         || '-' || lpad(public.next_business_number(b.id, 'certificate')::text, 4, '0')
  from public.business b where b.id = p_business
$$;

create or replace function public.set_certificate_no_before_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.certificate_no := public.generate_transaction_no(new.business_id);
  return new;
end $$;

create or replace function public.generate_card_and_certificate_no()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.card_no = (select b.training_prefix from public.business b where b.id = new.business_id)
              || '-' || to_char(current_date, 'YY')
              || '-' || lpad(public.next_business_number(new.business_id, 'training')::text, 4, '0');
  new.certificate_no = new.card_no;
  return new;
end $$;

create function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare claims jsonb := event -> 'claims'; bid uuid; brole public.business_role;
begin
  select m.business_id, m.role into bid, brole
  from public.business_members m
  left join public."user" u on u.id = m.user_id
  where m.user_id = (event ->> 'user_id')::uuid and m.status = 'ACTIVE'
  order by (m.business_id = u.active_business_id) desc nulls last, m.created_at
  limit 1;
  claims := jsonb_set(claims, '{business_id}', coalesce(to_jsonb(bid), 'null'::jsonb));
  claims := jsonb_set(claims, '{business_role}', coalesce(to_jsonb(brole::text), 'null'::jsonb));
  return jsonb_set(event, '{claims}', claims);
end $$;

create function public.set_active_business(p_business uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.business_members
    where business_id = p_business and user_id = auth.uid() and status = 'ACTIVE'
  ) then raise exception 'not a member of that business' using errcode = '42501'; end if;
  update public."user" set active_business_id = p_business where id = auth.uid();
end $$;

create function public.create_business(p_name text, p_slug text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '42501'; end if;
  insert into public.business (id, name, slug) values (gen_random_uuid(), p_name, p_slug) returning id into new_id;
  insert into public.business_members (business_id, user_id, role) values (new_id, auth.uid(), 'OWNER');
  insert into public.business_counters (business_id, kind) values
    (new_id, 'job'), (new_id, 'certificate'), (new_id, 'training');
  update public."user" set active_business_id = new_id where id = auth.uid();
  return new_id;
end $$;

revoke execute on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant usage on schema public to supabase_auth_admin;
grant select on public."user", public.business_members to supabase_auth_admin;

revoke execute on function public.set_active_business(uuid), public.create_business(text, text)
  from public, anon;
grant execute on function public.set_active_business(uuid), public.create_business(text, text)
  to authenticated;

do $$
declare n int;
begin
  select count(*) into n from public."user" u
  where not exists (select 1 from public.business_members m where m.user_id = u.id);
  if n > 0 then
    raise warning '% public.user row(s) have no business membership', n;
  end if;
end $$;

commit;
