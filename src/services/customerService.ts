import { supabase } from '../lib/supabase';

export interface Customer {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at?: string;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }

  return data || [];
}

export async function deleteCustomer(id: number): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
}
