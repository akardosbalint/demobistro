import { NextRequest, NextResponse } from "next/server";
import { getBookingByToken } from "@/lib/data/bookings";

// GET /api/bookings/confirm/[token] — foglalás lekérdezése visszaigazoló tokennel
// (visszaigazoló oldal és a vendég általi lemondás ezt használja, admin session nélkül).
export async function GET(_request: NextRequest, { params }: { params: { token: string } }) {
  const booking = await getBookingByToken(params.token);

  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
