"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

const WEEKDAYS = ["H", "K", "Sz", "Cs", "P", "Szo", "V"];
const MONTH_NAMES = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];

function toIso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface BookingsCalendarProps {
  bookings: Booking[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export function BookingsCalendar({ bookings, selectedDate, onSelectDate }: BookingsCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const booking of bookings) {
      if (booking.booking_status === "cancelled") continue;
      map.set(booking.booking_date, (map.get(booking.booking_date) ?? 0) + 1);
    }
    return map;
  }, [bookings]);

  const cells = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const firstWeekday = (first.getDay() + 6) % 7;
    const result: (Date | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), d));
    }
    return result;
  }, [visibleMonth]);

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          className="rounded-full p-2 hover:bg-secondary"
          aria-label="Előző hónap"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-lg">
          {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="rounded-full p-2 hover:bg-secondary"
          aria-label="Következő hónap"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />;
          const iso = toIso(date);
          const count = countsByDate.get(iso) ?? 0;
          const isSelected = selectedDate === iso;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : iso)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl text-sm transition-colors",
                isSelected ? "bg-primary text-primary-foreground shadow" : "hover:bg-secondary"
              )}
            >
              {date.getDate()}
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-semibold",
                    isSelected ? "bg-primary-foreground/20" : "bg-avocado-100 text-avocado-700"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
