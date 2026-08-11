"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableItemRow } from "@/components/admin/sortable-item-row";
import { cn } from "@/lib/utils";
import type { MenuCategoryWithItems, MenuItem } from "@/types";

interface SortableCategorySectionProps {
  category: MenuCategoryWithItems;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  onToggleAvailable: (item: MenuItem, value: boolean) => void;
  onReorderItems: (categoryId: string, orderedIds: string[]) => void;
}

export function SortableCategorySection({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailable,
  onReorderItems,
}: SortableCategorySectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = category.items.findIndex((i) => i.id === active.id);
    const newIndex = category.items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(category.items, oldIndex, newIndex);
    onReorderItems(category.id, reordered.map((i) => i.id));
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-3xl border border-border/60 bg-secondary/20 p-5",
        isDragging && "z-10 opacity-70 shadow-lg"
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none rounded-lg p-1.5 text-muted-foreground hover:bg-secondary active:cursor-grabbing"
            aria-label="Kategória átrendezése"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h3 className="font-display text-xl">{category.name}</h3>
          <span className="text-sm text-muted-foreground">({category.items.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={onAddItem} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Étel
          </Button>
          <button onClick={onEditCategory} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDeleteCategory}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {category.items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nincs még étel ebben a kategóriában.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={category.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {category.items.map((item) => (
                <SortableItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item)}
                  onToggleAvailable={(value) => onToggleAvailable(item, value)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
