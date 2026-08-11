import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from "@/lib/supabase/env";

// Frissíti a Supabase session sütiket, és megvédi az /admin route-okat (kivéve a login oldalt).
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!isSupabaseConfigured) {
    // Demo módban (Supabase kulcsok nélkül) nem kényszerítjük ki a bejelentkezést,
    // hogy az admin felület UI-ja is megtekinthető legyen fejlesztés közben.
    return response;
  }

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
