import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mockCategories, mockMenuItems } from "@/lib/mock-data";
import type { MenuCategoryWithItems } from "@/types";

export async function getMenuCategoriesWithItems(): Promise<MenuCategoryWithItems[]> {
  if (!isSupabaseConfigured) {
    return mockCategories
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        ...category,
        items: mockMenuItems
          .filter((item) => item.category_id === category.id && item.is_available)
          .sort((a, b) => a.sort_order - b.sort_order),
      }));
  }

  const supabase = await createServerSupabaseClient();
  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (categoriesError) throw categoriesError;

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (itemsError) throw itemsError;

  return (categories ?? []).map((category) => ({
    ...category,
    items: (items ?? []).filter((item) => item.category_id === category.id),
  }));
}
