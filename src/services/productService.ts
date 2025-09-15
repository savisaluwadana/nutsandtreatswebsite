import { supabase } from '../lib/supabase';
import { logStockMovement } from './stockMovementService';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  // legacy: some deployments store a text `category`; newer schemas use `category_id` (numeric)
  category?: string;
  category_id?: number | string;
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
  // If the incoming category looks like a numeric id, prefer querying by `category_id`.
  const asNumber = Number(category);
  if (!Number.isNaN(asNumber) && String(asNumber) === String(category)) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', asNumber);
      if (error) {
        console.warn('Error querying products by category_id:', error);
      } else if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Unexpected error querying by category_id:', e);
    }
  }

  // Some schemas use 'category' (text). Try exact and fuzzy matches on that column.
  const targetColumns = ['category', 'category_id'];
  const variants = [
    category,
    category.replace(/-/g, ' '),
    category.replace(/-/g, ''),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  for (const col of targetColumns) {
    for (const v of variants) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq(col, v);
        if (error) {
          if ((error as { code?: string }).code === '42703') break;
          console.warn(`Exact match query failed for ${col}='${v}':`, error);
        } else if (data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn(`Unexpected error querying ${col}='${v}':`, e);
      }
    }
    for (const v of variants) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike(col, `%${v}%`);
        if (error) {
          if ((error as { code?: string }).code === '42703') break;
          console.warn(`ILIKE query failed for ${col} ~ '%${v}%':`, error);
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
  // Pre-normalize: if `category` looks numeric, send it as `category_id` to match newer schemas.
  const payload = { ...(product as unknown as Record<string, unknown>) } as Record<string, unknown>;
  if (payload.category != null) {
    const asNum = Number(String(payload.category));
    if (!Number.isNaN(asNum) && String(asNum) === String(payload.category)) {
      payload['category_id'] = asNum;
      delete payload['category'];
    }
  }

  // Try inserting the normalized payload
  const initial = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single();

  const { data, error } = initial as { data: unknown; error: unknown };

  if (error) {
    // Postgres undefined column code often surfaces as 42703 from PostgREST. In that case, retry by mapping `category`->`category_id`.
    if ((error as { code?: string }).code === '42703') {
      const alt = { ...(product as unknown as Record<string, unknown>) } as Record<string, unknown>;
      if ('category' in alt) {
        const asNum = Number(String(alt['category']));
        alt['category_id'] = !Number.isNaN(asNum) && String(asNum) === String(alt['category']) ? asNum : alt['category'];
        delete alt['category'];
      }
      const retry = await supabase.from('products').insert(alt as unknown as Record<string, unknown>[]).select().single();
      if (retry.error) {
        console.error('Retry insert with category_id failed:', retry.error);
        throw retry.error;
      }
      return retry.data as Product;
    }

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

// Bulk create products from an array. Performs basic validation and returns
// an object with counts and any row-level errors.
export async function bulkCreateProducts(products: Array<Partial<Omit<Product, 'id' | 'created_at'>>>): Promise<{ inserted: number; errors: Array<{ index: number; message: string }>; }> {
  const errors: Array<{ index: number; message: string }> = [];
  const toInsert: Array<Partial<Omit<Product, 'id' | 'created_at'>>> = [];

  products.forEach((p, idx) => {
    // Basic required field checks
    if (!p || !p.name || p.price == null || !p.category) {
      errors.push({ index: idx, message: 'Missing required fields: name, price, category' });
      return;
    }

    // Normalize types
    const normalized: Partial<Omit<Product, 'id' | 'created_at'>> = {
      name: String(p.name).trim(),
      description: p.description ? String(p.description) : '',
      price: Number(p.price) || 0,
      category: String(p.category).trim(),
      image_url: p.image_url ? String(p.image_url) : '',
      stock_quantity: p.stock_quantity != null ? Number(p.stock_quantity) : 0,
      is_bestseller: !!p.is_bestseller,
      is_new: !!p.is_new,
    };

    toInsert.push(normalized);
  });

  if (toInsert.length === 0) {
    return { inserted: 0, errors };
  }

  const { data, error } = await supabase
    .from('products')
    .insert(toInsert)
    .select('id');

  if (error) {
    console.error('Error bulk inserting products:', error);
    // if missing column error, try alternate insert mapping to category_id
    if ((error as { code?: string }).code === '42703') {
      const altInsert = toInsert.map(r => {
        const obj = { ...r } as Record<string, unknown>;
        if ('category' in obj) {
          const asNum = Number(String(obj['category']));
          obj['category_id'] = !Number.isNaN(asNum) && String(asNum) === String(obj['category']) ? asNum : obj['category'];
          delete obj['category'];
        }
        return obj;
      });
      const retry = await supabase.from('products').insert(altInsert).select('id');
      if (retry.error) {
        return { inserted: 0, errors: errors.concat([{ index: -1, message: retry.error.message || 'Insert failed' }]) };
      }
      return { inserted: Array.isArray(retry.data) ? retry.data.length : 0, errors };
    }

    // If req fails completely, mark as an overall error
    return { inserted: 0, errors: errors.concat([{ index: -1, message: error.message || 'Insert failed' }]) };
  }

  return { inserted: Array.isArray(data) ? data.length : 0, errors };
}

// Adjust stock by a delta (positive or negative). Returns updated product.
export async function adjustProductStock(id: number, delta: number): Promise<Product> {
  const current = await getProductById(id);
  if (!current) throw new Error('Product not found for stock adjust');
  const newQty = Math.max(0, (current.stock_quantity || 0) + delta);
  const upd = await supabase
    .from('products')
    .update({ stock_quantity: newQty })
    .eq('id', id)
    .select('*')
    .single();
  if (upd.error) throw upd.error;
  try {
    await logStockMovement({
      product_id: id,
      change: delta,
      old_quantity: current.stock_quantity ?? 0,
      new_quantity: newQty,
      reason: 'manual-adjust',
      source: 'admin-ui',
      user_id: null,
    });
  } catch (e) { console.warn('Failed to log stock movement', e); }
  return upd.data as Product;
}

// Set stock to an explicit value (non-negative). Returns updated product.
export async function setProductStock(id: number, value: number): Promise<Product> {
  const qty = Math.max(0, Math.floor(value));
  const current = await getProductById(id);
  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: qty })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  try {
    await logStockMovement({
      product_id: id,
      change: (qty - (current?.stock_quantity ?? 0)),
      old_quantity: current?.stock_quantity ?? 0,
      new_quantity: qty,
      reason: 'manual-set',
      source: 'admin-ui',
      user_id: null,
    });
  } catch (e) { console.warn('Failed to log stock movement', e); }
  return data as Product;
}
