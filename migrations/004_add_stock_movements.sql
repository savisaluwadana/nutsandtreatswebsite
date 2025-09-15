-- Migration 004: Stock movement logging table
-- Creates a table to record every inventory change.
-- Run after previous migrations. Safe to run multiple times (IF NOT EXISTS guards).

BEGIN;

CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGSERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  change INTEGER NOT NULL,
  old_quantity INTEGER,
  new_quantity INTEGER,
  reason TEXT,
  source TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id_created_at
  ON stock_movements(product_id, created_at DESC);

COMMIT;

-- Optionally add RLS & policies later restricting to admins only.