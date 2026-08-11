"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "./env";

// Böngésző-oldali Supabase kliens (RLS-nek megfelelően, anon kulccsal).
export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase nincs konfigurálva. Állítsd be a NEXT_PUBLIC_SUPABASE_URL és NEXT_PUBLIC_SUPABASE_ANON_KEY környezeti változókat."
    );
  }
  return createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
}
