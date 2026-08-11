import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listBookings } from "@/lib/data/bookings";
import type { BookingStatus } from "@/types";

// GET /api/admin/bookings?from=&to=&status= — admin foglaláslista szűrőkkel
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = request.nextUrl;
  const bookings = await listBookings({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    status: (searchParams.get("status") as BookingStatus | null) ?? undefined,
  });

  return NextResponse.json({ bookings });
}
