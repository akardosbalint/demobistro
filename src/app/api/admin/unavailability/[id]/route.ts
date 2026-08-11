import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { removeUnavailability } from "@/lib/data/unavailability";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  await removeUnavailability(params.id);
  return NextResponse.json({ success: true });
}
