import "server-only";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Ellenőrzi, hogy a jelenlegi kérés egy bejelentkezett admin felhasználótól érkezik-e.
// Demo módban (Supabase kulcsok nélkül) csak FEJLESZTŐI környezetben engedélyezett a bypass,
// hogy az admin UI helyben tesztelhető legyen. Production build-ben (NODE_ENV === "production")
// egy hiányzó/hibás Supabase konfiguráció mindig zárva marad — soha nem nyílik meg "fail open"
// módon az admin API egy env var elgépelés vagy törlés miatt.
export async function isAdminRequest(): Promise<boolean> {
  if (!isSupabaseConfigured) return process.env.NODE_ENV !== "production";

  const supabase = await createServerSupabaseClient();
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
