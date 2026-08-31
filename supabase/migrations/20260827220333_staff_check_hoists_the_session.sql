-- The staff check reads the session once per statement, not once per row.
--
-- Wrapping `public.is_camp_staff()` in a scalar subquery at each call site was
-- not enough: it is a stable SQL function, so the planner inlines its body into
-- the policy, and the bare `auth.uid()` inside it comes back out per row. The
-- hoist has to happen in the function as well as around it.
--
-- The remaining policy on user_profiles is rewritten for the same reason.

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
    where user_id = (select auth.uid())
      and role in ('staff', 'admin')
  );
$$;

drop policy if exists "staff set roles" on public.user_profiles;
create policy "staff set roles"
  on public.user_profiles
  for update
  to authenticated
  using ((select public.is_camp_staff()))
  with check ((select public.is_camp_staff()));
