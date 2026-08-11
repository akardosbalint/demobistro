import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createCategory, getAllCategoriesWithItems } from "@/lib/data/menu-admin";
import { slugify } from "@/lib/utils";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(300).nullable().optional(),
});

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const categories = await getAllCategoriesWithItems();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const category = await createCategory({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description ?? null,
  });

  return NextResponse.json({ category }, { status: 201 });
}
