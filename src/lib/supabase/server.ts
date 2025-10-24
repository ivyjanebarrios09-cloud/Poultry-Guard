import { createClient } from '@supabase/supabase-js';

// This is the server-side Supabase client.
// It is used in server components and API routes.
// It is safe to use the service role key here, as this code only runs on the server.
export function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in server environment variables.');
  }
  
  // Note: We are creating a new client on each request.
  // This is the recommended approach for server-side usage in Next.js App Router.
  // For pages/api routes, you might have a singleton, but for App Router this is safer.
  return createClient(supabaseUrl, supabaseAnonKey);
}
