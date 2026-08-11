import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { updateMenuItem, deleteMenuItem } from "@/lib/data/menu-admin";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  category_id: z.string().optional(),
  name: z.string().min(2).optional(),
  description: z.string().max(500).nullable().optional(),
  price: z.number().int().min(0).optional(),
  image_url: z.string().url().nullable().optional().or(z.literal("")),
  dietary_info: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  is_available: z.boolean().optional(),
  seasonal: z.boolean().optional(),
  is_new: z.boolean().optional(),
  portion_size: z.string().max(50).nullable().optional(),
  sort_order: z.number().int().optional(),
});

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const patch = { ...parsed.data };
  if (patch.image_url === "") patch.image_url = null;

  const item = await updateMenuItem(params.id, patch);
  return NextResponse.json({ item });
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await deleteMenuItem(params.id);
  return NextResponse.json({ success: true });
}
