-- Seed Data for Nuts N Treats E-commerce Database
-- Run this after creating the schema to populate with realistic dummy data

-- Clear existing data (optional - remove if you want to keep existing data)
TRUNCATE public.cart_items, public.order_items, public.orders, public.products, public.categories, public.user_profiles CASCADE;

-- Insert Categories (updated with better descriptions and images)
INSERT INTO public.categories (id, name, description, image_url) VALUES
  ('nuts', 'Premium Nuts', 'Hand-selected premium nuts including almonds, walnuts, cashews, and exotic varieties', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400'),
  ('dried-fruits', 'Dried Fruits', 'Naturally dried fruits and berries with no added sugar - perfect for healthy snacking', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'),
  ('snack-mixes', 'Trail Mixes', 'Delicious combinations of nuts, seeds, and dried fruits for energy and taste', 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400'),
  ('chocolates', 'Artisan Chocolates', 'Premium chocolates, cocoa products, and chocolate-covered treats', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400'),
  ('gift-boxes', 'Gift Collections', 'Beautifully curated gift boxes and hampers for special occasions', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400'),
  ('seeds', 'Seeds & Grains', 'Healthy seeds, grains, and superfood varieties for nutritious eating', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Insert Premium Nuts
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, is_bestseller, is_new, is_active) VALUES
  ('Premium Raw Almonds', 'California-grown raw almonds, perfect for snacking or baking. Rich in vitamin E and healthy fats.', 12.99, 'nuts', 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400', 150, true, false, true),
  ('Organic Walnuts', 'Fresh organic walnuts with excellent omega-3 content. Great for brain health and cooking.', 15.49, 'nuts', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400', 120, true, false, true),
  ('Roasted Cashews', 'Lightly salted roasted cashews with a creamy texture. Perfect for parties and snacking.', 18.99, 'nuts', 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400', 200, true, false, true),
  ('Mixed Nuts Deluxe', 'Premium mix of almonds, cashews, brazil nuts, and hazelnuts. Our signature blend.', 22.99, 'nuts', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', 80, true, false, true),
  ('Pistachios Roasted & Salted', 'California pistachios, roasted to perfection with just the right amount of sea salt.', 16.99, 'nuts', 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400', 90, false, true, true),
  ('Pine Nuts', 'Premium pine nuts perfect for pesto, salads, and Mediterranean cuisine.', 35.99, 'nuts', 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400', 45, false, false, true),
  ('Macadamia Nuts', 'Australian macadamia nuts with their signature rich, buttery flavor.', 28.99, 'nuts', 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400', 60, false, true, true),
  ('Pecan Halves', 'Georgia pecan halves, perfect for baking or enjoying on their own.', 24.99, 'nuts', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400', 70, false, false, true);

-- Insert Dried Fruits
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, is_bestseller, is_new, is_active) VALUES
  ('Medjool Dates', 'Large, soft Medjool dates from California. Naturally sweet and perfect for energy.', 13.99, 'dried-fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 100, true, false, true),
  ('Turkish Apricots', 'Sun-dried Turkish apricots with no sulfur added. Sweet and tangy flavor.', 11.99, 'dried-fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 85, false, false, true),
  ('Goji Berries', 'Organic Himalayan goji berries. Superfood packed with antioxidants.', 19.99, 'dried-fruits', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 65, false, true, true),
  ('Dried Mango Strips', 'Philippine dried mango strips with no added sugar. Tropical sweetness in every bite.', 14.99, 'dried-fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 75, true, false, true),
  ('Cranberries Dried', 'Tart and sweet dried cranberries. Perfect for baking and trail mixes.', 9.99, 'dried-fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 120, false, false, true),
  ('Fig Chips', 'Turkish fig chips, naturally sweet and chewy. No added sugars.', 16.99, 'dried-fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 55, false, true, true),
  ('Banana Chips', 'Crispy banana chips made from ripe bananas. Lightly sweetened.', 8.99, 'dried-fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', 140, false, false, true),
  ('Mixed Berry Blend', 'Dried strawberries, blueberries, and raspberries. Antioxidant powerhouse.', 21.99, 'dried-fruits', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 45, false, true, true);

-- Insert Trail Mixes & Snack Mixes
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, is_bestseller, is_new, is_active) VALUES
  ('Energy Trail Mix', 'Perfect blend of almonds, cashews, raisins, and dark chocolate chips for sustained energy.', 16.99, 'snack-mixes', 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400', 95, true, false, true),
  ('Tropical Paradise Mix', 'Dried pineapple, coconut flakes, cashews, and macadamia nuts transport you to the tropics.', 19.99, 'snack-mixes', 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400', 70, false, true, true),
  ('Antioxidant Power Mix', 'Goji berries, dried blueberries, walnuts, and pumpkin seeds. Superfood combination.', 23.99, 'snack-mixes', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 60, false, true, true),
  ('Classic Trail Mix', 'Traditional mix of peanuts, raisins, and M&Ms. Perfect for hiking and outdoor adventures.', 12.99, 'snack-mixes', 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400', 110, true, false, true),
  ('Spicy Sriracha Mix', 'Sriracha-seasoned peanuts, corn nuts, and wasabi peas for those who like it hot.', 14.99, 'snack-mixes', 'https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400', 85, false, true, true),
  ('Protein Power Mix', 'High-protein blend of roasted chickpeas, edamame, and mixed nuts.', 18.99, 'snack-mixes', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 75, false, false, true);

-- Insert Chocolates
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, is_bestseller, is_new, is_active) VALUES
  ('Dark Chocolate Almonds', 'Premium almonds covered in 70% dark chocolate. Rich and indulgent.', 17.99, 'chocolates', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 90, true, false, true),
  ('Milk Chocolate Cashews', 'Creamy milk chocolate coating on premium cashews. Sweet perfection.', 19.99, 'chocolates', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 75, true, false, true),
  ('White Chocolate Macadamias', 'Buttery macadamia nuts in smooth white chocolate. Hawaiian inspiration.', 24.99, 'chocolates', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 55, false, true, true),
  ('Cocoa Dusted Truffles', 'Handmade chocolate truffles dusted with premium cocoa powder.', 26.99, 'chocolates', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 40, false, true, true),
  ('Chocolate Covered Raisins', 'Plump raisins covered in milk chocolate. Classic movie theater treat.', 11.99, 'chocolates', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 100, false, false, true),
  ('Sea Salt Caramel Pecans', 'Pecans covered in caramel and dark chocolate, finished with sea salt.', 22.99, 'chocolates', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 65, false, true, true);

-- Insert Seeds & Grains
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, is_bestseller, is_new, is_active) VALUES
  ('Pumpkin Seeds Roasted', 'Roasted pumpkin seeds with sea salt. Crunchy and nutritious snack.', 9.99, 'seeds', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 130, false, false, true),
  ('Sunflower Seeds', 'Roasted and salted sunflower seeds. Perfect for baseball games and snacking.', 7.99, 'seeds', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 150, false, false, true),
  ('Chia Seeds Organic', 'Organic chia seeds packed with omega-3s and fiber. Great for smoothies.', 13.99, 'seeds', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 80, true, false, true),
  ('Hemp Hearts', 'Hulled hemp seeds with complete protein and healthy fats. Superfood nutrition.', 16.99, 'seeds', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 70, false, true, true),
  ('Quinoa Seeds', 'Premium quinoa seeds, gluten-free and protein-rich. Perfect for healthy meals.', 12.99, 'seeds', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 90, false, false, true),
  ('Flax Seeds Golden', 'Golden flax seeds rich in omega-3s and lignans. Great for baking.', 10.99, 'seeds', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 100, false, false, true);

-- Insert Gift Boxes
INSERT INTO public.products (name, description, price, category_id, image_url, stock_quantity, is_bestseller, is_new, is_active) VALUES
  ('Gourmet Nut Collection', 'Elegant gift box with premium almonds, cashews, pistachios, and walnuts.', 49.99, 'gift-boxes', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 35, true, false, true),
  ('Chocolate Lovers Box', 'Assorted chocolate-covered nuts and dried fruits in a beautiful presentation box.', 39.99, 'gift-boxes', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 40, true, false, true),
  ('Healthy Snacker Hamper', 'Trail mixes, dried fruits, and seeds curated for the health-conscious snacker.', 45.99, 'gift-boxes', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 30, false, true, true),
  ('Ultimate Treat Box', 'Our largest gift box with premium nuts, chocolates, dried fruits, and trail mixes.', 79.99, 'gift-boxes', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 25, false, true, true),
  ('Corporate Gift Set', 'Professional presentation box perfect for corporate gifting and business occasions.', 65.99, 'gift-boxes', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 20, false, false, true),
  ('Holiday Celebration Box', 'Festive collection of nuts, chocolates, and seasonal treats for the holidays.', 55.99, 'gift-boxes', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 45, false, true, true);

-- Create some dummy user profiles for testing (these would normally be created by auth)
-- Note: In real Supabase, these would be created automatically when users sign up
-- These are just for testing purposes - you'll need real auth.users entries

-- First, let's create a simple view to see what we have
-- You can run this separately to check the data:
/*
SELECT 
  c.name as category,
  COUNT(p.id) as product_count,
  AVG(p.price) as avg_price,
  SUM(p.stock_quantity) as total_stock
FROM public.categories c
LEFT JOIN public.products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.name;
*/

-- Update some products to be bestsellers and new items for variety
UPDATE public.products SET is_bestseller = true 
WHERE name IN (
  'Premium Raw Almonds', 
  'Organic Walnuts', 
  'Roasted Cashews', 
  'Mixed Nuts Deluxe',
  'Medjool Dates',
  'Dried Mango Strips',
  'Energy Trail Mix',
  'Classic Trail Mix',
  'Dark Chocolate Almonds',
  'Milk Chocolate Cashews',
  'Chia Seeds Organic',
  'Gourmet Nut Collection',
  'Chocolate Lovers Box'
);

UPDATE public.products SET is_new = true 
WHERE name IN (
  'Pistachios Roasted & Salted',
  'Macadamia Nuts',
  'Goji Berries',
  'Fig Chips',
  'Mixed Berry Blend',
  'Tropical Paradise Mix',
  'Antioxidant Power Mix',
  'Spicy Sriracha Mix',
  'White Chocolate Macadamias',
  'Cocoa Dusted Truffles',
  'Sea Salt Caramel Pecans',
  'Hemp Hearts',
  'Healthy Snacker Hamper',
  'Ultimate Treat Box',
  'Holiday Celebration Box'
);

-- Add some comments for documentation
COMMENT ON TABLE public.products IS 'Product catalog now populated with 40+ realistic items across 6 categories';
COMMENT ON TABLE public.categories IS 'Six main categories: nuts, dried-fruits, snack-mixes, chocolates, gift-boxes, seeds';

-- Display summary of what was inserted
SELECT 'Data insertion completed successfully!' as status;
SELECT 
  'Categories: ' || COUNT(*) as summary 
FROM public.categories
UNION ALL
SELECT 
  'Products: ' || COUNT(*) as summary 
FROM public.products
UNION ALL
SELECT 
  'Bestsellers: ' || COUNT(*) as summary 
FROM public.products 
WHERE is_bestseller = true
UNION ALL
SELECT 
  'New Products: ' || COUNT(*) as summary 
FROM public.products 
WHERE is_new = true;
