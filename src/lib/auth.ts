import "server-only";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Ellenőrzi, hogy a jelenlegi kérés egy bejelentkezett admin felhasználótól érkezik-e.
// Demo módban (Supabase kulcsok nélkül) mindig engedélyezett, hogy az admin UI helyben tesztelhető legyen.
export async function isAdminRequest(): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return Boolean(adminUser);
}

// Route handler-ekben használható guard: ha nem admin, egy kész 401 választ ad vissza.
export async function requireAdmin(): Promise<NextResponse | null> {
  const isAdmin = await isAdminRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: "Nincs jogosultságod ehhez a művelethez." }, { status: 401 });
  }
  return null;
}
