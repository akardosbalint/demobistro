import { z } from "zod";

export const bookingStepOneSchema = z.object({
  bookingDate: z.string().min(1, "Válassz dátumot."),
  bookingTime: z.string().min(1, "Válassz időpontot."),
});

export const bookingStepTwoSchema = z.object({
  guestCount: z.coerce
    .number({ invalid_type_error: "Add meg a létszámot." })
    .int()
    .min(1, "Legalább 1 fő.")
    .max(12, "12 főnél nagyobb csoportért keress minket telefonon."),
  tableType: z.string().min(1, "Válassz asztaltípust."),
});

export const bookingStepThreeSchema = z.object({
  guestName: z.string().min(2, "Add meg a teljes neved."),
  guestEmail: z.string().email("Érvénytelen e-mail cím."),
  guestPhone: z
    .string()
    .min(6, "Add meg a telefonszámod.")
    .regex(/^[0-9+\s()-]+$/, "Érvénytelen telefonszám formátum."),
  dietaryRestrictions: z.array(z.string()).default([]),
  specialRequests: z.string().max(500, "Legfeljebb 500 karakter.").optional(),
});

export const bookingFormSchema = bookingStepOneSchema
  .merge(bookingStepTwoSchema)
  .merge(bookingStepThreeSchema)
  .extend({
    depositAccepted: z.boolean().optional(),
  });

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
