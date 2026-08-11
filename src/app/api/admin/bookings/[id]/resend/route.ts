import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getBookingById } from "@/lib/data/bookings";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { sendBookingConfirmationSms } from "@/lib/sms";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

// POST /api/admin/bookings/[id]/resend — visszaigazoló e-mail/SMS újraküldése admin kérésre
export async function POST(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const booking = await getBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  const [emailResult, smsResult] = await Promise.allSettled([
    sendBookingConfirmationEmail(booking),
    sendBookingConfirmationSms(booking),
  ]);

  if (emailResult.status === "rejected") {
    console.error(`[notify:admin-resend:${booking.id}] email sikertelen:`, emailResult.reason);
  }
  if (smsResult.status === "rejected") {
    console.error(`[notify:admin-resend:${booking.id}] sms sikertelen:`, smsResult.reason);
  }

  if (emailResult.status === "rejected" && smsResult.status === "rejected") {
    return NextResponse.json(
      { error: "Az e-mail és az SMS küldése is sikertelen volt. Nézd meg a szerver logot." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    emailSent: emailResult.status === "fulfilled",
    smsSent: smsResult.status === "fulfilled",
  });
}
