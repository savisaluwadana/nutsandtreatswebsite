import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __supabaseClient: SupabaseClient | undefined;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = globalThis.__supabaseClient ?? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

if (import.meta.hot) {
  globalThis.__supabaseClient = supabase;
}

// Temporary diagnostics to help verify correct env vars in production
// Remove after confirming Netlify deployment uses the intended project.
try {
  // Hash part of key for safety (first 6 chars) - anon key is public but we avoid logging full value repeatedly
  const anonSnippet = supabaseAnonKey ? supabaseAnonKey.substring(0, 6) + '…' : 'missing';
  console.info('[Supabase Init]', { url: supabaseUrl, anonKey: anonSnippet, mode: import.meta.env.MODE });
  // Expose for manual inspection in browser console
  // @ts-expect-error attach debug field
  window.__SUPABASE_META__ = { supabaseUrl, anonSnippet };
  // Lightweight health check (no auth header) to detect DNS / network issues early
  fetch(supabaseUrl + '/rest/v1/', { method: 'OPTIONS' })
    .then(r => {
      if (!r.ok) throw new Error('Preflight status ' + r.status);
  console.info('[Supabase Health] Preflight OK');
    })
    .catch(err => {
  console.warn('[Supabase Health] Preflight failed', err);
    });
} catch (e) {
  console.warn('[Supabase Init] diagnostics error', e);
}
