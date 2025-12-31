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

-- Disable RLS for simplicity (enable later with proper policies if needed)
ALTER TABLE camp_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Grant full access to all users
GRANT ALL ON camp_registrations TO anon;
GRANT ALL ON camp_registrations TO authenticated;
GRANT ALL ON user_profiles TO anon;
GRANT ALL ON user_profiles TO authenticated;

