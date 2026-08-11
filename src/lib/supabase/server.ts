import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "./env";

// Server Component / Route Handler-ekhez: session-tudatos Supabase kliens, RLS érvényes.
export function createServerSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase nincs konfigurálva.");
  }

  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Component-ből hívva a cookie írás nem engedélyezett — middleware kezeli.
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // lásd fent
        }
      },
    },
  });
}
