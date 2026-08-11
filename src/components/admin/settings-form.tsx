"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDateHu } from "@/lib/utils";
import type { Restaurant, Unavailability } from "@/types";

export function SettingsForm() {
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [days, setDays] = useState<Unavailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newClosedDate, setNewClosedDate] = useState("");
  const [newClosedReason, setNewClosedReason] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/unavailability").then((r) => r.json()),
    ])
      .then(([settingsData, daysData]) => {
        setRestaurant(settingsData.restaurant);
        setDays(daysData.days ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateHour = (index: number, field: "day" | "hours", value: string) => {
    if (!restaurant) return;
    const hours = restaurant.hours.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    setRestaurant({ ...restaurant, hours });
  };

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hours: restaurant.hours,
          max_daily_guests: restaurant.max_daily_guests,
          phone: restaurant.phone,
          email: restaurant.email,
          address: restaurant.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Mentés sikertelen.");
      setRestaurant(data.restaurant);
      toast({ title: "Beállítások mentve" });
    } catch {
      toast({ title: "Hiba történt", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addClosedDay = async () => {
    if (!newClosedDate) return;
    const res = await fetch("/api/admin/unavailability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newClosedDate, reason: newClosedReason || null }),
    });
    const data = await res.json();
    if (res.ok) {
      setDays((prev) => [...prev, data.day].sort((a, b) => a.date.localeCompare(b.date)));
      setNewClosedDate("");
      setNewClosedReason("");
      toast({ title: "Zárvatartás hozzáadva" });
    }
  };

  const removeClosedDay = async (id: string) => {
    await fetch(`/api/admin/unavailability/${id}`, { method: "DELETE" });
    setDays((prev) => prev.filter((d) => d.id !== id));
  };

  if (loading || !restaurant) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-border p-16 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Beállítások betöltése…
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Nyitvatartás</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {restaurant.hours.map((h, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input value={h.day} onChange={(e) => updateHour(i, "day", e.target.value)} />
              <Input value={h.hours} onChange={(e) => updateHour(i, "hours", e.target.value)} />
            </div>
          ))}

          <div className="mt-2">
            <Label htmlFor="max-guests">Max napi vendégszám</Label>
            <Input
              id="max-guests"
              type="number"
              className="mt-1.5"
              value={restaurant.max_daily_guests}
              onChange={(e) =>
                setRestaurant({ ...restaurant, max_daily_guests: Number(e.target.value) })
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                className="mt-1.5"
                value={restaurant.phone ?? ""}
                onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                className="mt-1.5"
                value={restaurant.email ?? ""}
                onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Cím</Label>
              <Input
                id="address"
                className="mt-1.5"
                value={restaurant.address ?? ""}
                onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="mt-2 w-fit gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Beállítások mentése
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zárva tartott napok</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input type="date" value={newClosedDate} onChange={(e) => setNewClosedDate(e.target.value)} />
            <Input
              placeholder="Indoklás (opcionális)"
              value={newClosedReason}
              onChange={(e) => setNewClosedReason(e.target.value)}
            />
            <Button onClick={addClosedDay} className="gap-1.5 shrink-0">
              <Plus className="h-4 w-4" /> Hozzáadás
            </Button>
          </div>

          {days.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nincs rögzített zárvatartás.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {days.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-sm">
                  <div>
                    <p className="font-medium">{formatDateHu(d.date)}</p>
                    {d.reason && <p className="text-muted-foreground">{d.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeClosedDay(d.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
