-- Fix #13: Prevent users from self-assigning admin or staff roles on profile creation.
--
-- The existing INSERT policy only checks auth.uid() = user_id, allowing any
-- authenticated user to insert a profile with role = 'admin' or 'staff'.
-- This enforces that new profiles must use the default role ('user').

DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'user');
