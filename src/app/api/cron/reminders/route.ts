import { NextRequest, NextResponse } from "next/server";
import { listBookings, updateBooking } from "@/lib/data/bookings";
import { sendBookingReminderEmail, sendReviewInviteEmail } from "@/lib/email";
import { sendBookingReminderSms } from "@/lib/sms";
import { notifyAll } from "@/lib/notify";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

// Vercel Cron kompatibilis endpoint — javasolt ütemezés: */15 * * * * (15 percenként)
// Feladatai: 24h / 2h emlékeztetők kiküldése, valamint 2 nappal a bejelentkezés (check-in) után
// review-meghívó e-mail küldése.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  // Production build-ben a CRON_SECRET beállítása KÖTELEZŐ — enélkül bárki, aki ismeri
  // az URL-t, tömegesen kiváltaná az emlékeztető e-mail/SMS küldést. Vercel Cron a
  // beállított CRON_SECRET-et automatikusan mellékeli Authorization: Bearer fejlécként.
  if (!cronSecret) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "A CRON_SECRET nincs beállítva — a cron endpoint zárva marad." },
        { status: 503 }
      );
    }
  } else {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Jogosulatlan." }, { status: 401 });
    }
  }

  const now = new Date();
  const toIso = (d: Date) => d.toISOString().slice(0, 10);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 3);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await listBookings({ from: toIso(yesterday), to: toIso(tomorrow) });

  let reminders24h = 0;
  let reminders2h = 0;
  let reviewInvites = 0;

  for (const booking of bookings) {
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    const hoursUntil = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (
      booking.booking_status === "confirmed" &&
      !booking.reminder_sent_24h &&
      hoursUntil <= 24 &&
      hoursUntil > 1.5
    ) {
      await notifyAll(
        [sendBookingReminderEmail(booking, 24), sendBookingReminderSms(booking, 24)],
        `reminder-24h:${booking.id}`
      );
      await updateBooking(booking.id, { reminder_sent_24h: true });
      reminders24h++;
    }

    if (
      booking.booking_status === "confirmed" &&
      !booking.reminder_sent_2h &&
      hoursUntil <= 2 &&
      hoursUntil > 0
    ) {
      await notifyAll(
        [sendBookingReminderEmail(booking, 2), sendBookingReminderSms(booking, 2)],
        `reminder-2h:${booking.id}`
      );
      await updateBooking(booking.id, { reminder_sent_2h: true });
      reminders2h++;
    }

    const daysSinceBooking = (now.getTime() - bookingDateTime.getTime()) / (1000 * 60 * 60 * 24);
    if (
      booking.booking_status === "checked-in" &&
      !booking.review_invite_sent &&
      daysSinceBooking >= 2
    ) {
      const reviewUrl = `${request.nextUrl.origin}/review/${booking.confirmation_token}`;
      await notifyAll([sendReviewInviteEmail(booking, reviewUrl)], `review-invite:${booking.id}`);
      await updateBooking(booking.id, { review_invite_sent: true });
      reviewInvites++;
    }
  }

  return NextResponse.json({ reminders24h, reminders2h, reviewInvites, checked: bookings.length });
}
