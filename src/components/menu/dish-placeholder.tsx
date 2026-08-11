import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

// Amíg nincs feltöltött étel-fotó (Supabase Storage), egy márkahű, generatív
// "tányér-art" jelenik meg helyette — determinisztikus szín a tétel id-ja alapján.
const palettes = [
  "from-avocado-200 via-avocado-100 to-cream-100",
  "from-clay-200 via-clay-100 to-cream-100",
  "from-gold-200 via-cream-200 to-avocado-100",
  "from-avocado-300 via-clay-100 to-cream-50",
  "from-clay-300 via-gold-100 to-avocado-50",
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

interface DishPlaceholderProps {
  seed: string;
  name: string;
  className?: string;
}

export function DishPlaceholder({ seed, name, className }: DishPlaceholderProps) {
  const palette = palettes[hashSeed(seed) % palettes.length];
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        palette,
        className
      )}
    >
      <Leaf className="absolute -bottom-6 -right-6 h-28 w-28 text-white/25" strokeWidth={1} />
      <Leaf className="absolute -left-8 -top-8 h-24 w-24 rotate-45 text-white/20" strokeWidth={1} />
      <span className="font-display text-6xl italic text-white/70">{initial}</span>
    </div>
  );
}
