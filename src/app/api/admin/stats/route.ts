import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/data/admin-stats";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const stats = await getAdminStats();
  return NextResponse.json({ stats });
}
