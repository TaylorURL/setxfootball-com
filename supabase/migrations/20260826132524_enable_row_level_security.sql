-- Row level security for the two tables the browser client reaches.
--
-- The publishable key ships in every visitor's bundle, so a filter written in
-- the client is a suggestion: the same request can be made again without it.
-- These policies are where ownership is decided.
--
-- A family is recognised two ways, because a registration can be filed without
-- an account: by the user id on the row when one was signed in, and by the
-- verified email address on the session matching the parent email on the row.

create or replace function public.is_camp_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where user_id = auth.uid()
      and role in ('staff', 'admin')
  );
$$;

revoke execute on function public.is_camp_staff() from public;
grant execute on function public.is_camp_staff() to anon, authenticated;

-- The signed-in user's own profile row, resolved in the database rather than by
-- a predicate the browser sends. Security invoker, so the select policy below
-- still applies.
create or replace function public.current_profile()
returns setof public.user_profiles
language sql
stable
security invoker
set search_path = public
as $$
  select * from public.user_profiles where user_id = auth.uid();
$$;

grant execute on function public.current_profile() to authenticated;

alter table public.camp_registrations enable row level security;
alter table public.user_profiles enable row level security;

create policy "registrations read by their family and by staff"
  on public.camp_registrations
  for select
  to anon, authenticated
  using (
    (auth.uid() is not null and user_id = auth.uid())
    or (
      auth.jwt() ->> 'email' is not null
      and lower(parent_email) = lower(auth.jwt() ->> 'email')
    )
    or public.is_camp_staff()
  );

create policy "anyone may file a registration in their own name"
  on public.camp_registrations
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

create policy "a family corrects its own registration, staff correct any"
  on public.camp_registrations
  for update
  to authenticated
  using (
    user_id = auth.uid()
    or (
      auth.jwt() ->> 'email' is not null
      and lower(parent_email) = lower(auth.jwt() ->> 'email')
    )
    or public.is_camp_staff()
  )
  with check (
    user_id = auth.uid()
    or (
      auth.jwt() ->> 'email' is not null
      and lower(parent_email) = lower(auth.jwt() ->> 'email')
    )
    or public.is_camp_staff()
  );

create policy "a family withdraws its own registration, staff withdraw any"
  on public.camp_registrations
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    or (
      auth.jwt() ->> 'email' is not null
      and lower(parent_email) = lower(auth.jwt() ->> 'email')
    )
    or public.is_camp_staff()
  );

create policy "a user reads their own profile, staff read every profile"
  on public.user_profiles
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_camp_staff());

-- Only staff move a role. Without this, a signed-in user could write their own
-- row and name themselves staff, which is the whole panel.
create policy "staff set roles"
  on public.user_profiles
  for update
  to authenticated
  using (public.is_camp_staff())
  with check (public.is_camp_staff());
