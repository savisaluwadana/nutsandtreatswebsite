

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export interface OrderData {
  // optional supabase user id for authenticated users
  userId?: string | null;
  customer: CustomerInfo;
  order: {
    items: {
      id: number;
      name: string;
      weight: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
  };
  orderDate: string;
}

// This is a mock service that simulates sending the order to a backend
// In a real application, this would make API calls to your backend
import { supabase } from '../lib/supabase';

export const submitOrder = async (orderData: OrderData): Promise<{ success: boolean; orderId: string | number }> => {
  // Persist order to Supabase `orders` table.
  try {
    const insertPayload = {
      user_id: orderData.userId || null,
      customer_name: orderData.customer.fullName,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      customer_address: `${orderData.customer.address || ''}${orderData.customer.city ? ', ' + orderData.customer.city : ''}`,
      notes: orderData.customer.notes || null,
      items: orderData.order.items,
      subtotal: orderData.order.subtotal,
      delivery_charge: orderData.order.deliveryCharge,
      total: orderData.order.total,
      status: 'pending',
      placed_at: orderData.orderDate,
    };

  type OrderRow = { id: number } & Record<string, unknown>;
  const { data, error } = await supabase.from('orders').insert(insertPayload).select().single();
  if (error) throw error;

  // Return the newly created order id (Postgres primary key)
  return { success: true, orderId: (data as OrderRow).id };
  } catch (err) {
    console.error('Failed to persist order:', err);
    return { success: false, orderId: '' };
  }
};
