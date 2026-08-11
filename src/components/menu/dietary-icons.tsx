import { Leaf, WheatOff, NutOff, Sprout, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const dietaryMeta: Record<
  string,
  { label: string; icon: LucideIcon; className: string }
> = {
  vegan: { label: "Vegán", icon: Leaf, className: "bg-avocado-100 text-avocado-700" },
  "gluten-free": { label: "Gluténmentes", icon: WheatOff, className: "bg-gold-50 text-gold-600" },
  "nut-free": { label: "Diómentes", icon: NutOff, className: "bg-clay-100 text-clay-700" },
};

export const seasonalMeta = { label: "Szezonális", icon: Sprout, className: "bg-avocado-100 text-avocado-700" };

interface DietaryBadgeProps {
  tag: string;
  className?: string;
  showLabel?: boolean;
}

export function DietaryBadge({ tag, className, showLabel = true }: DietaryBadgeProps) {
  const meta = dietaryMeta[tag];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        meta.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showLabel && meta.label}
    </span>
  );
}

export function AllergenTag({ allergen }: { allergen: string }) {
  const labels: Record<string, string> = {
    gluten: "Glutén",
    nuts: "Dió/mogyoró",
    sesame: "Szezámmag",
    soy: "Szója",
    dairy: "Tejtermék",
  };
  return (
    <span className="inline-flex items-center rounded-full border border-clay-200 bg-clay-50 px-2.5 py-1 text-[11px] font-medium text-clay-700">
      {labels[allergen] ?? allergen}
    </span>
  );
}
