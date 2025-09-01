import { supabase } from '../lib/supabase';

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  created_at?: string;
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }

  return data || [];
}

export async function deleteSupplier(id: number): Promise<void> {
  const { error } = await supabase
    .from('suppliers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting supplier ${id}:`, error);
    throw error;
  }
}
