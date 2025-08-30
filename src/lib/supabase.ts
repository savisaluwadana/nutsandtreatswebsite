import { createClient } from '@supabase/supabase-js';

// Environment variables should be properly configured in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing');

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set in your environment.'
  );
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
