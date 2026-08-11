"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { MenuCategory, MenuItem } from "@/types";

const dietaryOptions = [
  { key: "vegan", label: "Vegán" },
  { key: "gluten-free", label: "Gluténmentes" },
  { key: "nut-free", label: "Diómentes" },
];

const allergenOptions = [
  { key: "gluten", label: "Glutén" },
  { key: "nuts", label: "Dió/mogyoró" },
  { key: "sesame", label: "Szezámmag" },
  { key: "soy", label: "Szója" },
  { key: "dairy", label: "Tejtermék" },
];

interface MenuItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MenuCategory[];
  item: MenuItem | null;
  defaultCategoryId?: string;
  onSaved: (item: MenuItem) => void;
}

const emptyForm = {
  category_id: "",
  name: "",
  description: "",
  price: "",
  image_url: "",
  dietary_info: [] as string[],
  allergens: [] as string[],
  is_available: true,
  seasonal: false,
  is_new: false,
  portion_size: "",
};

export function MenuItemFormDialog({
  open,
  onOpenChange,
  categories,
  item,
  defaultCategoryId,
  onSaved,
}: MenuItemFormDialogProps) {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        category_id: item.category_id,
        name: item.name,
        description: item.description ?? "",
        price: String(item.price),
        image_url: item.image_url ?? "",
        dietary_info: item.dietary_info,
        allergens: item.allergens,
        is_available: item.is_available,
        seasonal: item.seasonal,
        is_new: item.is_new,
        portion_size: item.portion_size ?? "",
      });
    } else {
      setForm({ ...emptyForm, category_id: defaultCategoryId ?? categories[0]?.id ?? "" });
    }
  }, [item, defaultCategoryId, categories, open]);

  const toggleArrayValue = (field: "dietary_info" | "allergens", key: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(key)
        ? prev[field].filter((v) => v !== key)
        : [...prev[field], key],
    }));
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Feltöltés sikertelen.");
      setForm((prev) => ({ ...prev, image_url: data.url }));
      toast({ title: "Kép feltöltve" });
    } catch (err) {
      toast({
        title: "Feltöltés sikertelen",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category_id || !form.price) {
      toast({ title: "Töltsd ki a kötelező mezőket.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category_id: form.category_id,
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        image_url: form.image_url || null,
        dietary_info: form.dietary_info,
        allergens: form.allergens,
        is_available: form.is_available,
        seasonal: form.seasonal,
        is_new: form.is_new,
        portion_size: form.portion_size || null,
      };

      const res = await fetch(item ? `/api/admin/menu-items/${item.id}` : "/api/admin/menu-items", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Mentés sikertelen.");
      onSaved(data.item as MenuItem);
      toast({ title: item ? "Étel frissítve" : "Étel létrehozva" });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Étel szerkesztése" : "Új étel"}</DialogTitle>
        </DialogHeader>

        <div className="grid max-h-[65vh] gap-4 overflow-y-auto pr-1">
          <div>
            <Label>Kategória</Label>
            <Select value={form.category_id} onValueChange={(v) => setForm((p) => ({ ...p, category_id: v }))}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Válassz kategóriát" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="item-name">Név</Label>
            <Input
              id="item-name"
              className="mt-1.5"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="item-desc">Leírás</Label>
            <Textarea
              id="item-desc"
              className="mt-1.5"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-price">Ár (Ft)</Label>
              <Input
                id="item-price"
                type="number"
                className="mt-1.5"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="item-portion">Adagméret</Label>
              <Input
                id="item-portion"
                className="mt-1.5"
                placeholder="pl. 300 ml"
                value={form.portion_size}
                onChange={(e) => setForm((p) => ({ ...p, portion_size: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="item-image">Kép URL</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                id="item-image"
                placeholder="https://…"
                value={form.image_url}
                onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              />
              {isSupabaseConfigured && (
                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-input px-3 text-sm hover:bg-secondary">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Feltöltés
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </label>
              )}
            </div>
            {!isSupabaseConfigured && (
              <p className="mt-1 text-xs text-muted-foreground">
                Demo módban add meg a kép URL-jét kézzel — a valós feltöltéshez Supabase Storage
                szükséges.
              </p>
            )}
          </div>

          <div>
            <Label>Étkezési jelölők</Label>
            <div className="mt-1.5 flex flex-wrap gap-3">
              {dietaryOptions.map((opt) => (
                <label key={opt.key} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={form.dietary_info.includes(opt.key)}
                    onCheckedChange={() => toggleArrayValue("dietary_info", opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Allergének</Label>
            <div className="mt-1.5 flex flex-wrap gap-3">
              {allergenOptions.map((opt) => (
                <label key={opt.key} className="flex items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={form.allergens.includes(opt.key)}
                    onCheckedChange={() => toggleArrayValue("allergens", opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
              Elérhető
              <Switch
                checked={form.is_available}
                onCheckedChange={(v) => setForm((p) => ({ ...p, is_available: v }))}
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
              Szezonális
              <Switch checked={form.seasonal} onCheckedChange={(v) => setForm((p) => ({ ...p, seasonal: v }))} />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
              Új
              <Switch checked={form.is_new} onCheckedChange={(v) => setForm((p) => ({ ...p, is_new: v }))} />
            </label>
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
