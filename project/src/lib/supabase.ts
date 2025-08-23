import { createClient } from '@supabase/supabase-js';

// Environment variables should be properly configured in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please make sure you have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey }
  );
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
