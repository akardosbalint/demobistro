"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, UtensilsCrossed, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Áttekintés", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Foglalások kezelése", icon: CalendarClock },
  { href: "/admin/menu", label: "Étlap", icon: UtensilsCrossed },
  { href: "/admin/reviews", label: "Vélemények", icon: Star },
  { href: "/admin/settings", label: "Beállítások", icon: Settings },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-border/60 bg-card px-4 py-3 lg:hidden">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
