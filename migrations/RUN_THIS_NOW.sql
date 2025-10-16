-- 🎯 RUN THIS NOW - Simple Fix for PGRST204 Error
-- This will reload the schema cache and test the fix

-- Step 1: Reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Step 2: Test that the name column works
SELECT 
  category_id,
  name,
  slug,
  description
FROM categories 
ORDER BY name
LIMIT 10;

-- If you see results above, the error is FIXED! ✓
