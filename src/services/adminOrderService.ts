import { supabase } from '../lib/supabase';

export interface Order {
  id: number;
  user_id?: string | null;
  customer_name?: string;
  customer_email?: string;
  items?: any[];
  subtotal?: number;
  total?: number;
  status?: string;
  created_at?: string;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
}

export async function deleteOrder(id: number): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
}

export async function getOrderById(id: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }

  return data;
}
