"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { BlurImage } from "@/components/menu/blur-image";
import { DishPlaceholder } from "@/components/menu/dish-placeholder";
import { DietaryBadge } from "@/components/menu/dietary-icons";
import { PriceTag } from "@/components/menu/price-tag";
import type { MenuItem } from "@/types";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onSelect: (item: MenuItem) => void;
}

// forwardRef szükséges: az AnimatePresence (mode="popLayout") a kilépő elem
// méretének méréséhez ref-et csatol a közvetlen gyermekre.
export const MenuItemCard = forwardRef<HTMLButtonElement, MenuItemCardProps>(
  function MenuItemCard({ item, index, onSelect }, ref) {
    return (
      <motion.button
        ref={ref}
        type="button"
        layout
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        onClick={() => onSelect(item)}
        className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card text-left shadow-sm transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-haspopup="dialog"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {item.image_url ? (
            <BlurImage
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110">
              <DishPlaceholder seed={item.id} name={item.name} />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.is_new && (
              <span className="animate-gentle-pulse rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground shadow">
                Új
              </span>
            )}
            {item.seasonal && (
              <span className="animate-gentle-pulse rounded-full bg-avocado-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-cream-50 shadow">
                Szezonális
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl leading-snug text-foreground">{item.name}</h3>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-1.5">
              {item.dietary_info.slice(0, 2).map((tag) => (
                <DietaryBadge key={tag} tag={tag} showLabel={false} />
              ))}
            </div>
            <PriceTag
              value={item.price}
              className={cn("font-display text-lg font-medium text-primary")}
            />
          </div>
        </div>
      </motion.button>
    );
  }
);
