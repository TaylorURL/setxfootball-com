-- Fix #14: Restrict regular users from updating payment_status on their own registrations.
--
-- The existing "Users can update own registrations" policy allows any column
-- to be changed, including payment_status, which should be staff-only.
-- This replaces it with a policy that blocks updates when payment_status is
-- being changed (i.e. the new value differs from the old value).

DROP POLICY IF EXISTS "Users can update own registrations" ON camp_registrations;

CREATE POLICY "Users can update own registrations"
  ON camp_registrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND payment_status IS NOT DISTINCT FROM OLD.payment_status
  );
