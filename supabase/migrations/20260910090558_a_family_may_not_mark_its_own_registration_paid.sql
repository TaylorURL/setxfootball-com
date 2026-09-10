-- A family corrects its registration. It does not price it, and it does not pay it.
--
-- The update policy admits a family for the whole row. Both its predicate and
-- its check ask only whose row this is, never which columns moved, so a signed-in
-- parent could PATCH camp_registrations with the publishable key that ships in
-- every page and set payment_status to paid. Nothing in the interface offers it;
-- the key and the table name are both public, which is the whole of what an
-- attempt needs.
--
-- A policy cannot express this. WITH CHECK sees the new row and never the old
-- one, so it can say a family owns this row and cannot say payment_status is
-- where it was. That comparison needs a trigger, and this is it.
--
-- Three columns belong to staff or to the system and a family write may not move
-- them at all:
--
--   payment_status  the money, and the reason this exists
--   user_id         who owns the row, so a change here hands it to somebody else
--   camp_year       which roster the row appears on; moving it hides a signup
--                   from the year staff are actually looking at
--
-- total_cost is not in that list, because a family legitimately changes it: the
-- dashboard recomputes it whenever shirt quantity changes, and refusing that
-- would break the edit that is genuinely theirs. What a family may not do is
-- change what a shirt costs. Rather than teach the database a price it would
-- then hold a second copy of - one edit away from disagreeing with the client's
-- and refusing every honest edit - the rule reads the unit price off the row's
-- own history: total_cost may move, in step with shirt_quantity and no further.
-- The comparison is cross-multiplied so it stays in exact numeric arithmetic.
--
-- The guard is for the browser and nothing else, so it applies only to the two
-- roles PostgREST switches into. A migration, the SQL editor and any future
-- service-role caller run as other roles and pass through untouched, which also
-- means this cannot wedge an operator out of fixing a row by hand. It runs as
-- the invoker rather than as the definer for the same reason: current_user has
-- to be the caller's role to be worth reading.

create or replace function public.camp_registrations_family_keeps_its_lane()
returns trigger
language plpgsql
set search_path = ''
as $$
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

drop trigger if exists camp_registrations_family_keeps_its_lane on public.camp_registrations;
create trigger camp_registrations_family_keeps_its_lane
  before update on public.camp_registrations
  for each row
  execute function public.camp_registrations_family_keeps_its_lane();

-- A trigger function has no caller outside the trigger, and PostgREST exposes
-- every function in the schema it serves.
revoke execute on function public.camp_registrations_family_keeps_its_lane() from public, anon, authenticated;
