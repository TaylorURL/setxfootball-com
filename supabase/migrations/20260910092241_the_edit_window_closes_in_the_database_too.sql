-- The three days the site promises a parent, kept by the database rather than
-- by the browser alone.
--
-- `RegistrationService.canEdit` measures the window and the dashboard hides the
-- Edit button when it closes, which is the whole of the enforcement. The update
-- policy carries no time condition, so a family that goes to PostgREST directly
-- can still correct a registration months later - and `created_at` is the value
-- the window is measured from, so it could also simply be moved forward.
--
-- Freezing `created_at` on its own would have been theatre. It is not worth
-- anything to an attacker while the window it feeds is not enforced anywhere
-- the attacker has to go through. The two only mean something together, which
-- is why they land together.
--
-- The boundary is the browser's own, read out of `getDaysSince`: it divides the
-- elapsed milliseconds by a day and rounds up, and `canEdit` accepts a result of
-- EDIT_WINDOW_DAYS or less, so the window closes once more than three whole days
-- have passed. The rounding changes how many days the page says are left, never
-- where the edge is.
--
-- The database is given an hour more than that. The browser must always be the
-- stricter of the two, because the failure that matters is a parent shown an
-- Edit button whose save is then refused; an hour covers a clock that disagrees
-- and the minutes between a page rendering and somebody pressing Save.
--
-- EDIT_WINDOW_DAYS lives in src/utils/constants.js and is now written down here
-- as well, which is the one thing to watch: lengthening it there without
-- lengthening it here gives parents a button this trigger refuses. Shortening it
-- there is safe on its own, because the browser closes first.
--
-- Staff are exempt, so the camp can still fix a registration in week three, and
-- the guard applies only to the roles PostgREST switches into, so a migration,
-- the SQL editor and any service-role caller pass straight through.

create or replace function public.camp_registrations_family_keeps_its_lane()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  edit_window constant interval := interval '3 days' + interval '1 hour';
begin
  -- Anything that is not a browser session is not what this guards.
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if (select public.is_camp_staff()) then
    return new;
  end if;

  if new.payment_status is distinct from old.payment_status then
    raise exception 'payment_status is set by camp staff'
      using errcode = 'check_violation';
  end if;

  if new.user_id is distinct from old.user_id then
    raise exception 'user_id cannot be reassigned'
      using errcode = 'check_violation';
  end if;

  if new.camp_year is distinct from old.camp_year then
    raise exception 'camp_year cannot be changed'
      using errcode = 'check_violation';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'created_at cannot be changed'
      using errcode = 'check_violation';
  end if;

  if old.created_at is not null and now() - old.created_at > edit_window then
    raise exception 'the edit window for this registration has closed; the camp can still make changes'
      using errcode = 'check_violation';
  end if;

  -- The price per shirt is whatever this row already carries. A quantity of zero
  -- leaves nothing to read it from, so the cost simply may not move.
  if old.shirt_quantity > 0 then
    if new.total_cost * old.shirt_quantity is distinct from old.total_cost * new.shirt_quantity then
      raise exception 'total_cost must follow shirt_quantity at the price on the registration'
        using errcode = 'check_violation';
    end if;
  elsif new.total_cost is distinct from old.total_cost then
    raise exception 'total_cost cannot be changed on a registration with no shirts'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;
