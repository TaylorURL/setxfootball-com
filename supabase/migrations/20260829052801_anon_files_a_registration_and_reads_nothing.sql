-- The signed-out visitor files a registration and reads nothing back.
--
-- The select policy named anon among its roles and the schema carried the
-- matching grant, so camp_registrations was reachable with the publishable key
-- that ships in every page. Nothing came back through it: the predicate needs a
-- session, and a parent filing without an account has none, so every row was
-- filtered away. A grant that returns nothing today is still a grant, and it
-- sits one predicate edit away from returning all of them.
--
-- Filing the registration is the one thing anon does on this table, and the
-- insert policy still admits it. The client mints the row id rather than reading
-- it back, so no returning clause depends on select.

revoke select on public.camp_registrations from anon;

drop policy if exists "registrations read by their family and by staff" on public.camp_registrations;
create policy "registrations read by their family and by staff"
  on public.camp_registrations
  for select
  to authenticated
  using (
    ((select auth.uid()) is not null and user_id = (select auth.uid()))
    or (
      (select auth.jwt() ->> 'email') is not null
      and lower(parent_email) = lower((select auth.jwt() ->> 'email'))
    )
    or (select public.is_camp_staff())
  );

-- Every policy that consults the staff check now names authenticated, and the
-- insert policy anon is left with does not call it.
revoke execute on function public.is_camp_staff() from anon;
