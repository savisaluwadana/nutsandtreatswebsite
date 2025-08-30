export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  shortDescription: string;
  weights: { size: string; price: number; originalPrice?: number }[];
  tags: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  benefits: string[];
  nutritionPer100g: { [key: string]: string };
  allergens: string[];
  origin: string;
  storage: string;
  shelfLife: string;
  howToUse: string[];
  // optional fields used by the supabase adapter and filtering UI
  stock?: number;
  createdAt?: string | null;
}

export const categories = [
  { id: 'nuts', name: 'Nuts', image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg' },
  { id: 'dry-fruits', name: 'Dry Fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg' },
  { id: 'seeds', name: 'Seeds', image: 'https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg' },
  { id: 'herbs', name: 'Herbs & Spices', image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg' },
  { id: 'seasoning', name: 'Seasoning', image: 'https://images.pexels.com/photos/1024240/pexels-photo-1024240.jpeg' },
  { id: 'other', name: 'Other', image: 'https://images.pexels.com/photos/1327374/pexels-photo-1327374.jpeg' }
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Premium Cashew Nuts',
    category: 'nuts',
    price: 2850,
    originalPrice: 3200,
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
    images: [
      'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      'https://images.pexels.com/photos/1295641/pexels-photo-1295641.jpeg',
      'https://images.pexels.com/photos/1391528/pexels-photo-1391528.jpeg'
    ],
    description: 'Premium quality cashew nuts, carefully selected and vacuum-packed for maximum freshness.',
    shortDescription: 'Premium quality cashews',
    weights: [
      { size: '100g', price: 580 },
      { size: '250g', price: 1420 },
      { size: '500g', price: 2850 },
      { size: '1kg', price: 5600 }
    ],
    tags: ['Premium', 'No Added Sugar', 'Vacuum Packed'],
    rating: 4.8,
    reviews: 124,
    isBestseller: true,
    benefits: [
      'Rich in healthy fats and protein',
      'Contains magnesium and zinc',
      'Supports heart health',
      'Natural source of energy'
    ],
    nutritionPer100g: {
      'Energy': '553 kcal',
      'Protein': '18.2g',
      'Fat': '43.9g',
      'Carbohydrates': '30.2g',
      'Fiber': '3.3g'
    },
    allergens: ['Tree nuts'],
    origin: 'Kerala, India',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    shelfLife: '12 months',
    howToUse: [
      'Eat as a healthy snack',
      'Add to salads and stir-fries',
      'Use in baking and desserts',
      'Blend into cashew cream'
    ]
  },
  {
    id: 2,
    name: 'Medjool Dates',
    category: 'dry-fruits',
    price: 1890,
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    images: [
      'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
      'https://images.pexels.com/photos/1132094/pexels-photo-1132094.jpeg'
    ],
    description: 'Premium Medjool dates, known as the "king of dates" for their large size and rich flavor.',
    shortDescription: 'Premium Medjool dates',
    weights: [
      { size: '250g', price: 980 },
      { size: '500g', price: 1890 },
      { size: '1kg', price: 3680 }
    ],
    tags: ['Premium', 'Natural Sweetener', 'No Added Sugar'],
    rating: 4.9,
    reviews: 89,
    isNew: true,
    benefits: [
      'Natural source of energy',
      'Rich in fiber and potassium',
      'Contains antioxidants',
      'Supports digestive health'
    ],
    nutritionPer100g: {
      'Energy': '277 kcal',
      'Protein': '1.8g',
      'Fat': '0.2g',
      'Carbohydrates': '75g',
      'Fiber': '6.7g'
    },
    allergens: ['May contain pits'],
    origin: 'Jordan',
    storage: 'Store in a cool, dry place',
    shelfLife: '18 months',
    howToUse: [
      'Eat fresh as a snack',
      'Stuff with nuts or cheese',
      'Add to smoothies and desserts',
      'Use as natural sweetener in baking'
    ]
  },
  {
    id: 3,
    name: 'Roasted Almonds',
    category: 'nuts',
    price: 2340,
    image: 'https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg',
    images: [
      'https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg',
      'https://images.pexels.com/photos/1446327/pexels-photo-1446327.jpeg'
    ],
    description: 'Perfectly roasted almonds with a delicious crunch and rich flavor.',
    shortDescription: 'Perfectly roasted almonds',
    weights: [
      { size: '100g', price: 480 },
      { size: '250g', price: 1180 },
      { size: '500g', price: 2340 },
      { size: '1kg', price: 4580 }
    ],
    tags: ['Roasted', 'Crunchy', 'Heart Healthy'],
    rating: 4.7,
    reviews: 156,
    isBestseller: true,
    benefits: [
      'High in vitamin E',
      'Good source of protein',
      'Contains healthy monounsaturated fats',
      'May help lower cholesterol'
    ],
    nutritionPer100g: {
      'Energy': '579 kcal',
      'Protein': '21.2g',
      'Fat': '49.9g',
      'Carbohydrates': '21.6g',
      'Fiber': '12.5g'
    },
    allergens: ['Tree nuts'],
    origin: 'California, USA',
    storage: 'Store in airtight container in cool, dry place',
    shelfLife: '12 months',
    howToUse: [
      'Enjoy as a healthy snack',
      'Add to cereals and yogurt',
      'Use in baking and cooking',
      'Make almond butter'
    ]
  },
  {
    id: 4,
    name: 'Pumpkin Seeds',
    category: 'seeds',
    price: 1680,
    image: 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg',
    images: [
      'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg',
      'https://images.pexels.com/photos/1340117/pexels-photo-1340117.jpeg'
    ],
    description: 'Nutritious pumpkin seeds, lightly roasted to perfection.',
    shortDescription: 'Nutritious roasted pumpkin seeds',
    weights: [
      { size: '100g', price: 350 },
      { size: '250g', price: 850 },
      { size: '500g', price: 1680 }
    ],
    tags: ['Roasted', 'Superfood', 'High Protein'],
    rating: 4.6,
    reviews: 78,
    benefits: [
      'High in magnesium and zinc',
      'Good source of plant protein',
      'Contains healthy omega-3 fatty acids',
      'Supports immune system'
    ],
    nutritionPer100g: {
      'Energy': '559 kcal',
      'Protein': '30.2g',
      'Fat': '49g',
      'Carbohydrates': '10.7g',
      'Fiber': '6g'
    },
    allergens: ['May contain other seeds'],
    origin: 'Austria',
    storage: 'Store in airtight container',
    shelfLife: '12 months',
    howToUse: [
      'Eat as a snack',
      'Sprinkle on salads',
      'Add to granola',
      'Use in baking'
    ]
  },
  {
    id: 5,
    name: 'Organic Turmeric Powder',
    category: 'herbs',
    price: 890,
    image: 'https://images.pexels.com/photos/1024240/pexels-photo-1024240.jpeg',
    images: [
      'https://images.pexels.com/photos/1024240/pexels-photo-1024240.jpeg',
      'https://images.pexels.com/photos/1024264/pexels-photo-1024264.jpeg'
    ],
    description: 'Premium organic turmeric powder, ground fresh for maximum potency.',
    shortDescription: 'Premium organic turmeric powder',
    weights: [
      { size: '50g', price: 290 },
      { size: '100g', price: 480 },
      { size: '250g', price: 890 }
    ],
    tags: ['Organic', 'Anti-inflammatory', 'Freshly Ground'],
    rating: 4.9,
    reviews: 203,
    benefits: [
      'Contains curcumin with anti-inflammatory properties',
      'Natural antioxidant',
      'Supports immune system',
      'Traditional Ayurvedic herb'
    ],
    nutritionPer100g: {
      'Energy': '354 kcal',
      'Protein': '7.8g',
      'Fat': '9.9g',
      'Carbohydrates': '64.9g',
      'Fiber': '21g'
    },
    allergens: ['None'],
    origin: 'Kerala, India',
    storage: 'Store in airtight container away from light',
    shelfLife: '24 months',
    howToUse: [
      'Add to curries and cooking',
      'Make turmeric latte',
      'Mix with milk and honey',
      'Use in face masks'
    ]
  },
  {
    id: 6,
    name: 'Mixed Berry Trail Mix',
    category: 'other',
    price: 1980,
    image: 'https://images.pexels.com/photos/1327374/pexels-photo-1327374.jpeg',
    images: [
      'https://images.pexels.com/photos/1327374/pexels-photo-1327374.jpeg',
      'https://images.pexels.com/photos/1327394/pexels-photo-1327394.jpeg'
    ],
    description: 'A delicious mix of nuts, dried fruits, and berries for the perfect healthy snack.',
    shortDescription: 'Delicious mixed berry trail mix',
    weights: [
      { size: '200g', price: 820 },
      { size: '500g', price: 1980 },
      { size: '1kg', price: 3880 }
    ],
    tags: ['Trail Mix', 'Antioxidant Rich', 'Energy Boost'],
    rating: 4.5,
    reviews: 67,
    benefits: [
      'Natural energy boost',
      'Rich in antioxidants',
      'Good source of fiber',
      'Perfect for on-the-go snacking'
    ],
    nutritionPer100g: {
      'Energy': '468 kcal',
      'Protein': '12.8g',
      'Fat': '28.4g',
      'Carbohydrates': '45.2g',
      'Fiber': '8.1g'
    },
    allergens: ['Tree nuts', 'May contain peanuts'],
    origin: 'Mixed origins',
    storage: 'Store in cool, dry place',
    shelfLife: '9 months',
    howToUse: [
      'Perfect hiking snack',
      'Add to breakfast bowls',
      'Eat as afternoon snack',
      'Use in homemade granola'
    ]
  }
];