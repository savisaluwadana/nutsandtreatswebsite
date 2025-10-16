import { supabase } from '../lib/supabase';

export interface Category {
  id: string | number;
  name: string; // unified friendly name
  slug?: string;
  description?: string;
  // internal: raw label column might be 'category' in some schemas
  category?: string;
}

export async function getAllCategories(): Promise<Category[]> {
  // Prefer ordering by 'name'; fallback to 'category' if column missing.
  type RawCategory = Record<string, unknown>;
  let rows: RawCategory[] = [];
  try {
    // Fixed: removed .asc suffix from order parameter
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      // If 'name' column doesn't exist, try 'category'
      if ((error as { code?: string }).code === '42703') {
        const retry = await supabase
          .from('categories')
          .select('*')
          .order('category', { ascending: true });
        if (retry.error) throw retry.error;
        rows = (retry.data || []) as RawCategory[];
      } else {
        throw error;
      }
    } else {
      rows = (data || []) as RawCategory[];
    }
  } catch (e) {
    console.error('Error fetching categories:', e);
    throw e;
  }
  return rows.map(r => normalizeCategory(r));
}

function normalizeCategory(row: Record<string, unknown>): Category {
  return {
    id: typeof row.category_id === 'number' || typeof row.category_id === 'string'
      ? (row.category_id as number | string)
      : (typeof row.id === 'number' || typeof row.id === 'string' ? (row.id as number | string) : String(row.id ?? '')), // coerce fallback
    name: (row.name as string) ?? (row.category as string) ?? '',
    slug: (row.slug as string | undefined) ?? undefined,
    description: (row.description as string | undefined) ?? undefined,
    category: (row.category as string | undefined) ?? undefined,
  };
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const nameVal = category.name ?? category.category;
  if (!nameVal) throw new Error('Category name is required');
  // Attempt insert using 'name'; if column missing (42703), retry with 'category'.
  const basePayload: Record<string, unknown> = { name: nameVal };
  let result = await supabase.from('categories').insert(basePayload).select('*').single();
  if (result.error && (result.error as { code?: string }).code === '42703') {
    // retry with 'category'
    result = await supabase.from('categories').insert({ category: nameVal }).select('*').single();
  }
  if (result.error) {
    console.error('Error creating category:', result.error);
    throw result.error;
  }
  return normalizeCategory(result.data as Record<string, unknown>);
}

export async function updateCategory(id: string | number, updates: Partial<Omit<Category, 'id'>>): Promise<Category> {
  const cleaned: Record<string, unknown> = {};
  if (updates.name) cleaned.name = updates.name;
  if (updates.name && !('name' in cleaned) && updates.name) cleaned.category = updates.name;
  if (!updates.name && (updates as unknown as { category?: string }).category) cleaned.category = (updates as unknown as { category?: string }).category;
  if (updates.slug !== undefined) cleaned.slug = updates.slug;
  if (updates.description !== undefined) cleaned.description = updates.description;

  // First try assuming PK is 'id'; if 0 rows, try 'category_id'
  let attempt = await supabase.from('categories').update(cleaned).eq('id', id).select('*').maybeSingle();
  if (attempt.error && (attempt.error as { code?: string }).code === '42703') {
    // retry with different column names
    // If name column missing, remap to { category: ... }
    if (cleaned.name && !('category' in cleaned)) {
      cleaned.category = cleaned.name;
      delete cleaned.name;
    }
    attempt = await supabase.from('categories').update(cleaned).eq('category_id', id).select('*').maybeSingle();
  } else if (!attempt.data) {
    // maybe the PK column name is category_id
    attempt = await supabase.from('categories').update(cleaned).eq('category_id', id).select('*').maybeSingle();
  }
  if (attempt.error) {
    console.error('Error updating category:', attempt.error);
    throw attempt.error;
  }
  if (!attempt.data) throw new Error('Category not found');
  return normalizeCategory(attempt.data as Record<string, unknown>);
}

export async function deleteCategory(id: string | number): Promise<void> {
  // Try both possible PK column names.
  let del = await supabase.from('categories').delete().eq('id', id);
  if (del.error && (del.error as { code?: string }).code === '42703') {
    del = await supabase.from('categories').delete().eq('category_id', id);
  } else if (del.error && del.error.message?.includes('column "id" does not exist')) {
    del = await supabase.from('categories').delete().eq('category_id', id);
  } else if (!del.error && del.count === 0) {
    del = await supabase.from('categories').delete().eq('category_id', id);
  }
  if (del.error) {
    console.error('Error deleting category:', del.error);
    throw del.error;
  }
}
