-- Migration 007: Fix category column name
-- This migration reverts the column rename from migration 003
-- The application expects the column to be named 'name', not 'category'

BEGIN;

-- First, display current schema for debugging
DO $$
DECLARE
  col_record RECORD;
BEGIN
  RAISE NOTICE 'Current categories table columns:';
  FOR col_record IN 
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_name='categories' 
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '  - % (type: %, nullable: %)', col_record.column_name, col_record.data_type, col_record.is_nullable;
  END LOOP;
END$$;

-- Check if the column 'category' exists (and 'name' doesn't)
DO $$
BEGIN
  -- First check: Do we have 'category' column but not 'name'?
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='categories' AND column_name='category'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='categories' AND column_name='name'
  ) THEN
    -- Rename 'category' back to 'name'
    ALTER TABLE categories RENAME COLUMN category TO name;
    RAISE NOTICE '✓ Successfully renamed categories.category to categories.name';
    
  -- Second check: Do we already have 'name'?
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='categories' AND column_name='name'
  ) THEN
    RAISE NOTICE '✓ Column categories.name already exists, no action needed';
    
  -- Third check: Maybe we have neither - this is an error state
  ELSE
    RAISE EXCEPTION 'Unexpected schema state: neither name nor category column exists in categories table';
  END IF;
END$$;

COMMIT;

-- Verify the fix - show final schema
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
