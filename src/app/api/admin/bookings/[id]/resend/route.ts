import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getBookingById } from "@/lib/data/bookings";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { sendBookingConfirmationSms } from "@/lib/sms";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

// POST /api/admin/bookings/[id]/resend — visszaigazoló e-mail/SMS újraküldése admin kérésre
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const booking = await getBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  await Promise.allSettled([
    sendBookingConfirmationEmail(booking),
    sendBookingConfirmationSms(booking),
  ]);

  return NextResponse.json({ success: true });
}
