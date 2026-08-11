import { NextRequest, NextResponse } from "next/server";
import { getBookingByToken } from "@/lib/data/bookings";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

// GET /api/bookings/confirm/[token] — foglalás lekérdezése visszaigazoló tokennel
// (visszaigazoló oldal és a vendég általi lemondás ezt használja, admin session nélkül).
export async function GET(_request: NextRequest, props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const booking = await getBookingByToken(params.token);

  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
