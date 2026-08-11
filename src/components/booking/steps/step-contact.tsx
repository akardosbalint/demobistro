"use client";

import type { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { dietaryLabels } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { BookingFormSchema } from "@/lib/validations/booking";

export function StepContact({ form }: { form: UseFormReturn<BookingFormSchema> }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const dietaryRestrictions = watch("dietaryRestrictions") ?? [];

  const toggleDietary = (key: string) => {
    const next = dietaryRestrictions.includes(key)
      ? dietaryRestrictions.filter((d) => d !== key)
      : [...dietaryRestrictions, key];
    setValue("dietaryRestrictions", next, { shouldValidate: true });
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="guestName">Teljes név</Label>
          <Input id="guestName" className="mt-1.5" placeholder="Kovács Anna" {...register("guestName")} />
          {errors.guestName && <p className="mt-1.5 text-sm text-destructive">{errors.guestName.message}</p>}
        </div>

        <div>
          <Label htmlFor="guestEmail">E-mail cím</Label>
          <Input
            id="guestEmail"
            type="email"
            className="mt-1.5"
            placeholder="anna@example.com"
            {...register("guestEmail")}
          />
          {errors.guestEmail && (
            <p className="mt-1.5 text-sm text-destructive">{errors.guestEmail.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="guestPhone">Telefonszám</Label>
          <Input
            id="guestPhone"
            type="tel"
            className="mt-1.5"
            placeholder="+36 20 123 4567"
            {...register("guestPhone")}
          />
          {errors.guestPhone && (
            <p className="mt-1.5 text-sm text-destructive">{errors.guestPhone.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Étkezési korlátozások</Label>
        <div className="mt-2 flex flex-wrap gap-4">
          {Object.entries(dietaryLabels)
            .filter(([key]) => key !== "seasonal")
            .map(([key, label]) => (
              <label
                key={key}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm transition-colors",
                  dietaryRestrictions.includes(key) && "border-primary bg-primary/5"
                )}
              >
                <Checkbox
                  checked={dietaryRestrictions.includes(key)}
                  onCheckedChange={() => toggleDietary(key)}
                />
                {label}
              </label>
            ))}
        </div>
      </div>

      <div>
        <Label htmlFor="specialRequests">Egyéb kérés (opcionális)</Label>
        <Textarea
          id="specialRequests"
          className="mt-1.5"
          placeholder="Pl. évfordulót ünneplünk, babaszéket kérnénk…"
          {...register("specialRequests")}
        />
        {errors.specialRequests && (
          <p className="mt-1.5 text-sm text-destructive">{errors.specialRequests.message}</p>
        )}
      </div>
    </div>
  );
}
