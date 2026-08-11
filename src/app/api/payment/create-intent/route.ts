import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { getBookingById, updateBooking } from "@/lib/data/bookings";

const schema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().int().positive(), // HUF, legkisebb egység (nincs tizedesjegy)
});

// POST /api/payment/create-intent — opcionális asztalfoglalási kaució Stripe PaymentIntent létrehozása.
// Stripe kulcs hiányában egy stub client secret-et ad vissza, hogy a kód kulcs nélkül is futtatható legyen.
export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const booking = await getBookingById(parsed.data.bookingId);
  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  if (!isStripeConfigured || !stripe) {
    const stubIntentId = `pi_stub_${booking.id.slice(0, 8)}`;
    await updateBooking(booking.id, {
      deposit_required: true,
      deposit_amount: parsed.data.amount,
      stripe_payment_intent_id: stubIntentId,
    });
    return NextResponse.json({
      clientSecret: `${stubIntentId}_secret_stub`,
      stubbed: true,
    });
  }

  const intent = await stripe.paymentIntents.create({
    amount: parsed.data.amount,
    currency: "huf",
    metadata: { bookingId: booking.id },
    automatic_payment_methods: { enabled: true },
  });

  await updateBooking(booking.id, {
    deposit_required: true,
    deposit_amount: parsed.data.amount,
    stripe_payment_intent_id: intent.id,
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
