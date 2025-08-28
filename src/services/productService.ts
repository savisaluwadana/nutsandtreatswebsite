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
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error(`Error fetching ${category} products:`, error);
    throw error;
  }
  
  return data || [];
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
