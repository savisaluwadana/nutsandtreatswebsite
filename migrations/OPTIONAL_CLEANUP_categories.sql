-- OPTIONAL CLEANUP: Remove leftover migration columns
-- This is optional but recommended to clean up the schema
-- BACKUP YOUR DATABASE BEFORE RUNNING THIS!

BEGIN;

-- Show current columns before cleanup
SELECT 'Before cleanup:' as status, column_name
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- Remove old_text_id if it exists (leftover from migration 002)
ALTER TABLE categories DROP COLUMN IF EXISTS old_text_id;

-- Remove int_id if it exists (leftover from migration 001)
ALTER TABLE categories DROP COLUMN IF EXISTS int_id;

-- Show columns after cleanup
SELECT 'After cleanup:' as status, column_name
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

COMMIT;

-- Reload schema cache after changes
NOTIFY pgrst, 'reload schema';

-- Final verification
SELECT category_id, name, slug, description 
FROM categories 
LIMIT 5;
