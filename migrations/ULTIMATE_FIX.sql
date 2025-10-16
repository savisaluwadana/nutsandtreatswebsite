-- ULTIMATE FIX: Rename 'category' to 'name' with error handling
-- This will work even if the column state is uncertain

DO $$
DECLARE
  has_category_col boolean;
  has_name_col boolean;
BEGIN
  -- Check what columns exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'category'
  ) INTO has_category_col;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'name'
  ) INTO has_name_col;
  
  -- Log current state
  RAISE NOTICE 'Has category column: %', has_category_col;
  RAISE NOTICE 'Has name column: %', has_name_col;
  
  -- Perform rename if needed
  IF has_category_col AND NOT has_name_col THEN
    ALTER TABLE categories RENAME COLUMN category TO name;
    RAISE NOTICE '✓ Successfully renamed category to name';
  ELSIF has_name_col THEN
    RAISE NOTICE '✓ Column name already exists, no action needed';
  ELSE
    RAISE EXCEPTION 'Neither category nor name column exists!';
  END IF;
END$$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';

-- Show final result
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
