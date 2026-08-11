"use client";

import { motion } from "framer-motion";
import { Check, WheatOff, NutOff, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export const filterOptions = [
  { key: "gluten-free", label: "Gluténmentes", icon: WheatOff },
  { key: "nut-free", label: "Diómentes", icon: NutOff },
  { key: "seasonal", label: "Szezonális", icon: Sprout },
] as const;

export type FilterKey = (typeof filterOptions)[number]["key"];

interface FilterChipsProps {
  active: Set<FilterKey>;
  onToggle: (key: FilterKey) => void;
}

export function FilterChips({ active, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {filterOptions.map(({ key, label, icon: Icon }) => {
        const isActive = active.has(key);
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground/70 hover:border-primary/40 hover:text-foreground"
            )}
            aria-pressed={isActive}
          >
            {isActive ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
