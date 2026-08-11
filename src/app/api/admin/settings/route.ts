import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { getRestaurant, updateRestaurant } from "@/lib/data/restaurant";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const hoursSchema = z.array(z.object({ day: z.string(), hours: z.string() }));

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  hours: hoursSchema.optional(),
  max_daily_guests: z.number().int().min(1).optional(),
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const restaurant = await getRestaurant();
  return NextResponse.json({ restaurant });
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const restaurant = await updateRestaurant(parsed.data);
  return NextResponse.json({ restaurant });
}
