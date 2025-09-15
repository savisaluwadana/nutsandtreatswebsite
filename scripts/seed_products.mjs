import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL) {
  console.error('Missing VITE_SUPABASE_URL in environment');
  process.exit(1);
}

// Prefer service role key for seeding (bypasses RLS). If not provided we fall back to anon key but RLS may block inserts.
const clientKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
if (!clientKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, clientKey);

async function upsertCategories(categories) {
  for (const c of categories) {
    try {
      // Try to find existing category by id
      const { data: existing, error: selErr } = await supabase
        .from('categories')
        .select('id')
        .eq('id', c.id)
        .single();
      if (selErr && selErr.code !== 'PGRST116') {
        // PGRST116 is PostgREST 'No rows found' returned as error in some setups; ignore here
      }

      if (existing && existing.id) {
        const { error: updErr } = await supabase
          .from('categories')
          .update({ name: c.name, description: c.description, image_url: c.image_url })
          .eq('id', c.id);
        if (updErr) throw updErr;
        console.log('Updated category', c.id);
      } else {
        const { error: insErr } = await supabase
          .from('categories')
          .insert(c);
        if (insErr) throw insErr;
        console.log('Inserted category', c.id);
      }
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.error('Failed to upsert category', c.id, msg);
      if (msg.includes('row-level security') || msg.includes('infinite recursion')) {
        console.error('RLS prevented category insert. Either run the admins migration and add an admin, or supply a SUPABASE_SERVICE_ROLE_KEY env var before running the seeder.');
      }
    }
  }
}

async function insertProducts(products) {
  for (const p of products) {
    try {
      // Find product by name first (no unique constraint assumed)
      const { data: found, error: findErr } = await supabase
        .from('products')
        .select('id')
        .eq('name', p.name)
        .maybeSingle();

      if (findErr) {
        // If RLS prevents read or other error
        throw findErr;
      }

      if (found && found.id) {
        const { error: updErr } = await supabase
          .from('products')
          .update(p)
          .eq('id', found.id);
        if (updErr) throw updErr;
        console.log('Updated product', p.name);
      } else {
        const { error: insErr } = await supabase
          .from('products')
          .insert(p);
        if (insErr) throw insErr;
        console.log('Inserted product', p.name);
      }
    } catch (err) {
      const msg = err && err.message ? err.message : String(err);
      console.error('Failed to upsert product', p.name, msg);
      if (msg.includes('row-level security') || msg.includes('infinite recursion')) {
        console.error('RLS prevented product insert. Either run the admins migration and add an admin, or supply a SUPABASE_SERVICE_ROLE_KEY env var before running the seeder.');
      }
    }
  }
}

const categories = [
  { id: 'nuts', name: 'Nuts', description: 'Premium quality nuts' },
  { id: 'dried-fruits', name: 'Dried Fruits', description: 'Naturally dried fruits' },
  { id: 'snack-mixes', name: 'Snack Mixes', description: 'Trail mixes and snack combinations' },
  { id: 'chocolates', name: 'Chocolates', description: 'Artisan chocolates' },
  { id: 'gift-boxes', name: 'Gift Boxes', description: 'Curated gift boxes' }
];

const products = [
  {
    name: 'Premium Almonds',
    description: 'Fresh roasted almonds',
    price: 12.5,
    category_id: 'nuts',
    image_url: '/images/almonds.jpg',
    stock_quantity: 100,
    is_bestseller: true,
    is_new: false
  },
  {
    name: 'Dried Mango Slices',
    description: 'Sweet and tangy dried mango',
    price: 9.0,
    category_id: 'dried-fruits',
    image_url: '/images/mango.jpg',
    stock_quantity: 80,
    is_bestseller: false,
    is_new: true
  },
  {
    name: 'Trail Mix Classic',
    description: 'Nuts, seeds and dried fruits',
    price: 8.99,
    category_id: 'snack-mixes',
    image_url: '/images/trailmix.jpg',
    stock_quantity: 120,
    is_bestseller: true,
    is_new: false
  }
];

(async function main() {
  try {
    console.log('Seeding categories...');
    await upsertCategories(categories);
    console.log('Seeding products...');
    await insertProducts(products);
    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeder failed', err instanceof Error ? err.message : err);
    process.exit(1);
  }
})();
