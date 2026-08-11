import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBookingById, updateBooking, deleteBooking } from "@/lib/data/bookings";
import { requireAdmin } from "@/lib/auth";
import { sendBookingCancellationEmail } from "@/lib/email";
import { sendBookingCancellationSms } from "@/lib/sms";

// Minden API route élő, kérésenkénti adatot szolgál ki — build időben nem statikusan renderelendő.
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  confirmation_token: z.string().uuid().optional(),
  booking_status: z.enum(["confirmed", "checked-in", "no-show", "cancelled"]).optional(),
  admin_note: z.string().max(1000).optional(),
  guest_count: z.number().int().positive().optional(),
  booking_time: z.string().optional(),
  table_type: z.string().optional(),
  special_requests: z.string().max(500).nullable().optional(),
});

// PATCH /api/bookings/[id] — vendég lemondás (confirmation_token-nel) vagy admin szerkesztés
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const booking = await getBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Érvénytelen JSON törzs." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Érvénytelen adatok." }, { status: 422 });
  }

  const { confirmation_token, ...patch } = parsed.data;

  const isGuestSelfCancel =
    confirmation_token &&
    confirmation_token === booking.confirmation_token &&
    Object.keys(patch).length === 1 &&
    patch.booking_status === "cancelled";

  if (!isGuestSelfCancel) {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;
  }

  const updated = await updateBooking(params.id, patch);

  if (patch.booking_status === "cancelled" && booking.booking_status !== "cancelled") {
    await Promise.allSettled([
      sendBookingCancellationEmail(updated),
      sendBookingCancellationSms(updated),
    ]);
  }

  return NextResponse.json({ booking: updated });
}

// DELETE /api/bookings/[id] — admin által végleges törlés
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const booking = await getBookingById(params.id);
  if (!booking) {
    return NextResponse.json({ error: "A foglalás nem található." }, { status: 404 });
  }

  await deleteBooking(params.id);
  return NextResponse.json({ success: true });
}
