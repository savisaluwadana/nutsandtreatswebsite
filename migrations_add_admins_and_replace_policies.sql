-- Migration: Create admins helper table and replace RLS policies that caused recursion
-- Run this in the Supabase SQL editor (after your main schema is applied).

-- Create a lightweight admins table to avoid querying user_profiles inside policies
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_admins_id ON public.admins(id);

-- Replace policies that previously queried public.user_profiles (which causes infinite recursion)

-- user_profiles: allow admins to view all profiles by checking public.admins
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE id = auth.uid()
    )
  );

-- Categories: admin-only modifiers
DROP POLICY IF EXISTS "Categories are editable by admins" ON public.categories;
CREATE POLICY "Categories are editable by admins" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Categories are updatable by admins" ON public.categories;
CREATE POLICY "Categories are updatable by admins" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Categories are deletable by admins" ON public.categories;
CREATE POLICY "Categories are deletable by admins" ON public.categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Products: admin-only modifiers and admin view-all
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Products are editable by admins" ON public.products;
CREATE POLICY "Products are editable by admins" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Products are updatable by admins" ON public.products;
CREATE POLICY "Products are updatable by admins" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Products are deletable by admins" ON public.products;
CREATE POLICY "Products are deletable by admins" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Orders: admin privileges
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Order items: admin privileges
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can modify all order items" ON public.order_items;
CREATE POLICY "Admins can modify all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Customers and suppliers admin policies (migration file may have created these initially)
DROP POLICY IF EXISTS "Admins manage customers" ON public.customers;
CREATE POLICY "Admins manage customers" ON public.customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins manage suppliers" ON public.suppliers;
CREATE POLICY "Admins manage suppliers" ON public.suppliers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Done. To make a user an admin, insert their UUID into public.admins:
-- INSERT INTO public.admins (id) VALUES ('<user-uuid>');
