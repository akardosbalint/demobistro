"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { MiniCalendar } from "@/components/booking/mini-calendar";
import { cn } from "@/lib/utils";
import { isDateInPast, isRestaurantClosedOn } from "@/lib/booking-utils";
import type { BookingFormSchema } from "@/lib/validations/booking";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AvailabilityResponse {
  closed: boolean;
  dayIsFull?: boolean;
  slots: TimeSlot[];
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function StepDateTime({ form }: { form: UseFormReturn<BookingFormSchema> }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const bookingDate = watch("bookingDate");
  const bookingTime = watch("bookingTime");
  const selectedDate = bookingDate ? new Date(bookingDate + "T00:00:00") : null;

  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingDate) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/bookings?date=${bookingDate}`)
      .then((res) => res.json())
      .then((data: AvailabilityResponse) => {
        if (!cancelled) setAvailability(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingDate]);

  const isDateDisabled = (date: Date) => isDateInPast(toIsoDate(date)) || isRestaurantClosedOn(date);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 font-display text-2xl">Válassz dátumot</h3>
        <MiniCalendar
          selected={selectedDate}
          onSelect={(date) => {
            setValue("bookingDate", toIsoDate(date), { shouldValidate: true });
            setValue("bookingTime", "", { shouldValidate: false });
          }}
          isDateDisabled={isDateDisabled}
        />
        {errors.bookingDate && (
          <p className="mt-2 text-sm text-destructive">{errors.bookingDate.message}</p>
        )}
      </div>

      <div>
        <h3 className="mb-4 font-display text-2xl">Válassz időpontot</h3>
        {!bookingDate && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Először válassz dátumot a naptárban.
          </p>
        )}

        {bookingDate && loading && (
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Elérhető időpontok betöltése…
          </div>
        )}

        {bookingDate && !loading && availability?.closed && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            Ezen a napon zárva tartunk — válassz másik dátumot.
          </p>
        )}

        {bookingDate && !loading && availability && !availability.closed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {availability.slots.map((slot) => {
              const isSelected = bookingTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setValue("bookingTime", slot.time, { shouldValidate: true })}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    !slot.available && "cursor-not-allowed border-border/40 text-muted-foreground/30 line-through",
                    slot.available &&
                      !isSelected &&
                      "border-border text-foreground hover:border-primary/50",
                    isSelected && "border-primary bg-primary text-primary-foreground shadow"
                  )}
                >
                  {slot.time}
                </button>
              );
            })}
          </motion.div>
        )}

        {errors.bookingTime && (
          <p className="mt-3 text-sm text-destructive">{errors.bookingTime.message}</p>
        )}
      </div>
    </div>
  );
}
