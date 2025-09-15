import { Product as SupabaseProduct } from './productService';
import { Product as UIProduct } from '../data/products';
import { getAllCategories, Category } from './categoryService';

let _cachedCategories: Category[] | null = null;

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
  // Attempt to resolve numeric category_id to a human-friendly category name via cached lookup.
  let resolvedCategory: string | number = p.category_id ?? (p as { category?: string }).category ?? 'uncategorized';

  // Lazy cache for categories
  if (p.category_id) {
    try {
      if (!_cachedCategories) {
        getAllCategories().then(fetched => { _cachedCategories = fetched; }).catch(() => {});
      } else {
        const found = _cachedCategories.find(c => String(c.id) === String(p.category_id));
  if (found) resolvedCategory = found.name ?? (found as unknown as { category?: string }).category ?? found.id;
      }
    } catch {
      // ignore cache errors and fall back to raw value
    }
  }
  return {
    id: product.id,
    name: product.name,
    description: product.description || '',
    shortDescription: product.description?.substring(0, 100) || '',
    price: product.price,
  // Keep category as a friendly label (or id if lookup missing)
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

// Allow other modules to prime the category cache so adaptProductToUIFormat can resolve names synchronously
export const setCachedCategories = (cats: Category[] | null) => {
  _cachedCategories = cats;
};
