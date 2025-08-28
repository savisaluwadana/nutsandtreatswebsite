-- Seed data for Nuts N Treats database

-- Insert Categories
INSERT INTO categories (id, name, description, image_url) VALUES
('nuts', 'Nuts', 'Premium quality nuts from around the world', 'https://images.unsplash.com/photo-1519612126440-55c29ac7582f'),
('dried-fruits', 'Dried Fruits', 'Sweet and nutritious dried fruits', 'https://images.unsplash.com/photo-1619566302397-9c7f6baddf3e'),
('seeds', 'Seeds', 'Nutritious and crunchy seeds for healthy snacking', 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05'),
('mixed', 'Mixed & Assortments', 'Delicious combinations of our premium products', 'https://images.unsplash.com/photo-1552159060-3aa213ca1e99');

-- Insert Products
INSERT INTO products (name, description, price, category, image_url, stock_quantity, is_bestseller, is_new) VALUES
-- Nuts
('Premium Cashews', 'Whole, premium grade cashews, roasted and lightly salted.', 1800.00, 'nuts', 'https://images.unsplash.com/photo-1563290328-7382a1869490', 100, true, false),
('Raw Almonds', 'High quality, unsalted raw almonds perfect for snacking.', 1600.00, 'nuts', 'https://images.unsplash.com/photo-1563290328-183dae74c060', 80, true, false),
('Pistachios', 'Roasted and salted pistachios from premium sources.', 2200.00, 'nuts', 'https://images.unsplash.com/photo-1563290328-8c2f30890755', 60, false, true),
('Walnuts', 'Premium quality walnuts, halves and pieces mixed.', 1800.00, 'nuts', 'https://images.unsplash.com/photo-1563290328-9a5723161fa1', 70, false, false),
('Macadamia Nuts', 'Creamy and buttery, unsalted macadamia nuts.', 3500.00, 'nuts', 'https://images.unsplash.com/photo-1563290328-6974a290f3a8', 40, false, true),

-- Dried Fruits
('Organic Dried Apricots', 'Sweet and tangy organic apricots, sun-dried to perfection.', 1400.00, 'dried-fruits', 'https://images.unsplash.com/photo-1562158073-15412f9d0a5f', 90, true, false),
('Golden Raisins', 'Juicy and plump golden raisins, perfect for baking.', 900.00, 'dried-fruits', 'https://images.unsplash.com/photo-1599139852569-aae9f997c676', 120, false, true),
('Dried Cranberries', 'Tangy-sweet dried cranberries, great for salads.', 1200.00, 'dried-fruits', 'https://images.unsplash.com/photo-1611574474484-c09e4fc6b344', 85, true, false),
('Dried Mango Slices', 'Sweet and tropical dried mango slices.', 1600.00, 'dried-fruits', 'https://images.unsplash.com/photo-1550746859-ee7813b2e074', 65, false, true),
('Dates', 'Soft and sweet Medjool dates, perfect for natural sweetening.', 1800.00, 'dried-fruits', 'https://images.unsplash.com/photo-1610301111951-f139bad4e76f', 75, true, false),

-- Seeds
('Chia Seeds', 'Nutrient-rich chia seeds, perfect for smoothies and baking.', 1200.00, 'seeds', 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05', 110, false, false),
('Pumpkin Seeds', 'Roasted and lightly salted pumpkin seeds.', 1000.00, 'seeds', 'https://images.unsplash.com/photo-1571063769135-f7b6d0b2a7bc', 95, true, false),
('Sunflower Seeds', 'Crunchy sunflower seeds, great for snacking.', 900.00, 'seeds', 'https://images.unsplash.com/photo-1572721566166-abcdbc1f8db3', 100, false, true),
('Flax Seeds', 'Organic ground flax seeds, rich in omega-3.', 1100.00, 'seeds', 'https://images.unsplash.com/photo-1564883267736-f6045c68571b', 80, false, false),
('Sesame Seeds', 'Premium white sesame seeds, perfect for cooking and baking.', 850.00, 'seeds', 'https://images.unsplash.com/photo-1561807762-541aa0d7a58e', 120, false, false),

-- Mixed Assortments
('Trail Mix Classic', 'A delicious blend of nuts, dried fruits, and chocolate bits.', 1800.00, 'mixed', 'https://images.unsplash.com/photo-1551354515-d75a9b456ad7', 70, true, false),
('Protein Power Mix', 'Energy-boosting mix of seeds and nuts, perfect post-workout.', 1700.00, 'mixed', 'https://images.unsplash.com/photo-1600522566192-dc9779c2ed72', 65, false, true),
('Tropical Paradise Mix', 'Exotic blend of tropical dried fruits and coconut chips.', 1900.00, 'mixed', 'https://images.unsplash.com/photo-1506784242126-2a1524a6d5bf', 55, false, false),
('Office Snack Mix', 'Perfect mix of savory nuts and seeds for work snacking.', 1600.00, 'mixed', 'https://images.unsplash.com/photo-1552159060-3aa213ca1e99', 75, true, true),
('Antioxidant Blend', 'Nutrient-rich mix of berries and dark chocolate.', 2000.00, 'mixed', 'https://images.unsplash.com/photo-1516467754549-5c5287d12c6e', 60, false, true);
