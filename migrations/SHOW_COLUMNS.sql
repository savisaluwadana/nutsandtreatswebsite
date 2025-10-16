-- SIMPLE DIAGNOSTIC: Just show what columns exist
-- This will ALWAYS work

SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
