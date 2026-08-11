"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  isDateDisabled: (date: Date) => boolean;
}

const WEEKDAYS = ["H", "K", "Sz", "Cs", "P", "Szo", "V"];
const MONTH_NAMES = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// Hétfővel kezdődő hét naptári rács generálása az adott hónaphoz.
function buildMonthGrid(monthDate: Date): (Date | null)[] {
  const first = startOfMonth(monthDate);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const firstWeekday = (first.getDay() + 6) % 7; // 0 = hétfő

  const cells: (Date | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }
  return cells;
}

export function MiniCalendar({ selected, onSelect, isDateDisabled }: MiniCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(today));
  const [direction, setDirection] = useState(1);

  const cells = buildMonthGrid(visibleMonth);

  const changeMonth = (delta: number) => {
    setDirection(delta);
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const isPastMonth =
    visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth();

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          disabled={isPastMonth}
          aria-label="Előző hónap"
          className="rounded-full p-2 transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-lg">
          {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Következő hónap"
          className="rounded-full p-2 transition-colors hover:bg-secondary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-1"
        >
          {cells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} />;
            const disabled = isDateDisabled(date);
            const isSelected = selected && toDateKey(selected) === toDateKey(date);
            const isToday = toDateKey(today) === toDateKey(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(date)}
                className={cn(
                  "relative aspect-square rounded-xl text-sm font-medium transition-colors",
                  disabled && "cursor-not-allowed text-muted-foreground/30 line-through",
                  !disabled && !isSelected && "hover:bg-secondary",
                  isSelected && "bg-primary text-primary-foreground shadow-md",
                  isToday && !isSelected && "border border-primary/40"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
