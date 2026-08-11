import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBookingsForDate } from "@/lib/data/bookings";
import { generateTimeSlots, isDateInPast, isRestaurantClosedOn } from "@/lib/booking-utils";
import { getRestaurant } from "@/lib/data/restaurant";
import { bookingFormSchema } from "@/lib/validations/booking";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { sendBookingConfirmationSms } from "@/lib/sms";
import { notifyAll } from "@/lib/notify";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

// GET /api/bookings?date=YYYY-MM-DD — az adott napi szabad időpontok lekérdezése
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Érvénytelen vagy hiányzó dátum paraméter." }, { status: 400 });
  }

  const targetDate = new Date(date + "T00:00:00");
  const closed = isRestaurantClosedOn(targetDate) || isDateInPast(date);

  if (closed) {
    return NextResponse.json({ closed: true, slots: [] });
  }

  const [restaurant, existingBookings] = await Promise.all([
    getRestaurant(),
    getBookingsForDate(date),
  ]);

  const guestsByTime = existingBookings.reduce<Record<string, number>>((acc, booking) => {
    const time = booking.booking_time.slice(0, 5);
    acc[time] = (acc[time] ?? 0) + booking.guest_count;
    return acc;
  }, {});

  const totalGuestsToday = existingBookings.reduce((sum, b) => sum + b.guest_count, 0);
  const dayIsFull = totalGuestsToday >= restaurant.max_daily_guests;

  const slots = generateTimeSlots().map((time) => ({
    time,
    available: !dayIsFull,
    guestsBooked: guestsByTime[time] ?? 0,
  }));

  return NextResponse.json({ closed: false, slots, dayIsFull });
}

// POST /api/bookings — új asztalfoglalás létrehozása
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Érvénytelen JSON törzs." }, { status: 400 });
  }

  const parsed = bookingFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Érvénytelen adatok.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (isDateInPast(data.bookingDate) || isRestaurantClosedOn(new Date(data.bookingDate + "T00:00:00"))) {
    return NextResponse.json({ error: "A választott dátum nem foglalható." }, { status: 409 });
  }

  const restaurant = await getRestaurant();
  const existingBookings = await getBookingsForDate(data.bookingDate);
  const totalGuests = existingBookings.reduce((sum, b) => sum + b.guest_count, 0);

  if (totalGuests + data.guestCount > restaurant.max_daily_guests) {
    return NextResponse.json(
      { error: "Sajnáljuk, erre a napra már nincs elég szabad hely." },
      { status: 409 }
    );
  }

  const booking = await createBooking({
    guest_name: data.guestName,
    guest_email: data.guestEmail,
    guest_phone: data.guestPhone,
    guest_count: data.guestCount,
    booking_date: data.bookingDate,
    booking_time: data.bookingTime,
    table_type: data.tableType,
    special_requests: data.specialRequests ?? null,
    dietary_restrictions: data.dietaryRestrictions,
  });

  // E-mail/SMS küldés nem blokkolja a választ hiba esetén (a foglalás már létrejött),
  // de a sikertelen küldést mindig logoljuk (lásd notifyAll).
  await notifyAll(
    [sendBookingConfirmationEmail(booking), sendBookingConfirmationSms(booking)],
    "booking-confirmation"
  );

  return NextResponse.json({ booking }, { status: 201 });
}
