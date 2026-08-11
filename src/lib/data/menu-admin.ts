import "server-only";
import { randomUUID } from "crypto";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { mockCategories, mockMenuItems } from "@/lib/mock-data";
import type { MenuCategory, MenuItem } from "@/types";

// --- Kategóriák -------------------------------------------------------------

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
}

export async function createCategory(input: CategoryInput): Promise<MenuCategory> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    const category: MenuCategory = {
      id: randomUUID(),
      restaurant_id: null,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      sort_order: mockCategories.length + 1,
      created_at: now,
      updated_at: now,
    };
    mockCategories.push(category);
    return category;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("menu_categories")
    .insert({ ...input, sort_order: 999 })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, patch: Partial<MenuCategory>): Promise<MenuCategory> {
  if (!isSupabaseConfigured) {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Kategória nem található.");
    mockCategories[idx] = { ...mockCategories[idx], ...patch, updated_at: new Date().toISOString() };
    return mockCategories[idx];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("menu_categories")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx !== -1) mockCategories.splice(idx, 1);
    for (let i = mockMenuItems.length - 1; i >= 0; i--) {
      if (mockMenuItems[i].category_id === id) mockMenuItems.splice(i, 1);
    }
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("menu_categories").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  if (!isSupabaseConfigured) {
    orderedIds.forEach((id, index) => {
      const category = mockCategories.find((c) => c.id === id);
      if (category) category.sort_order = index + 1;
    });
    return;
  }

  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("menu_categories").update({ sort_order: index + 1 }).eq("id", id)
    )
  );
}

// --- Ételek -------------------------------------------------------------

export interface MenuItemInput {
  category_id: string;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  dietary_info: string[];
  allergens: string[];
  is_available: boolean;
  seasonal: boolean;
  is_new: boolean;
  portion_size?: string | null;
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    const item: MenuItem = {
      id: randomUUID(),
      sort_order: mockMenuItems.filter((i) => i.category_id === input.category_id).length + 1,
      created_at: now,
      updated_at: now,
      description: input.description ?? null,
      image_url: input.image_url ?? null,
      portion_size: input.portion_size ?? null,
      ...input,
    };
    mockMenuItems.push(item);
    return item;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("menu_items")
    .insert({ ...input, sort_order: 999 })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, patch: Partial<MenuItem>): Promise<MenuItem> {
  if (!isSupabaseConfigured) {
    const idx = mockMenuItems.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Étel nem található.");
    mockMenuItems[idx] = { ...mockMenuItems[idx], ...patch, updated_at: new Date().toISOString() };
    return mockMenuItems[idx];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("menu_items")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const idx = mockMenuItems.findIndex((i) => i.id === id);
    if (idx !== -1) mockMenuItems.splice(idx, 1);
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderMenuItems(orderedIds: string[]): Promise<void> {
  if (!isSupabaseConfigured) {
    orderedIds.forEach((id, index) => {
      const item = mockMenuItems.find((i) => i.id === id);
      if (item) item.sort_order = index + 1;
    });
    return;
  }

  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("menu_items").update({ sort_order: index + 1 }).eq("id", id)
    )
  );
}

export async function getAllCategoriesWithItems() {
  if (!isSupabaseConfigured) {
    return mockCategories
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        ...category,
        items: mockMenuItems
          .filter((item) => item.category_id === category.id)
          .sort((a, b) => a.sort_order - b.sort_order),
      }));
  }

  const supabase = createAdminClient();
  const [{ data: categories, error: catError }, { data: items, error: itemError }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("menu_items").select("*").order("sort_order", { ascending: true }),
  ]);
  if (catError) throw catError;
  if (itemError) throw itemError;

  return (categories ?? []).map((category) => ({
    ...category,
    items: (items ?? []).filter((item) => item.category_id === category.id),
  }));
}
