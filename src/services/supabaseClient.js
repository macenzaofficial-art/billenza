import { createClient } from '@supabase/supabase-js';

const defaultSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const defaultSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (envUrl && !envUrl.includes('your-project-ref')) ? envUrl : defaultSupabaseUrl;
const supabaseAnonKey = (envAnon && !envAnon.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')) ? envAnon : defaultSupabaseAnonKey;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseUrl.includes('placeholder-project')
  );
};

if (typeof window !== 'undefined') {
  console.info('[Billenza Cloud] Supabase configured:', isSupabaseConfigured(), '| Target:', supabaseUrl);
}

// Fallback dummy client if credentials aren't set yet, avoiding startup crash
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  : createClient(
    'https://placeholder-project.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
    {
      auth: { persistSession: false },
    }
  );
