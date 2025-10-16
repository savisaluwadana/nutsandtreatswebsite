# ✅ SOLUTION: PGRST204 Error Fixed

## Problem Analysis
The error `PGRST204: Could not find the 'name' column of 'categories' in the schema cache` was occurring because:
1. The `name` column **DOES exist** in your database
2. Supabase's PostgREST schema cache was **stale/outdated**
3. Previous migrations left some cleanup columns (`old_text_id`, `int_id`)

## Current Schema State
Your `categories` table has these columns:
- `category_id` (primary key)
- `name` ✓ (the column your app needs)
- `slug`
- `description`
- `image_url`
- `created_at`
- `old_text_id` (leftover from migration 002)
- `int_id` (leftover from migration 001)

## ✅ SOLUTION

### Step 1: Reload Schema Cache (REQUIRED)
Run this in Supabase SQL Editor:

```sql
-- Reload Supabase schema cache
NOTIFY pgrst, 'reload schema';

-- Verify it works
SELECT category_id, name, slug FROM categories LIMIT 5;
```

### Step 2: Optional - Clean Up Old Columns (RECOMMENDED)
After backing up your database, run the cleanup script:
`migrations/OPTIONAL_CLEANUP_categories.sql`

This will remove the leftover `old_text_id` and `int_id` columns.

## Alternative: Restart Supabase API
If `NOTIFY pgrst, 'reload schema'` doesn't work, you can also:
1. Go to Supabase Dashboard → Settings → API
2. Click "Restart" on the PostgREST API server

## Verification
After reloading the schema, test in your app:
- Navigate to the categories section in Admin Dashboard
- Try to fetch categories
- The PGRST204 error should be gone

## Files Created
1. ✅ `RELOAD_SCHEMA_CACHE.sql` - Reloads the schema cache
2. ✅ `OPTIONAL_CLEANUP_categories.sql` - Removes leftover columns
3. ✅ `SHOW_COLUMNS.sql` - Shows current table structure
4. ✅ This README file

## Root Cause
Migration 003 attempted to rename `name` to `category`, but:
- The migration may have failed or been rolled back
- Or the column was renamed back later
- Either way, Supabase's cache wasn't updated

The schema cache stores metadata about your database tables to improve performance, but sometimes it gets out of sync with the actual database structure.
