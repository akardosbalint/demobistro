"use client";

import type { UseFormReturn } from "react-hook-form";
import { CalendarDays, Clock, Users, MapPin } from "lucide-react";
import { formatDateHu } from "@/lib/utils";
import { dietaryLabels, tableTypeLabels } from "@/lib/site-config";
import type { BookingFormSchema } from "@/lib/validations/booking";

export function StepSummary({ form }: { form: UseFormReturn<BookingFormSchema> }) {
  const { watch } = form;
  const values = watch();

  const rows = [
    { icon: CalendarDays, label: "Dátum", value: values.bookingDate ? formatDateHu(values.bookingDate) : "—" },
    { icon: Clock, label: "Időpont", value: values.bookingTime || "—" },
    { icon: Users, label: "Létszám", value: `${values.guestCount} fő` },
    { icon: MapPin, label: "Asztal", value: tableTypeLabels[values.tableType] ?? values.tableType },
  ];

  return (
    <div className="grid gap-8">
      <div>
        <h3 className="mb-4 font-display text-2xl">Foglalás összegzése</h3>
        <div className="grid gap-3 rounded-3xl border border-border/60 bg-card p-6">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <row.icon className="h-4 w-4 text-primary" />
                {row.label}
              </span>
              <span className="font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-6">
        <h4 className="font-display text-lg">Kapcsolattartó</h4>
        <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
          <span>{values.guestName}</span>
          <span>{values.guestEmail}</span>
          <span>{values.guestPhone}</span>
        </div>

        {values.dietaryRestrictions?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {values.dietaryRestrictions.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-avocado-100 px-3 py-1 text-xs font-medium text-avocado-700"
              >
                {dietaryLabels[tag] ?? tag}
              </span>
            ))}
          </div>
        )}

        {values.specialRequests && (
          <p className="mt-4 rounded-xl bg-secondary/50 p-3 text-sm text-foreground/80">
            &bdquo;{values.specialRequests}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
