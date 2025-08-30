import { supabase } from '../lib/supabase';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_bestseller: boolean;
  is_new: boolean;
  created_at?: string;
}

// Fetch all products
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Try exact match first
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error(`Error fetching ${category} products (exact match):`, error);
    // don't throw yet; attempt fallback queries
  }

  if (data && data.length > 0) return data;

  // Fallbacks: try case-insensitive partial matches; handle slug -> name (hyphens -> spaces)
  const variants = [
    category.replace(/-/g, ' '), // dry-fruits -> dry fruits
    category.replace(/-/g, ''),  // dry-fruits -> dryfruits
    category // original
  ];

  for (const v of variants) {
    const { data: altData, error: altError } = await supabase
      .from('products')
      .select('*')
      .ilike('category', `%${v}%`);

    if (altError) {
      console.error(`Error fetching ${category} products (variant '${v}') :`, altError);
      continue;
    }

    if (altData && altData.length > 0) return altData;
  }

  // nothing found
  return [];
}

// Fetch a single product by ID
export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Fetch bestseller products
export async function getBestsellerProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_bestseller', true);
  
  if (error) {
    console.error('Error fetching bestseller products:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch new arrival products
export async function getNewProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true);
  
  if (error) {
    console.error('Error fetching new products:', error);
    throw error;
  }
  
  return data || [];
}
