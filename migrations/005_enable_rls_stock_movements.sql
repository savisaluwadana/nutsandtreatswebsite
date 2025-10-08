-- Migration 005: Enable Row Level Security (RLS) on public.stock_movements
-- Purpose: fix lint warning about RLS disabled in public schema for stock_movements
-- Safety: This migration enables RLS and creates narrowly scoped policies. Run on staging first.

BEGIN;

-- 1) Enable RLS on the table
ALTER TABLE IF EXISTS public.stock_movements ENABLE ROW LEVEL SECURITY;

-- 2) Revoke broad public grants (optional but recommended)
REVOKE ALL ON TABLE public.stock_movements FROM PUBLIC;

-- 3) Policy: allow authenticated users to INSERT their own movements
-- This assumes the table has a "performed_by" UUID column referencing auth.uid() or the user id
-- Ensure idempotency: drop policy if it already exists, then create
DROP POLICY IF EXISTS insert_stock_movements_authenticated ON public.stock_movements;
CREATE POLICY insert_stock_movements_authenticated ON public.stock_movements
  FOR INSERT
  WITH CHECK (
    -- allow insert if the authenticated user is the performer (use `user_id` column present on the table)
    (
      current_setting('request.jwt.claim.sub', true) IS NOT NULL
      AND user_id = current_setting('request.jwt.claim.sub', true)::uuid
    )
    OR
    -- Or allow if user is an admin (check user_profiles.isadmin)
    (
      current_setting('request.jwt.claim.sub', true) IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.user_profiles p
        WHERE p.id = current_setting('request.jwt.claim.sub', true)::uuid
          AND p.isadmin = TRUE
      )
    )
  );

-- 4) Policy: allow SELECT only for admins and for server/service role (service_role bypasses RLS)
-- Allow owners to SELECT their own movements
DROP POLICY IF EXISTS select_stock_movements_owner ON public.stock_movements;
CREATE POLICY select_stock_movements_owner ON public.stock_movements
  FOR SELECT
  USING (
    current_setting('request.jwt.claim.sub', true) IS NOT NULL
    AND user_id = current_setting('request.jwt.claim.sub', true)::uuid
  );

-- Allow admins (user_profiles.isadmin = true) to SELECT all rows
DROP POLICY IF EXISTS select_stock_movements_admins ON public.stock_movements;
CREATE POLICY select_stock_movements_admins ON public.stock_movements
  FOR SELECT
  USING (
    current_setting('request.jwt.claim.sub', true) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = current_setting('request.jwt.claim.sub', true)::uuid
        AND p.isadmin = TRUE
    )
  );

-- 5) (Optional) allow inserts by server (service_role) without jwt - not recommended for public anon keys
-- No explicit policy needed for service_role if you use the service_role key because RLS is bypassed for that role.

COMMIT;

-- Notes:
-- - If your `stock_movements` table does not contain a `performed_by` UUID column, modify the WITH CHECK clause to match your schema (e.g. user_id or actor_id).
-- - If you prefer that customers can SELECT their own stock movement history, add a SELECT policy conditioned on performed_by = current_setting('request.jwt.claim.sub', true).
-- - Always run this on a staging copy first and ensure your PostgREST/Supabase JWT includes the `sub` claim (Supabase does by default).
