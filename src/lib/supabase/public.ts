import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/** Cookie-free anonymous client for public pages. Lets pages be cached; RLS still limits it to published data. */
export function createPublicClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
