import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { listBookings, updateBooking } from "@/lib/data/bookings";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// POST /api/payment/webhook — Stripe webhook a kaució-fizetések állapotának követésére.
export async function POST(request: NextRequest) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe nincs konfigurálva." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Hiányzó aláírás vagy webhook secret." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ismeretlen hiba.";
    return NextResponse.json({ error: `Webhook aláírás hiba: ${message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as { id: string; metadata?: { bookingId?: string } };
    const bookingId = intent.metadata?.bookingId;
    if (bookingId) {
      await updateBooking(bookingId, { deposit_paid: true });
    } else {
      // Fallback, ha a metaadat hiányzik: keresés a tárolt payment intent id alapján.
      const bookings = await listBookings();
      const match = bookings.find((b) => b.stripe_payment_intent_id === intent.id);
      if (match) await updateBooking(match.id, { deposit_paid: true });
    }
  }

  return NextResponse.json({ received: true });
}
