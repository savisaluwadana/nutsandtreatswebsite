-- Additional tables referenced by the application services
-- Run this after the base schema (complete_schema.sql)

-- Customers table (derived from auth users + optional guest data)
CREATE TABLE IF NOT EXISTS public.customers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Users can view/update their own customer row (when linked)
DROP POLICY IF EXISTS "Users view own customer" ON public.customers;
CREATE POLICY "Users view own customer" ON public.customers
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own customer" ON public.customers;
CREATE POLICY "Users update own customer" ON public.customers
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own customer" ON public.customers;
CREATE POLICY "Users insert own customer" ON public.customers
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin full access
DROP POLICY IF EXISTS "Admins manage customers" ON public.customers;
CREATE POLICY "Admins manage customers" ON public.customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins WHERE id = auth.uid()
    )
  );

-- Suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  contact TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Public read (optional) - adjust if you wish to hide supplier info
DROP POLICY IF EXISTS "Suppliers viewable by everyone" ON public.suppliers;
CREATE POLICY "Suppliers viewable by everyone" ON public.suppliers
  FOR SELECT USING (true);

-- Admin manage suppliers
DROP POLICY IF EXISTS "Admins manage suppliers" ON public.suppliers;
CREATE POLICY "Admins manage suppliers" ON public.suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins WHERE id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);
