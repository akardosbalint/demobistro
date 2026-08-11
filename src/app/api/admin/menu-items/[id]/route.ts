import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { updateMenuItem, deleteMenuItem } from "@/lib/data/menu-admin";

const patchSchema = z.object({
  category_id: z.string().optional(),
  name: z.string().min(2).optional(),
  description: z.string().max(500).nullable().optional(),
  price: z.number().int().min(0).optional(),
  image_url: z.string().nullable().optional(),
  dietary_info: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  is_available: z.boolean().optional(),
  seasonal: z.boolean().optional(),
  is_new: z.boolean().optional(),
  portion_size: z.string().max(50).nullable().optional(),
  sort_order: z.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const item = await updateMenuItem(params.id, parsed.data);
  return NextResponse.json({ item });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await deleteMenuItem(params.id);
  return NextResponse.json({ success: true });
}
