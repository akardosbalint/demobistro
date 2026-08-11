"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SortableCategorySection } from "@/components/admin/sortable-category-section";
import { CategoryFormDialog } from "@/components/admin/category-form-dialog";
import { MenuItemFormDialog } from "@/components/admin/menu-item-form-dialog";
import type { MenuCategoryWithItems, MenuItem, MenuCategory } from "@/types";

export function MenuManager() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MenuCategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menu-categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);
    await fetch("/api/admin/menu-categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((c) => c.id) }),
    });
  };

  const handleReorderItems = async (categoryId: string, orderedIds: string[]) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, items: orderedIds.map((id) => c.items.find((i) => i.id === id)!) }
          : c
      )
    );
    await fetch("/api/admin/menu-items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
    });
  };

  const handleDeleteCategory = async (category: MenuCategoryWithItems) => {
    if (!confirm(`Biztosan törlöd a(z) "${category.name}" kategóriát az összes hozzá tartozó étellel?`))
      return;
    await fetch(`/api/admin/menu-categories/${category.id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    toast({ title: "Kategória törölve" });
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm(`Biztosan törlöd: "${item.name}"?`)) return;
    await fetch(`/api/admin/menu-items/${item.id}`, { method: "DELETE" });
    setCategories((prev) =>
      prev.map((c) => (c.id === item.category_id ? { ...c, items: c.items.filter((i) => i.id !== item.id) } : c))
    );
    toast({ title: "Étel törölve" });
  };

  const handleToggleAvailable = async (item: MenuItem, value: boolean) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === item.category_id
          ? { ...c, items: c.items.map((i) => (i.id === item.id ? { ...i, is_available: value } : i)) }
          : c
      )
    );
    await fetch(`/api/admin/menu-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: value }),
    });
  };

  const upsertCategoryInState = (category: MenuCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      if (exists) return prev.map((c) => (c.id === category.id ? { ...c, ...category } : c));
      return [...prev, { ...category, items: [] }];
    });
  };

  const upsertItemInState = (item: MenuItem) => {
    setCategories((prev) => {
      const withoutItem = prev.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== item.id) }));
      return withoutItem.map((c) => (c.id === item.category_id ? { ...c, items: [...c.items, item] } : c));
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-border p-16 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Étlap betöltése…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingCategory(null);
            setCategoryDialogOpen(true);
          }}
          variant="outline"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" /> Új kategória
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-5">
            {categories.map((category) => (
              <SortableCategorySection
                key={category.id}
                category={category}
                onEditCategory={() => {
                  setEditingCategory(category);
                  setCategoryDialogOpen(true);
                }}
                onDeleteCategory={() => handleDeleteCategory(category)}
                onAddItem={() => {
                  setEditingItem(null);
                  setDefaultCategoryId(category.id);
                  setItemDialogOpen(true);
                }}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setItemDialogOpen(true);
                }}
                onDeleteItem={handleDeleteItem}
                onToggleAvailable={handleToggleAvailable}
                onReorderItems={handleReorderItems}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <CategoryFormDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={editingCategory}
        onSaved={upsertCategoryInState}
      />

      <MenuItemFormDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        categories={categories}
        item={editingItem}
        defaultCategoryId={defaultCategoryId}
        onSaved={upsertItemInState}
      />
    </div>
  );
}
