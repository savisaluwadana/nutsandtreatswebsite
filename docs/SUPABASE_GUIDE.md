# Supabase Implementation Guide for Nuts & Treats Website

This guide will walk you through the steps to fully implement Supabase as the backend for your Nuts & Treats e-commerce website.

## Step 1: Supabase Setup

### Create Account and Project
1. Sign up at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

### Database Setup
1. Go to the SQL Editor in your Supabase dashboard
2. Run the schema.sql script to create tables
3. Run the seed.sql script to populate sample data

## Step 2: Environment Configuration

1. Create a `.env` file at your project root:
```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Restart your development server to load the new environment variables

## Step 3: Update Data Models

Replace the static product data in `src/data/products.ts` with dynamic Supabase data:

1. First, ensure product types are compatible:

```typescript
// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;  // This maps to image_url in Supabase
  stock_quantity?: number;
  isBestseller: boolean;  // This maps to is_bestseller in Supabase
  isNew: boolean;  // This maps to is_new in Supabase
}

// Add a mapping function to convert Supabase products to your app's format
export function mapSupabaseProduct(supabaseProduct: any): Product {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description,
    price: supabaseProduct.price,
    category: supabaseProduct.category,
    image: supabaseProduct.image_url,
    stock_quantity: supabaseProduct.stock_quantity,
    isBestseller: supabaseProduct.is_bestseller,
    isNew: supabaseProduct.is_new
  };
}
```

## Step 4: Implement Authentication

1. Add authentication UI components to your app:
   - Sign-up page
   - Login page
   - Password reset

2. Protect routes that require authentication:
```typescript
const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <>{children}</> : null;
};
```

## Step 5: Implement API Calls

1. Create product service functions:

```typescript
// getAllProducts
const { data, error } = await supabase
  .from('products')
  .select('*');

// getProductById
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId)
  .single();

// getProductsByCategory
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('category', categoryId);
```

2. Create order service functions:

```typescript
// createOrder
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    total: orderTotal,
    shipping_address: shippingAddress,
    billing_address: billingAddress,
  })
  .select()
  .single();

// Add order items
if (data) {
  const orderItems = cartItems.map(item => ({
    order_id: data.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
}

// getUserOrders
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
```

## Step 6: Update Components

1. Update your `CartPage` to save orders to Supabase on checkout
2. Update your `AccountPage` to fetch and display real order history
3. Update the `ProductPage` to fetch product details from Supabase

## Step 7: Real-time Features (Optional)

1. Subscribe to changes in products with real-time functionality:

```typescript
const productsSubscription = supabase
  .channel('public:products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' }, 
    (payload) => {
      console.log('Change received!', payload);
      // Update your products state here
    }
  )
  .subscribe();

// Clean up subscription
return () => {
  supabase.removeChannel(productsSubscription);
};
```

## Step 8: Storage for Product Images (Optional)

1. Set up Supabase Storage buckets for product images
2. Update your Admin panel to upload images to Supabase Storage
3. Update product image URLs to use Supabase Storage URLs

## Step 9: Testing

1. Test user authentication flow
2. Test product listing and filtering
3. Test shopping cart and checkout
4. Test order history display
5. Verify all database security rules work correctly

## Step 10: Deployment

1. Configure production environment variables
2. Build your app for production
3. Deploy your frontend to your hosting provider
4. Ensure your Supabase project has the proper CORS configuration for your deployed app

## Common Issues and Solutions

1. **Authentication Issues**:
   - Ensure your Supabase URL and key are correct
   - Check that your auth providers are enabled in Supabase dashboard

2. **Database Query Errors**:
   - Verify your table names and column names match your queries
   - Check the Supabase dashboard logs for query errors

3. **Security Policies**:
   - Test your RLS policies to ensure they protect data properly
   - Make sure authenticated users can only access their own data

4. **Data Type Issues**:
   - Ensure your TypeScript types match the structure of your Supabase tables
   - Use proper type mapping between your app and Supabase
