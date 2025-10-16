-- Migration 006: Fix RLS policy for stock_movements to allow admins to insert movements
-- Purpose: Allow admins to insert stock movements regardless of user_id value
-- This fixes the issue where admins couldn't log stock changes in the admin UI

BEGIN;

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS insert_stock_movements_authenticated ON public.stock_movements;

-- Create a more flexible policy that allows:
-- 1. Admins to insert any stock movement (regardless of user_id)
-- 2. Regular users to insert their own movements (where user_id matches their ID)
CREATE POLICY insert_stock_movements_flexible ON public.stock_movements
  FOR INSERT
  WITH CHECK (
    -- Allow if user is an admin
    (
      current_setting('request.jwt.claim.sub', true) IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.user_profiles p
        WHERE p.id = current_setting('request.jwt.claim.sub', true)::uuid
          AND p.isadmin = TRUE
      )
    )
    OR
    -- Or allow insert if the authenticated user is the performer
    (
      current_setting('request.jwt.claim.sub', true) IS NOT NULL
      AND user_id = current_setting('request.jwt.claim.sub', true)::uuid
    )
    OR
    -- Or allow if user_id is NULL (for system/automated operations by admins)
    (
      current_setting('request.jwt.claim.sub', true) IS NOT NULL
      AND user_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.user_profiles p
        WHERE p.id = current_setting('request.jwt.claim.sub', true)::uuid
          AND p.isadmin = TRUE
      )
    )
  );

COMMIT;

-- Notes:
-- This policy now allows admins to:
-- 1. Insert stock movements with their own user_id
-- 2. Insert stock movements with any other user_id (for admin operations)
-- 3. Insert stock movements with NULL user_id (for system operations)
-- Regular users can only insert movements with their own user_id
