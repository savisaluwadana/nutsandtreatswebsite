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
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data || [];
}

// Fetch products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Some schemas use 'category' (text), others 'category_id' referencing categories table.
  // We'll attempt both gracefully.
  const targetColumns = ['category', 'category_id'];
  // Normalize incoming slug variants for fuzzy searching.
  const variants = [
    category,
    category.replace(/-/g, ' '),
    category.replace(/-/g, ''),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  for (const col of targetColumns) {
    // Try exact matches across variants
    for (const v of variants) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq(col, v);
        if (error) {
          // If column doesn't exist (Postgres undefined_column), break to next column name
          if ((error as { code?: string }).code === '42703') break;
          console.warn(`Exact match query failed for ${col}='${v}':`, error.message);
        } else if (data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn(`Unexpected error querying ${col}='${v}':`, e);
      }
    }
    // Fallback ILIKE partials for this column
    for (const v of variants) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike(col, `%${v}%`);
        if (error) {
          if ((error as { code?: string }).code === '42703') break; // move to next column name
          console.warn(`ILIKE query failed for ${col} ~ '%${v}%':`, error.message);
        } else if (data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn(`Unexpected error fuzzy querying ${col} ~ '%${v}%':`, e);
      }
    }
  }
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
    .eq('is_bestseller', true)
    .order('created_at', { ascending: false });
  
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
    .eq('is_new', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching new products:', error);
    throw error;
  }
  
  return data || [];
}

// Create a new product
export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data as Product;
}

// Update an existing product
export async function updateProduct(id: number, updates: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }

  return data as Product;
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
}
