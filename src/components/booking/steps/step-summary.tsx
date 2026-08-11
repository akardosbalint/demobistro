"use client";

import type { UseFormReturn } from "react-hook-form";
import { CalendarDays, Clock, Users, MapPin, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatDateHu, formatCurrencyHUF } from "@/lib/utils";
import { dietaryLabels, tableTypeLabels } from "@/lib/site-config";
import type { BookingFormSchema } from "@/lib/validations/booking";

const DEPOSIT_PER_GUEST = 2000;

export function StepSummary({ form }: { form: UseFormReturn<BookingFormSchema> }) {
  const { watch, setValue } = form;
  const values = watch();
  const depositAmount = (values.guestCount ?? 0) * DEPOSIT_PER_GUEST;

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

      <div className="flex items-center justify-between gap-4 rounded-3xl border border-dashed border-gold-300 bg-gold-50 p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
          <div>
            <Label htmlFor="deposit-toggle" className="text-base">
              Opcionális asztalfoglalási kaució
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrencyHUF(DEPOSIT_PER_GUEST)}/fő — összesen {formatCurrencyHUF(depositAmount)}.
              Étkezéskor levonjuk a végösszegből.
            </p>
          </div>
        </div>
        <Switch
          id="deposit-toggle"
          checked={Boolean(values.depositAccepted)}
          onCheckedChange={(checked) => setValue("depositAccepted", checked)}
        />
      </div>
    </div>
  );
}
