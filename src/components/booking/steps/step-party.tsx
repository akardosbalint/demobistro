"use client";

import type { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Minus, Plus, Armchair, LayoutGrid, TreePine, Wine, DoorClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import { tableTypeLabels } from "@/lib/site-config";
import type { BookingFormSchema } from "@/lib/validations/booking";

const tableIcons: Record<string, typeof Armchair> = {
  standard: LayoutGrid,
  window: Armchair,
  terrace: TreePine,
  bar: Wine,
  private: DoorClosed,
};

export function StepParty({ form }: { form: UseFormReturn<BookingFormSchema> }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const guestCount = watch("guestCount") || 2;
  const tableType = watch("tableType");

  return (
    <div className="grid gap-10">
      <div>
        <h3 className="mb-4 font-display text-2xl">Hányan lesztek?</h3>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setValue("guestCount", Math.max(1, guestCount - 1), { shouldValidate: true })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary disabled:opacity-30"
            disabled={guestCount <= 1}
            aria-label="Kevesebb vendég"
          >
            <Minus className="h-4 w-4" />
          </button>
          <motion.span
            key={guestCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 text-center font-display text-4xl"
          >
            {guestCount}
          </motion.span>
          <button
            type="button"
            onClick={() => setValue("guestCount", Math.min(12, guestCount + 1), { shouldValidate: true })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary disabled:opacity-30"
            disabled={guestCount >= 12}
            aria-label="Több vendég"
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">
            {guestCount === 1 ? "1 fő" : `${guestCount} fő`}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          12 főnél nagyobb csoportért hívj minket telefonon a különterem foglalásához.
        </p>
        {errors.guestCount && (
          <p className="mt-2 text-sm text-destructive">{errors.guestCount.message}</p>
        )}
      </div>

      <div>
        <h3 className="mb-4 font-display text-2xl">Asztal preferencia</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(tableTypeLabels).map(([value, label]) => {
            const Icon = tableIcons[value] ?? Armchair;
            const isSelected = tableType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue("tableType", value, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                )}
              >
                <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        {errors.tableType && <p className="mt-2 text-sm text-destructive">{errors.tableType.message}</p>}
      </div>
    </div>
  );
}
