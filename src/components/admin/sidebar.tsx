"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarClock, UtensilsCrossed, Settings, Star, LogOut, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const navItems = [
  { href: "/admin", label: "Áttekintés", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Foglalások", icon: CalendarClock },
  { href: "/admin/menu", label: "Étlap kezelő", icon: UtensilsCrossed },
  { href: "/admin/reviews", label: "Vélemények", icon: Star },
  { href: "/admin/settings", label: "Beállítások", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border/60 bg-card lg:flex">
      <div className="flex h-20 items-center gap-2 border-b border-border/60 px-6">
        <Leaf className="h-6 w-6 text-primary" />
        <span className="font-display text-lg">Zöld Sarok</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:bg-secondary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          Kijelentkezés
        </button>
      </div>
    </aside>
  );
}
