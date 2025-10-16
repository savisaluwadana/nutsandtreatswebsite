-- FIX: Reload Supabase schema cache
-- The 'name' column already exists, but Supabase PostgREST needs to reload its cache

-- Method 1: Reload schema cache
NOTIFY pgrst, 'reload schema';

-- Method 2: If the above doesn't work, you can also try reloading config
NOTIFY pgrst, 'reload config';

-- Verify the name column exists
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'categories' 
  AND column_name = 'name';

-- Test query to ensure it works
SELECT category_id, name, slug FROM categories LIMIT 5;
