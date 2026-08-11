"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MenuCategory } from "@/types";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategory | null;
  onSaved: (category: MenuCategory) => void;
}

export function CategoryFormDialog({ open, onOpenChange, category, onSaved }: CategoryFormDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
  }, [category, open]);

  const handleSave = async () => {
    if (!name) {
      toast({ title: "Add meg a kategória nevét.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        category ? `/api/admin/menu-categories/${category.id}` : "/api/admin/menu-categories",
        {
          method: category ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description: description || null }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Mentés sikertelen.");
      onSaved(data.category as MenuCategory);
      toast({ title: category ? "Kategória frissítve" : "Kategória létrehozva" });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Hiba történt",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{category ? "Kategória szerkesztése" : "Új kategória"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="cat-name">Név</Label>
            <Input id="cat-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cat-desc">Leírás (opcionális)</Label>
            <Textarea
              id="cat-desc"
              className="mt-1.5"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Mentés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
