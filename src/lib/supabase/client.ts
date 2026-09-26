import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export function createClient(): SupabaseClient<Database> {
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient<Database>;
}

export const supabaseClient = createClient();
