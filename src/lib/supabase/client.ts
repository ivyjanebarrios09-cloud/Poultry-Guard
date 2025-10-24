'use client';

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Note: supabaseClient is a singleton on the client. This is by design.
let supabaseClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in client environment variables.');
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}
