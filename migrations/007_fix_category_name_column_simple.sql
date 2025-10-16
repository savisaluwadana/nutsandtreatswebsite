-- Migration 007: Fix category column name (Simple Version)
-- This directly renames 'category' to 'name' without complex checks

-- Step 1: Check current state
SELECT 
  'Current categories columns:' as info,
  string_agg(column_name || ' (' || data_type || ')', ', ') as columns
FROM information_schema.columns 
WHERE table_name = 'categories';

-- Step 2: Rename the column (will fail gracefully if column doesn't exist)
ALTER TABLE categories RENAME COLUMN category TO name;

-- Step 3: Reload schema cache
NOTIFY pgrst, 'reload schema';

-- Step 4: Verify the change
SELECT 
  'Updated categories columns:' as info,
  string_agg(column_name || ' (' || data_type || ')', ', ') as columns
FROM information_schema.columns 
WHERE table_name = 'categories';
