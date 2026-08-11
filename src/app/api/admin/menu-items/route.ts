import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createMenuItem } from "@/lib/data/menu-admin";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const createSchema = z.object({
  category_id: z.string().min(1),
  name: z.string().min(2),
  description: z.string().max(500).nullable().optional(),
  price: z.number().int().min(0),
  image_url: z.string().url().nullable().optional().or(z.literal("")),
  dietary_info: z.array(z.string()),
  allergens: z.array(z.string()),
  is_available: z.boolean(),
  seasonal: z.boolean(),
  is_new: z.boolean(),
  portion_size: z.string().max(50).nullable().optional(),
});

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const item = await createMenuItem({
    ...parsed.data,
    image_url: parsed.data.image_url || null,
  });

  return NextResponse.json({ item }, { status: 201 });
}
