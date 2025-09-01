-- Test Data Script for Nuts N Treats
-- This creates sample users, orders, and cart items for testing
-- Run this AFTER the main seed_data.sql

-- Note: This script assumes you have some auth.users created in Supabase
-- You'll need to replace the UUIDs below with actual user IDs from your auth.users table
-- Or create test users through your Supabase Auth interface first

-- Sample user profiles (replace UUIDs with real ones from auth.users)
-- To get real UUIDs, first create users in Supabase Auth, then run:
-- SELECT id, email FROM auth.users;

-- Insert sample user profiles (these UUIDs are examples - replace with real ones)
INSERT INTO public.user_profiles (id, full_name, phone, isadmin, default_shipping_address, default_billing_address) 
VALUES 
  (
    '11111111-1111-1111-1111-111111111111'::uuid, 
    'John Smith', 
    '+1-555-0123', 
    true,
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}',
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}'
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid, 
    'Sarah Johnson', 
    '+1-555-0456', 
    false,
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}'
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid, 
    'Mike Wilson', 
    '+1-555-0789', 
    false,
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}'
  ),
  (
    '44444444-4444-4444-4444-444444444444'::uuid, 
    'Emily Davis', 
    '+1-555-0321', 
    false,
    '{"street": "321 Elm St", "city": "Austin", "state": "TX", "zip": "73301", "country": "USA"}',
    '{"street": "321 Elm St", "city": "Austin", "state": "TX", "zip": "73301", "country": "USA"}'
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  isadmin = EXCLUDED.isadmin,
  default_shipping_address = EXCLUDED.default_shipping_address,
  default_billing_address = EXCLUDED.default_billing_address;

-- Sample Orders
INSERT INTO public.orders (user_id, status, total, shipping_address, billing_address, payment_method, payment_status, notes) VALUES
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'delivered',
    45.97,
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    'credit_card',
    'paid',
    'Please leave at front door'
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'shipped',
    78.96,
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    'paypal',
    'paid',
    'Gift for my wife'
  ),
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    'processing',
    32.97,
    '{"street": "321 Elm St", "city": "Austin", "state": "TX", "zip": "73301", "country": "USA"}',
    '{"street": "321 Elm St", "city": "Austin", "state": "TX", "zip": "73301", "country": "USA"}',
    'credit_card',
    'paid',
    'First time customer'
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'pending',
    25.98,
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    'credit_card',
    'pending',
    'Rush delivery please'
  );

-- Get the order IDs for inserting order items
-- Sample Order Items (using product IDs from our seeded products)
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price) VALUES
  -- Order 1 items (delivered order)
  (1, 1, 2, 12.99),  -- Premium Raw Almonds x2
  (1, 5, 1, 16.99),  -- Pistachios x1
  (1, 9, 1, 13.99),  -- Medjool Dates x1
  
  -- Order 2 items (shipped order)  
  (2, 4, 1, 22.99),  -- Mixed Nuts Deluxe x1
  (2, 17, 1, 16.99), -- Energy Trail Mix x1
  (2, 25, 1, 17.99), -- Dark Chocolate Almonds x1
  (2, 33, 1, 19.99), -- Gourmet Nut Collection x1
  
  -- Order 3 items (processing order)
  (3, 2, 1, 15.49),  -- Organic Walnuts x1
  (3, 12, 1, 14.99), -- Dried Mango Strips x1
  (3, 15, 1, 8.99),  -- Banana Chips x1
  
  -- Order 4 items (pending order)
  (4, 19, 1, 23.99), -- Antioxidant Power Mix x1
  (4, 15, 1, 8.99);  -- Banana Chips x1

-- Sample Cart Items (current shopping carts)
INSERT INTO public.cart_items (user_id, product_id, quantity) VALUES
  ('33333333-3333-3333-3333-333333333333'::uuid, 3, 1),  -- Mike has Roasted Cashews in cart
  ('33333333-3333-3333-3333-333333333333'::uuid, 11, 2), -- Mike has Turkish Apricots x2 in cart
  ('44444444-4444-4444-4444-444444444444'::uuid, 26, 1), -- Emily has Milk Chocolate Cashews in cart
  ('44444444-4444-4444-4444-444444444444'::uuid, 31, 1), -- Emily has Chia Seeds in cart
  ('44444444-4444-4444-4444-444444444444'::uuid, 35, 1); -- Emily has Chocolate Lovers Box in cart

-- Update order totals (this should happen automatically via triggers, but just in case)
UPDATE public.orders SET total = (
  SELECT SUM(quantity * unit_price) 
  FROM public.order_items 
  WHERE order_id = orders.id
) WHERE id IN (1, 2, 3, 4);

-- Create some additional sample data for variety
-- More orders with different statuses
INSERT INTO public.orders (user_id, status, total, shipping_address, billing_address, payment_method, payment_status, notes) VALUES
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'cancelled',
    29.98,
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    'credit_card',
    'refunded',
    'Customer changed mind'
  );

-- Add items to the cancelled order
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price) VALUES
  (5, 6, 1, 35.99),  -- Pine Nuts x1 (cancelled)
  (5, 8, 1, 24.99);  -- Pecan Halves x1 (cancelled)

-- Summary queries to verify data
SELECT 'Test data insertion completed!' as status;

-- Show summary of test data
SELECT 
  'User Profiles: ' || COUNT(*) as summary 
FROM public.user_profiles
UNION ALL
SELECT 
  'Orders: ' || COUNT(*) as summary 
FROM public.orders
UNION ALL
SELECT 
  'Order Items: ' || COUNT(*) as summary 
FROM public.order_items
UNION ALL
SELECT 
  'Cart Items: ' || COUNT(*) as summary 
FROM public.cart_items;

-- Show order status distribution
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total) as total_value
FROM public.orders 
GROUP BY status
ORDER BY status;

-- Show top selling products
SELECT 
  p.name,
  SUM(oi.quantity) as total_sold,
  SUM(oi.quantity * oi.unit_price) as revenue
FROM public.products p
JOIN public.order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;
