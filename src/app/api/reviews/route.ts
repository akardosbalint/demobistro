import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBookingByToken } from "@/lib/data/bookings";
import { createReview } from "@/lib/data/reviews";

const schema = z.object({
  token: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// POST /api/reviews — vendég által beküldött vélemény (a foglalás visszaigazoló tokenjével azonosítva)
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const booking = await getBookingByToken(parsed.data.token);
  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  const review = await createReview({
    restaurant_id: booking.restaurant_id,
    booking_id: booking.id,
    guest_name: booking.guest_name,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  });

  return NextResponse.json({ review }, { status: 201 });
}
