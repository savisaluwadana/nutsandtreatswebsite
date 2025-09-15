import { supabase } from '../lib/supabase';

export interface StockMovement {
  id: number;
  product_id: number;
  change: number;
  old_quantity: number | null;
  new_quantity: number | null;
  reason?: string | null;
  source?: string | null;
  user_id?: string | null;
  created_at: string;
}

export async function logStockMovement(entry: Omit<StockMovement, 'id' | 'created_at'>): Promise<StockMovement> {
  const { data, error } = await supabase
    .from('stock_movements')
    .insert(entry)
    .select('*')
    .single();
  if (error) throw error;
  return data as StockMovement;
}

export async function getStockMovementsForProduct(productId: number, limit = 50): Promise<StockMovement[]> {
  const { data, error } = await supabase
    .from('stock_movements')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as StockMovement[];
}
