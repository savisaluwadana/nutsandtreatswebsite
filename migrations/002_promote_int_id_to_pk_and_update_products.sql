-- Migration 002: Promote int_id to primary key, update products FK to categories(id)
-- WARNING: This is destructive. Run only after confirming migration 001 results and after a full backup.

BEGIN;

-- 0) Safety checks: ensure int_id exists and slug unique index exists
SELECT 1 FROM pg_class WHERE relname = 'categories' LIMIT 1;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='int_id') THEN
    RAISE EXCEPTION 'int_id column missing on categories. Run migration 001 first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename='categories' AND indexname='idx_categories_slug_unique') THEN
    RAISE NOTICE 'Slug unique index missing; proceeding but check slug uniqueness manually.';
  END IF;
END$$;

-- 1) Ensure no products have NULL category_id unless you intend to allow that
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM products WHERE category_id IS NULL) THEN
    RAISE EXCEPTION 'Found products with NULL category_id. Resolve these records before promoting int_id to id.';
  END IF;
END$$;

-- 2) Drop constraints that reference categories.id (text PK) — find and drop foreign keys.
-- Note: This step assumes no other tables reference categories.id as text. If they do, please add similar ALTER TABLE ... DROP CONSTRAINT statements.
-- Example: ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_fkey;

-- 3) Rename existing id to old_text_id, and rename int_id to id, then set as primary key
ALTER TABLE categories RENAME COLUMN id TO old_text_id;
ALTER TABLE categories RENAME COLUMN int_id TO id;

-- 4) Set id type to BIGINT and make it primary key with sequence ownership
ALTER TABLE categories ALTER COLUMN id SET NOT NULL;
ALTER TABLE categories ADD PRIMARY KEY (id);

-- If a sequence exists, ensure the sequence is owned by the new id
ALTER SEQUENCE IF EXISTS categories_int_id_seq OWNED BY categories.id;

-- 5) Update products.category_id foreign key to reference categories(id)
-- First drop any existing FK constraint on products.category_id (if present)
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- 6) Optionally drop old text category columns and old_text_id if you no longer need them.
-- Be very cautious: drop only after verifying everything works.
-- ALTER TABLE products DROP COLUMN IF EXISTS category;
-- ALTER TABLE categories DROP COLUMN IF EXISTS old_text_id;

COMMIT;

-- AFTER RUN:
-- * Verify application code writes/reads categories using numeric ids.
-- * If you dropped `products.category`, adjust any code that referenced it.
