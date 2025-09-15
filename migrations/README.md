Migration steps and safety notes

1) Backup your database (always do this before structural migrations)

   - On Supabase you can create a manual backup from the UI.
   - Or use pg_dump locally (replace placeholders):

```powershell
pg_dump -h <DB_HOST> -U <DB_USER> -d <DB_NAME> -F c -f backup_before_category_migration.dump
```

2) Run migration 001 (non-destructive)

```powershell
psql "postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:5432/<DB_NAME>" -f migrations/001_add_int_id_and_slug_to_categories.sql
```

3) Verify results

   - Check for unmapped products:

```sql
SELECT id, name, category FROM products WHERE category_id IS NULL LIMIT 200;
```

   - If unmapped rows exist, either update categories to include matching names/slugs, or update the products rows to the correct category text so they map.

4) When satisfied, run migration 002 (destructive)

```powershell
psql "postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:5432/<DB_NAME>" -f migrations/002_promote_int_id_to_pk_and_update_products.sql
```

5) Post-migration checks

   - Verify `categories.id` is now numeric and primary key:

```sql
SELECT column_name, data_type FROM information_schema.columns WHERE table_name='categories';
```

   - Verify products.category_id references categories(id):

```sql
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'products'::regclass;
```

Notes
- These migrations assume minimal cross-references to `categories.id`. If other tables reference the text `categories.id`, add explicit ALTER TABLE ... DROP/ADD CONSTRAINT steps for them.
- If you prefer, run these on a staging DB first.
