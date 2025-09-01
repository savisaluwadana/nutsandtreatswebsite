-- Helper script to work with real Supabase Auth users
-- Run these queries in your Supabase SQL editor to get real user IDs

-- 1. First, check if you have any existing auth users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. If you need to create test users, you can do it through the Supabase Auth interface
-- or use the Supabase client in your app. Here's what the user creation would look like:

/*
-- Example of creating users programmatically (this won't work in SQL editor)
-- You'd need to use Supabase client in JavaScript/TypeScript:

const { data, error } = await supabase.auth.signUp({
  email: 'john@example.com',
  password: 'securepassword123',
  options: {
    data: {
      full_name: 'John Smith'
    }
  }
})
*/

-- 3. Once you have real user IDs, replace the UUIDs in test_data.sql
-- Here's a template for updating the test_data.sql file:

-- Example: If your real user IDs are:
-- user1: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
-- user2: 'b2c3d4e5-f6g7-8901-bcde-f23456789012'
-- etc.

-- 4. Alternative: Create dummy auth users for testing (be careful in production!)
-- This creates auth users without going through the normal signup process:

/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'john@nutsandtreats.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "John Smith"}',
  false,
  '',
  '',
  '',
  ''
);
*/

-- 5. Quick way to update test_data.sql with your real user IDs:
-- First get your user IDs:
SELECT 
  'Replace UUID in test_data.sql:' as instruction,
  'Old: ''11111111-1111-1111-1111-111111111111''' as old_value,
  'New: ''' || id || '''' as new_value,
  email
FROM auth.users 
LIMIT 4;

-- 6. Verify user_profiles were created automatically by the trigger
SELECT 
  up.id,
  up.full_name,
  up.isadmin,
  au.email
FROM public.user_profiles up
JOIN auth.users au ON up.id = au.id
ORDER BY up.created_at DESC;

-- 7. If user_profiles weren't created automatically, create them manually:
/*
INSERT INTO public.user_profiles (id, full_name, isadmin)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  false
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);
*/

-- 8. Make one user an admin for testing:
/*
UPDATE public.user_profiles 
SET isadmin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com');
*/
