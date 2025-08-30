

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
export const submitOrder = async (orderData: OrderData): Promise<{ success: boolean; orderId: string }> => {
  // Simulate an API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random order ID
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Log the order data (in a real app, this would be sent to the server)
      console.log('Order submitted:', orderData);
      if (orderData.userId) {
        console.log('Order associated with user:', orderData.userId);
      } else {
        console.log('Guest order (no user)');
      }
      
      // Return a success response with the order ID
      resolve({
        success: true,
        orderId: orderId
      });
    }, 1500); // 1.5 second delay to simulate network request
  });
};
