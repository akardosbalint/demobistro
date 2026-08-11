import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { updateCategory, deleteCategory } from "@/lib/data/menu-admin";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().max(300).nullable().optional(),
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

  const category = await updateCategory(params.id, parsed.data);
  return NextResponse.json({ category });
}

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await deleteCategory(params.id);
  return NextResponse.json({ success: true });
}
