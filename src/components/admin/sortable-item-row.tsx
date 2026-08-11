"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyHUF, cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface SortableItemRowProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: (value: boolean) => void;
}

export function SortableItemRow({ item, onEdit, onDelete, onToggleAvailable }: SortableItemRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3",
        isDragging && "z-10 opacity-70 shadow-lg",
        !item.is_available && "opacity-60"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none rounded-lg p-1.5 text-muted-foreground hover:bg-secondary active:cursor-grabbing"
        aria-label="Átrendezés"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{item.name}</p>
          {!item.is_available && (
            <Badge variant="secondary" className="gap-1">
              <EyeOff className="h-3 w-3" /> Rejtett
            </Badge>
          )}
          {item.seasonal && <Badge variant="success">Szezonális</Badge>}
          {item.is_new && <Badge variant="accent">Új</Badge>}
        </div>
        <p className="truncate text-sm text-muted-foreground">{formatCurrencyHUF(item.price)}</p>
      </div>

      <Switch checked={item.is_available} onCheckedChange={onToggleAvailable} aria-label="Elérhető" />

      <button onClick={onEdit} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={onDelete} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
