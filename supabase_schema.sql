-- SETX Football Camp Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/mdxydyeqtoffsepvxqmg/sql)

-- Drop existing tables if they exist (clean start)
DROP TABLE IF EXISTS camp_registrations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create camp_registrations table
CREATE TABLE camp_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    kid_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    nickname TEXT,
    shirt_size TEXT NOT NULL,
    shirt_quantity INTEGER NOT NULL DEFAULT 1,
    total_cost NUMERIC(10, 2) NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT NOT NULL,
    emergency_name TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    emergency_relation TEXT NOT NULL,
    cashapp_username TEXT,
    payment_status TEXT DEFAULT 'pending',
    camp_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_profiles table for storing user roles
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_registrations_parent_email ON camp_registrations(parent_email);
CREATE INDEX idx_registrations_camp_year ON camp_registrations(camp_year);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Enable Row-Level Security
ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Revoke anonymous access entirely
REVOKE ALL ON camp_registrations FROM anon;
REVOKE ALL ON user_profiles FROM anon;

-- Grant authenticated users table-level permissions (RLS policies restrict row access)
GRANT SELECT, INSERT, UPDATE, DELETE ON camp_registrations TO authenticated;
GRANT SELECT, INSERT ON user_profiles TO authenticated;

-- camp_registrations policies: users manage their own rows
CREATE POLICY "Users can view own registrations"
  ON camp_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations"
  ON camp_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON camp_registrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own registrations"
  ON camp_registrations FOR DELETE
  USING (auth.uid() = user_id);

-- Staff and admin can view all registrations
CREATE POLICY "Staff can view all registrations"
  ON camp_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('staff', 'admin')
    )
  );

-- Staff and admin can update all registrations (e.g. payment status)
CREATE POLICY "Staff can update all registrations"
  ON camp_registrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
        AND user_profiles.role IN ('staff', 'admin')
    )
  );

-- user_profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'user');

CREATE POLICY "Staff can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles AS up
      WHERE up.user_id = auth.uid()
        AND up.role IN ('staff', 'admin')
    )
  );
