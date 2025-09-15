-- Migration 003: Finalize numeric category_id and cleanup legacy text columns
-- WARNING: Run only after running migrations 001/002 and after verifying mappings. Backup DB first.

BEGIN;

-- Safety checks
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='int_id') THEN
    RAISE EXCEPTION 'Expected categories.int_id to exist. Run migration 001 first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category_id') THEN
    RAISE EXCEPTION 'Expected products.category_id to exist. Run migration 001 first.';
  END IF;
  IF EXISTS (SELECT 1 FROM products WHERE category_id IS NULL) THEN
    RAISE EXCEPTION 'Found products with NULL category_id. Resolve these records before running final cleanup.';
  END IF;
END$$;

-- 1) Rename categories.int_id -> category_id (we'll keep the human-readable name column as-is)
-- If the categories table currently has an `id` text PK (legacy), we will not attempt to change it here.
ALTER TABLE categories RENAME COLUMN int_id TO category_id;

-- 2) Ensure category_id is NOT NULL and create PK on category_id if desired
ALTER TABLE categories ALTER COLUMN category_id SET NOT NULL;

-- If categories currently uses text id as PK and you prefer numeric PK, run migration 002 (promote int_id) before this step.
-- 3) Update products FK to reference categories(category_id) if appropriate
-- First drop existing FK (if any) and add a new one pointing to categories.category_id
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
-- If categories has a primary key on category_id, create FK referencing categories(category_id)
-- Otherwise we still create an FK referencing categories(category_id) (Postgres allows FK to any column that has an index)
ALTER TABLE IF EXISTS products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL;

-- 4) Drop legacy products.category text column
ALTER TABLE IF EXISTS products DROP COLUMN IF EXISTS category;

-- 5) Rename categories.name -> category (if you want the column to be `category` instead of `name`)
-- The attachment shows a `name` column already; the request wants a `category` column — perform the rename.
ALTER TABLE IF EXISTS categories RENAME COLUMN name TO category;

-- 6) Optionally rename categories.slug -> slug (kept as-is), description stays.

COMMIT;

-- After running:
-- - Verify categories table: SELECT category_id, category, slug, description FROM categories LIMIT 50;
-- - Verify products: SELECT id, name, category_id FROM products LIMIT 50;
