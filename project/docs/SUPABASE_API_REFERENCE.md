# Supabase API Reference for Nuts & Treats Website

This document serves as a reference for all the Supabase API calls used in the Nuts & Treats website.

## Authentication API

### Sign Up
```typescript
const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password 
  });
  if (error) throw error;
  return data;
};
```

### Sign In
```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  if (error) throw error;
  return data;
};
```

### Sign Out
```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
```

### Get Current Session
```typescript
const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};
```

### Reset Password
```typescript
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};
```

## Products API

### Get All Products
```typescript
const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  if (error) throw error;
  return data;
};
```

### Get Product by ID
```typescript
const getProductById = async (id: number) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};
```

### Get Products by Category
```typescript
const getProductsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);
  if (error) throw error;
  return data;
};
```

### Get Bestsellers
```typescript
const getBestsellerProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_bestseller', true);
  if (error) throw error;
  return data;
};
```

### Get New Products
```typescript
const getNewProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true);
  if (error) throw error;
  return data;
};
```

### Search Products
```typescript
const searchProducts = async (query: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`);
  if (error) throw error;
  return data;
};
```

## Categories API

### Get All Categories
```typescript
const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  if (error) throw error;
  return data;
};
```

### Get Category by ID
```typescript
const getCategoryById = async (id: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};
```

## Orders API

### Create Order
```typescript
const createOrder = async (orderData: {
  user_id: string;
  total: number;
  shipping_address: any;
  billing_address: any;
}) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  if (error) throw error;
  return data;
};
```

### Add Order Items
```typescript
const addOrderItems = async (items: {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}[]) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(items);
  if (error) throw error;
  return data;
};
```

### Get User Orders
```typescript
const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
```

### Get Order Details
```typescript
const getOrderById = async (orderId: number, userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('id', orderId)
    .eq('user_id', userId) // Security check to ensure user can only access their own orders
    .single();
  if (error) throw error;
  return data;
};
```

## User Profiles API

### Get User Profile
```typescript
const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};
```

### Update User Profile
```typescript
const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
```

## Real-time Subscriptions

### Subscribe to Product Changes
```typescript
const subscribeToProducts = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:products')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' }, 
      callback
    )
    .subscribe();
};
```

### Subscribe to Order Status Changes
```typescript
const subscribeToOrderUpdates = (orderId: number, callback: (payload: any) => void) => {
  return supabase
    .channel(`order-${orderId}`)
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, 
      callback
    )
    .subscribe();
};
```
