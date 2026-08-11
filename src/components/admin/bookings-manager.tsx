"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutList, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingsCalendar } from "@/components/admin/bookings-calendar";
import { BookingDetailDialog } from "@/components/admin/booking-detail-dialog";
import { cn, formatDateHu } from "@/lib/utils";
import { bookingStatusLabels } from "@/lib/site-config";
import type { Booking, BookingStatus } from "@/types";

const statusVariant: Record<string, "default" | "success" | "secondary" | "destructive"> = {
  confirmed: "default",
  "checked-in": "success",
  "no-show": "destructive",
  cancelled: "secondary",
};

export function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = useMemo(() => {
    return bookings
      .filter((b) => (statusFilter === "all" ? true : b.booking_status === statusFilter))
      .filter((b) => (selectedDate ? b.booking_date === selectedDate : true))
      .sort(
        (a, b) =>
          a.booking_date.localeCompare(b.booking_date) || a.booking_time.localeCompare(b.booking_time)
      );
  }, [bookings, statusFilter, selectedDate]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full bg-secondary/60 p-1">
          <Button
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            className="gap-1.5 rounded-full"
            onClick={() => setView("list")}
          >
            <LayoutList className="h-4 w-4" /> Lista
          </Button>
          <Button
            size="sm"
            variant={view === "calendar" ? "default" : "ghost"}
            className="gap-1.5 rounded-full"
            onClick={() => setView("calendar")}
          >
            <CalendarDays className="h-4 w-4" /> Naptár
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {selectedDate && (
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSelectedDate(null)}>
              {formatDateHu(selectedDate)} ✕
            </Badge>
          )}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Állapot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Összes állapot</SelectItem>
              {Object.entries(bookingStatusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {view === "calendar" && (
        <BookingsCalendar bookings={bookings} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      )}

      <div className="rounded-3xl border border-border/60 bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-16 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Foglalások betöltése…
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-16 text-center text-muted-foreground">Nincs a szűrésnek megfelelő foglalás.</p>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map((booking) => (
              <button
                key={booking.id}
                onClick={() => setActiveBooking(booking)}
                className={cn(
                  "flex w-full flex-col gap-2 p-5 text-left transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                )}
              >
                <div>
                  <p className="font-medium">{booking.guest_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateHu(booking.booking_date)} · {booking.booking_time} · {booking.guest_count} fő
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{booking.guest_phone}</span>
                  <Badge variant={statusVariant[booking.booking_status]}>
                    {bookingStatusLabels[booking.booking_status]}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BookingDetailDialog
        booking={activeBooking}
        onOpenChange={(open) => !open && setActiveBooking(null)}
        onUpdated={(updated) => {
          setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
          setActiveBooking(updated);
        }}
        onDeleted={(id) => {
          setBookings((prev) => prev.filter((b) => b.id !== id));
          setActiveBooking(null);
        }}
      />
    </div>
  );
}
