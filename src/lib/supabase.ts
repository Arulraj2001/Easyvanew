import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  (supabaseServiceRoleKey || supabaseAnonKey) && 
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("your-project")
);

// Server-side database operations use Service Role Key (bypasses RLS) if available, falling back to anon key
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceRoleKey || supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

