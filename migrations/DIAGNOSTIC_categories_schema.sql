-- DIAGNOSTIC: Check current categories table structure
-- Run this FIRST to understand your current schema

-- 1. Show all columns in categories table
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- 2. Show all constraints
SELECT
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'categories'::regclass;

-- 3. Show sample data (first 5 rows)
SELECT * FROM categories LIMIT 5;

-- 4. Show total row count
SELECT COUNT(*) as total_rows FROM categories;
