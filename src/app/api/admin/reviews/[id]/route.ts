import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { setReviewPublished } from "@/lib/data/reviews";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const schema = z.object({ is_published: z.boolean() });

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const review = await setReviewPublished(params.id, parsed.data.is_published);
  return NextResponse.json({ review });
}
