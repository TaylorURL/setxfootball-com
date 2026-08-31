-- Least privilege for the two roles the publishable key can reach.
--
-- Both tables were carrying the schema-wide default: every privilege granted to
-- anon and to authenticated, including TRUNCATE, REFERENCES and TRIGGER. Row
-- level security gates SELECT, INSERT, UPDATE and DELETE, so the policies were
-- holding those four -- a signed-out DELETE against a real row was measured and
-- changed nothing. TRUNCATE is the one that matters: it is not a row operation
-- and no policy is consulted for it, so the grant stood over a hundred families'
-- names, phone numbers and emergency contacts with nothing in front of it.
--
-- What each role is left with is what the application actually calls. A parent
-- files a registration without an account, which is the one write anon makes.
-- Everything else is a signed-in action.

revoke all on public.camp_registrations from anon, authenticated;
revoke all on public.user_profiles from anon, authenticated;

grant select, insert on public.camp_registrations to anon;
grant select, insert, update, delete on public.camp_registrations to authenticated;

-- anon is absent here on purpose: no policy on user_profiles admits it, so the
-- grant only ever described access the policies refused.
grant select, update on public.user_profiles to authenticated;

-- The row a signup creates is written by the trigger below, which runs as its
-- owner, so no client role needs insert.

-- The trigger function ran with whatever search_path the auth server's session
-- carried. It is security definer, so that path decided which schema's
-- user_profiles a signup wrote to.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.user_profiles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$;

-- A trigger function has no caller outside the trigger, and PostgREST exposes
-- every function in the schema it serves.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- The policies below are the ones already in force, rewritten so that auth.uid()
-- and auth.jwt() are evaluated once per statement rather than once per row.
-- Postgres treats a bare auth.uid() in a policy as row-dependent and re-runs it
-- for every row scanned; wrapping it in a scalar subquery lets the planner hoist
-- it into an InitPlan. Who may see what does not change.

drop policy if exists "registrations read by their family and by staff" on public.camp_registrations;
create policy "registrations read by their family and by staff"
  on public.camp_registrations
  for select
  to anon, authenticated
  using (
    ((select auth.uid()) is not null and user_id = (select auth.uid()))
    or (
      (select auth.jwt() ->> 'email') is not null
      and lower(parent_email) = lower((select auth.jwt() ->> 'email'))
    )
    or (select public.is_camp_staff())
  );

drop policy if exists "anyone may file a registration in their own name" on public.camp_registrations;
create policy "anyone may file a registration in their own name"
  on public.camp_registrations
  for insert
  to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));

drop policy if exists "a family corrects its own registration, staff correct any" on public.camp_registrations;
create policy "a family corrects its own registration, staff correct any"
  on public.camp_registrations
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    or (
      (select auth.jwt() ->> 'email') is not null
      and lower(parent_email) = lower((select auth.jwt() ->> 'email'))
    )
    or (select public.is_camp_staff())
  )
  with check (
    user_id = (select auth.uid())
    or (
      (select auth.jwt() ->> 'email') is not null
      and lower(parent_email) = lower((select auth.jwt() ->> 'email'))
    )
    or (select public.is_camp_staff())
  );

drop policy if exists "a family withdraws its own registration, staff withdraw any" on public.camp_registrations;
create policy "a family withdraws its own registration, staff withdraw any"
  on public.camp_registrations
  for delete
  to authenticated
  using (
    user_id = (select auth.uid())
    or (
      (select auth.jwt() ->> 'email') is not null
      and lower(parent_email) = lower((select auth.jwt() ->> 'email'))
    )
    or (select public.is_camp_staff())
  );

drop policy if exists "a user reads their own profile, staff read every profile" on public.user_profiles;
create policy "a user reads their own profile, staff read every profile"
  on public.user_profiles
  for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_camp_staff()));
