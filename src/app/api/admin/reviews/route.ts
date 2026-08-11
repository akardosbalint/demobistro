import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listAllReviews } from "@/lib/data/reviews";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const reviews = await listAllReviews();
  return NextResponse.json({ reviews });
}
