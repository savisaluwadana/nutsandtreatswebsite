# Fix for PGRST204 Error: 'name' column not found in 'categories'

## Problem
The error `PGRST204: Could not find the 'name' column of 'categories' in the schema cache` occurs because:
- Migration 003 renamed the `name` column to `category` in the database
- The application code still references the `name` column

## Solution
Run the migration file `007_fix_category_name_column.sql` to rename the column back to `name`.

### Steps to Fix:

1. **In Supabase Dashboard:**
   - Go to SQL Editor
   - Copy and paste the contents of `migrations/007_fix_category_name_column.sql`
   - Click "Run"

2. **Reload Schema Cache:**
   After running the migration, reload the Supabase schema cache:
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
   
   Or use the "Reload schema cache" button in the Supabase Dashboard under Database settings.

3. **Verify the Fix:**
   Check that the column now exists:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'categories' 
   ORDER BY ordinal_position;
   ```

## Why This Happened
The migration file `003_finalize_category_id_and_cleanup.sql` contained this line:
```sql
ALTER TABLE IF EXISTS categories RENAME COLUMN name TO category;
```

This was likely done to match a different naming convention, but the application code was never updated to reflect this change.

## Alternative Solution (Not Recommended)
Instead of fixing the database, you could update all code references from `name` to `category`, but this would require changes across multiple files and could introduce bugs. It's cleaner to keep the database column as `name` since that's what the rest of the codebase expects.
