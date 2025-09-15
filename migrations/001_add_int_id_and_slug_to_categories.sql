-- Migration 001: Add numeric id (int_id) and slug to categories, map products.category -> products.category_id
-- Run this first. It's non-destructive and safe to run in production, but take a DB backup first.

BEGIN;

-- 1) Add a new integer identity column for categories. We call it int_id for now.
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS int_id BIGINT;

-- Create sequence and default nextval if int_id has no default
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_attrdef a JOIN pg_class c ON a.adrelid = c.oid WHERE c.relname = 'categories' AND a.adbin::text LIKE '%nextval%categories_int_id_seq%') THEN
    CREATE SEQUENCE IF NOT EXISTS categories_int_id_seq;
    ALTER TABLE categories ALTER COLUMN int_id SET DEFAULT nextval('categories_int_id_seq');
  END IF;
EXCEPTION WHEN undefined_table THEN
  -- categories table missing; let the error surface normally below
  RAISE;
END$$;

-- Populate int_id for existing rows where null
UPDATE categories SET int_id = nextval('categories_int_id_seq') WHERE int_id IS NULL;

-- 2) Add a slug column (text) and populate from name (or existing id if appropriate).
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS slug TEXT;
UPDATE categories
SET slug = lower(regexp_replace(coalesce(name, id::text), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- 3) Create a unique index for slug to prevent duplicates going forward
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique ON categories (slug);

-- 4) Add a numeric category_id on products and attempt to map existing products by matching category text
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS category_id BIGINT;

-- Try mapping by product.category matching category name, old category id text, or slug.
UPDATE products p
SET category_id = c.int_id
FROM categories c
WHERE (p.category IS NOT NULL)
  AND (
    p.category = c.name
    OR p.category = c.id::text
    OR p.category = c.slug
  );

-- 5) Show unmapped products for manual review (run this SELECT after migration)
-- SELECT * FROM products WHERE category_id IS NULL LIMIT 100;

COMMIT;

-- NOTE:
-- * Review products with NULL category_id and fix the source data or categories table before continuing.
-- * After you confirm correct mapping and no issues, proceed to the second migration which replaces the old text id.
