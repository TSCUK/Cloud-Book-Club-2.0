import { createClient } from '@supabase/supabase-js';

// Access environment variables with support for both import.meta.env (Vite) and process.env (Define)
const getEnv = (metaKey: string, processVal: string | undefined) => {
  const metaVal = (import.meta as any).env?.[metaKey];
  return metaVal || processVal;
};

// @ts-ignore - process.env properties are replaced by Vite define at build time
const supabaseUrl = getEnv('VITE_SUPABASE_URL', process.env.VITE_SUPABASE_URL);
// @ts-ignore - process.env properties are replaced by Vite define at build time
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', process.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. App functionality will be limited.');
}

// Provide fallback values to prevent "supabaseUrl is required" crash
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(url, key);