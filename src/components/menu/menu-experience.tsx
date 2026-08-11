"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryNav } from "@/components/menu/category-nav";
import { FilterChips, type FilterKey } from "@/components/menu/filter-chips";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { MenuItemDetail } from "@/components/menu/menu-item-detail";
import type { MenuCategoryWithItems, MenuItem } from "@/types";

interface MenuExperienceProps {
  categories: MenuCategoryWithItems[];
}

function itemMatchesFilters(item: MenuItem, filters: Set<FilterKey>): boolean {
  return Array.from(filters).every((filter) =>
    filter === "seasonal" ? item.seasonal : item.dietary_info.includes(filter)
  );
}

export function MenuExperience({ categories }: MenuExperienceProps) {
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredCategories = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        filteredItems: category.items.filter((item) => itemMatchesFilters(item, activeFilters)),
      })),
    [categories, activeFilters]
  );

  return (
    <div>
      <CategoryNav categories={categories} />

      <div className="container py-8">
        <FilterChips active={activeFilters} onToggle={toggleFilter} />
      </div>

      <div className="container flex flex-col gap-20 pb-28">
        {filteredCategories.map((category) => (
          <section
            key={category.id}
            id={`category-${category.slug}`}
            className="scroll-mt-40"
            aria-label={category.name}
          >
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="section-heading-eyebrow">Étlap</p>
                <h2 className="font-display text-4xl">{category.name}</h2>
              </div>
              <span className="hidden text-sm text-muted-foreground sm:block">
                {category.filteredItems.length} tétel
              </span>
            </div>

            {category.filteredItems.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
                Nincs találat ebben a kategóriában a kiválasztott szűrőkkel.
              </p>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {category.filteredItems.map((item, index) => (
                    <MenuItemCard key={item.id} item={item} index={index} onSelect={setSelectedItem} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
        ))}
      </div>

      <MenuItemDetail item={selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)} />
    </div>
  );
}
