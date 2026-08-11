import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { supabaseUrl, supabaseServiceRoleKey } from "./env";

// Service-role kliens: kizárólag szerver oldali API route-okban és cron endpointokban
// használható (megkerüli az RLS-t). Soha ne kerüljön a böngészőbe!
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("A SUPABASE_SERVICE_ROLE_KEY nincs beállítva.");
  }
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
