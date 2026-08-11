"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bejelentkezés sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-leaf-texture px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl border border-border/60 bg-card p-8 shadow-lg"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="mt-3 font-display text-2xl">Zöld Sarok Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Jelentkezz be a kezelőfelülethez</p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="flex flex-col gap-4">
            <p className="rounded-xl bg-gold-50 p-4 text-sm text-gold-600">
              Demo mód: nincs Supabase kulcs beállítva, ezért a bejelentkezés kihagyható — az admin
              felület helyi teszteléshez szabadon elérhető.
            </p>
            <Button asChild size="lg">
              <Link href="/admin">Belépés demo módban</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">E-mail cím</Label>
              <Input
                id="email"
                type="email"
                required
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Jelszó</Label>
              <Input
                id="password"
                type="password"
                required
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={loading} className="mt-2 gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Bejelentkezés
            </Button>
          </form>
        )}

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          ← Vissza a weboldalra
        </Link>
      </motion.div>
    </div>
  );
}
