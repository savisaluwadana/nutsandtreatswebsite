import { Product as SupabaseProduct } from './productService';
import { Product as UIProduct } from '../data/products';

/**
 * Adapts a product from the Supabase database format to the UI format
 */
export const adaptProductToUIFormat = (product: SupabaseProduct): Partial<UIProduct> => {
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    shortDescription: product.description?.substring(0, 100) || '',
    price: product.price,
    category: product.category,
    image: product.image_url,
    images: [product.image_url],
    isBestseller: product.is_bestseller,
    isNew: product.is_new,
    rating: 4.5, // Default rating since it's not in the database schema
    reviews: 0, // Default reviews count since it's not in the database schema
    weights: [
      { size: 'Default', price: product.price }
    ],
    tags: [],
    benefits: [],
    nutritionPer100g: {},
    allergens: [],
    origin: '',
    storage: '',
    shelfLife: '',
    howToUse: []
  };
};

/**
 * Adapts an array of Supabase products to UI format
 */
export const adaptProductsToUIFormat = (products: SupabaseProduct[]): Partial<UIProduct>[] => {
  return products.map(adaptProductToUIFormat);
};
