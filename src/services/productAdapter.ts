import { Product as SupabaseProduct } from './productService';
import { Product as UIProduct } from '../data/products';

type ExtendedSupabaseProduct = Omit<SupabaseProduct, 'stock_quantity'> & {
  stock_quantity?: number;
  category_id?: string | number;
  tags?: string[];
  stock?: number;
  created_at?: string;
};

/**
 * Adapts a product from the Supabase database format to the UI format
 */
export const adaptProductToUIFormat = (product: SupabaseProduct): Partial<UIProduct> => {
  const p = product as ExtendedSupabaseProduct;
  const resolvedCategory = (p as { category?: string }).category || p.category_id || 'uncategorized';
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    shortDescription: product.description?.substring(0, 100) || '',
    price: product.price,
    category: String(resolvedCategory),
    image: product.image_url,
    images: [product.image_url],
    isBestseller: product.is_bestseller,
    isNew: product.is_new,
    rating: 4.5, // Default rating since it's not in the database schema
    reviews: 0, // Default reviews count since it's not in the database schema
    weights: [
      { size: 'Default', price: product.price }
    ],
  // attempt to carry through tags from the DB if present; fall back to empty array
  tags: p.tags || [],
    benefits: [],
    nutritionPer100g: {},
  allergens: [],
  origin: '',
  storage: '',
  shelfLife: '',
  howToUse: [],
  // include stock quantity so the UI can filter by availability
  stock: p.stock_quantity ?? p.stock ?? 0,
  // preserve created_at for sorting if available
  createdAt: p.created_at || null,
  };
};

/**
 * Adapts an array of Supabase products to UI format
 */
export const adaptProductsToUIFormat = (products: SupabaseProduct[]): Partial<UIProduct>[] => {
  return products.map(adaptProductToUIFormat);
};
