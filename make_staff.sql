-- Run this in Supabase SQL Editor to grant staff role to a user.
-- Replace YOUR_USER_ID_HERE with the target user's UUID from Auth > Users.

DELETE FROM user_profiles WHERE user_id = 'YOUR_USER_ID_HERE';

INSERT INTO user_profiles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'staff');
