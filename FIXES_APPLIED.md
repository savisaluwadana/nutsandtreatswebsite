# Fixes Applied - Product Stock Edit and Image URL

## Issues Fixed

### 1. Product Stock Edit Not Working
**Problem**: Stock edit buttons (+, -, and "OK" button) were failing when product ID was missing or undefined.

**Solution**:
- Added proper ID validation checks before attempting stock updates
- Added better error handling with detailed error messages
- Updated the stock adjustment functions to properly handle edge cases

**Files Modified**:
- `src/pages/AdminDashboard.tsx`:
  - Added `if (!p.id)` checks before stock operations
  - Added proper error logging with `console.error` and detailed alert messages
  - Fixed the stockEdit state management to check for product ID

### 2. Image URL Made Optional
**Problem**: Form validation was requiring a valid URL format for image_url field, preventing users from saving products without images.

**Solution**:
- Changed image URL field from `type="url"` to `type="text"` to remove browser validation
- Made `image_url` optional in both Product interfaces
- Added placeholder image fallback for products without images
- Updated UI to clearly indicate image URL is optional

**Files Modified**:
- `src/pages/AdminDashboard.tsx`:
  - Changed label to "Product Image (Optional)"
  - Changed input type from "url" to "text"
  - Updated placeholder text to indicate field is optional

- `src/services/productService.ts`:
  - Changed `image_url: string` to `image_url?: string` (made optional)

- `src/data/products.ts`:
  - Changed `image: string` to `image?: string` (made optional)
  - Changed `images: string[]` to `images?: string[]` (made optional)

- `src/services/productAdapter.ts`:
  - Added fallback to placeholder image: `product.image_url || '/images/placeholder-product.jpg'`

### 3. Row-Level Security (RLS) Policy Error
**Problem**: When admins tried to edit stock, they got RLS policy violation error:
```
{
  "code": "42501",
  "message": "new row violates row-level security policy for table \"stock_movements\""
}
```

**Solution**:
- Updated stock adjustment functions to get the current authenticated user's ID
- Created migration to fix the RLS policy to allow admins to insert stock movements
- The new policy allows admins to insert movements with any user_id value (including NULL)

**Files Modified**:
- `src/services/productService.ts`:
  - Added `await supabase.auth.getUser()` to get current user ID
  - Updated both `adjustProductStock` and `setProductStock` to pass user ID instead of null

**Files Created**:
- `migrations/006_fix_stock_movements_rls.sql`:
  - New migration to fix RLS policy for stock_movements table
  - Allows admins to insert movements regardless of user_id value
  - Maintains security for regular users

**Files Updated**:
- `migrations/README.md`:
  - Added instructions for running the new migration

## How to Apply the RLS Fix

### Option 1: Using Supabase SQL Editor (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/006_fix_stock_movements_rls.sql`
4. Paste and execute the SQL

### Option 2: Using psql command line
```powershell
psql "postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:5432/<DB_NAME>" -f migrations/006_fix_stock_movements_rls.sql
```

## Testing

After applying these fixes, you should be able to:
1. ✅ Edit product stock using +/- buttons without errors
2. ✅ Set specific stock quantities using the input field and OK button
3. ✅ Create/update products without providing an image URL
4. ✅ Products without images will show a placeholder
5. ✅ No RLS policy violations when editing stock as an admin

## Notes

- The image URL field is now completely optional
- Products without images will use the placeholder: `/images/placeholder-product.jpg`
- Stock movements are now properly logged with the admin's user ID
- Better error messages help with debugging any future issues
