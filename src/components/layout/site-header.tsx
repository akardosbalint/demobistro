"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Főoldal" },
  { href: "/menu", label: "Étlap" },
  { href: "/#story", label: "Rólunk" },
  { href: "/#reviews", label: "Vélemények" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-500",
          solid
            ? "bg-cream-50/90 backdrop-blur-md border-b border-border/60 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf
              className={cn(
                "h-6 w-6 transition-colors",
                solid ? "text-primary" : "text-cream-50"
              )}
            />
            <span
              className={cn(
                "font-display text-xl tracking-wide transition-colors",
                solid ? "text-foreground" : "text-cream-50"
              )}
            >
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-gold-400",
                  solid ? "text-foreground/80" : "text-cream-50/90"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/admin/login"
              aria-label="Admin belépés"
              title="Admin belépés"
              className={cn(
                "rounded-full p-2 transition-colors hover:text-gold-400",
                solid ? "text-foreground/50" : "text-cream-50/70"
              )}
            >
              <LockKeyhole className="h-4 w-4" />
            </Link>
            <Button asChild variant="accent" size="default">
              <Link href="/booking">Asztalfoglalás</Link>
            </Button>
          </div>

          <button
            aria-label="Menü megnyitása"
            className={cn(
              "md:hidden rounded-full p-2 transition-colors",
              solid ? "text-foreground" : "text-cream-50"
            )}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-avocado-950/95 backdrop-blur-md md:hidden"
          >
            <div className="container flex h-20 items-center justify-between">
              <span className="font-display text-xl text-cream-50">{siteConfig.name}</span>
              <button
                aria-label="Menü bezárása"
                className="rounded-full p-2 text-cream-50"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <motion.nav
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
              className="flex flex-col items-center gap-6 px-6 pt-12"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    closed: { opacity: 0, y: 12 },
                    open: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className="font-display text-3xl text-cream-50 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ closed: { opacity: 0, y: 12 }, open: { opacity: 1, y: 0 } }}>
                <Button asChild variant="accent" size="lg" className="mt-4">
                  <Link href="/booking">Asztalfoglalás</Link>
                </Button>
              </motion.div>
              <motion.div variants={{ closed: { opacity: 0, y: 12 }, open: { opacity: 1, y: 0 } }}>
                <Link
                  href="/admin/login"
                  className="mt-2 flex items-center gap-1.5 text-sm text-cream-100/50 hover:text-gold-400"
                >
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Admin belépés
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
