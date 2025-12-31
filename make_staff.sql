-- Run this in Supabase SQL Editor to make yourself staff
-- First, delete any existing profile for your user (in case one exists)
DELETE FROM user_profiles WHERE user_id = '20835b27-330f-4776-9e8a-64f5e4640aac';

-- Insert your user profile with staff role
INSERT INTO user_profiles (user_id, role)
VALUES ('20835b27-330f-4776-9e8a-64f5e4640aac', 'staff');

