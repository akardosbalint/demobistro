"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDateHu } from "@/lib/utils";
import { bookingStatusLabels, dietaryLabels, tableTypeLabels } from "@/lib/site-config";
import { Mail, Phone, Loader2, CheckCircle2, XCircle, Ban, Send, Trash2 } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";

interface BookingDetailDialogProps {
  booking: Booking | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: (booking: Booking) => void;
  onDeleted: (id: string) => void;
}

const statusVariant: Record<string, "default" | "success" | "secondary" | "destructive"> = {
  confirmed: "default",
  "checked-in": "success",
  "no-show": "destructive",
  cancelled: "secondary",
};

export function BookingDetailDialog({ booking, onOpenChange, onUpdated, onDeleted }: BookingDetailDialogProps) {
  const { toast } = useToast();
  const [note, setNote] = useState(booking?.admin_note ?? "");
  const [busy, setBusy] = useState<string | null>(null);

  if (!booking) return null;

  const patch = async (body: Record<string, unknown>, actionKey: string) => {
    setBusy(actionKey);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sikertelen frissítés.");
      onUpdated(data.booking as Booking);
      toast({ title: "Foglalás frissítve" });
    } catch (err) {
      toast({
        title: "Hiba történt",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const setStatus = (status: BookingStatus) => patch({ booking_status: status }, `status-${status}`);

  const saveNote = () => patch({ admin_note: note }, "note");

  const resend = async () => {
    setBusy("resend");
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/resend`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sikertelen küldés.");
      if (!data.emailSent || !data.smsSent) {
        toast({
          title: "Részben sikertelen küldés",
          description: `E-mail: ${data.emailSent ? "elküldve" : "sikertelen"} · SMS: ${data.smsSent ? "elküldve" : "sikertelen"}`,
        });
      } else {
        toast({ title: "Visszaigazolás újraküldve" });
      }
    } catch (err) {
      toast({
        title: "Hiba történt",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!confirm("Biztosan véglegesen törlöd ezt a foglalást?")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Sikertelen törlés.");
      onDeleted(booking.id);
      toast({ title: "Foglalás törölve" });
    } catch {
      toast({ title: "Hiba történt", variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle>{booking.guest_name}</DialogTitle>
            <Badge variant={statusVariant[booking.booking_status]}>
              {bookingStatusLabels[booking.booking_status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-secondary/40 p-4">
            <div>
              <p className="text-muted-foreground">Dátum</p>
              <p className="font-medium">{formatDateHu(booking.booking_date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Időpont</p>
              <p className="font-medium">{booking.booking_time}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Létszám</p>
              <p className="font-medium">{booking.guest_count} fő</p>
            </div>
            <div>
              <p className="text-muted-foreground">Asztal</p>
              <p className="font-medium">{tableTypeLabels[booking.table_type] ?? booking.table_type}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <a href={`mailto:${booking.guest_email}`} className="flex items-center gap-2 hover:text-primary">
              <Mail className="h-4 w-4 text-muted-foreground" /> {booking.guest_email}
            </a>
            <a href={`tel:${booking.guest_phone}`} className="flex items-center gap-2 hover:text-primary">
              <Phone className="h-4 w-4 text-muted-foreground" /> {booking.guest_phone}
            </a>
          </div>

          {booking.dietary_restrictions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {booking.dietary_restrictions.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {dietaryLabels[tag] ?? tag}
                </Badge>
              ))}
            </div>
          )}

          {booking.special_requests && (
            <p className="rounded-xl bg-gold-50 p-3 text-sm text-gold-700">
              &bdquo;{booking.special_requests}&rdquo;
            </p>
          )}

          <div>
            <Label htmlFor="admin-note">Belső jegyzet</Label>
            <Textarea
              id="admin-note"
              className="mt-1.5"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <Button size="sm" variant="outline" className="mt-2" onClick={saveNote} disabled={busy === "note"}>
              {busy === "note" && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
              Jegyzet mentése
            </Button>
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2 sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatus("checked-in")}
              disabled={busy !== null || booking.booking_status === "checked-in"}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Check-in
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatus("no-show")}
              disabled={busy !== null || booking.booking_status === "no-show"}
              className="gap-1.5"
            >
              <XCircle className="h-3.5 w-3.5" /> No-show
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatus("cancelled")}
              disabled={busy !== null || booking.booking_status === "cancelled"}
              className="gap-1.5"
            >
              <Ban className="h-3.5 w-3.5" /> Lemondás
            </Button>
            <Button size="sm" variant="outline" onClick={resend} disabled={busy !== null} className="gap-1.5">
              <Send className="h-3.5 w-3.5" /> Újraküldés
            </Button>
          </div>
          <Button size="sm" variant="destructive" onClick={remove} disabled={busy !== null} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Törlés
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
