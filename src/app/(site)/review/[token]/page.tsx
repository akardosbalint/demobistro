import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBookingByToken } from "@/lib/data/bookings";
import { ReviewForm } from "@/components/review/review-form";

export const metadata: Metadata = { title: "Vélemény írása" };

export default async function ReviewPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const booking = await getBookingByToken(params.token);
  if (!booking) notFound();

  return (
    <div className="pt-20">
      <div className="border-b border-border/60 bg-leaf-texture py-16 text-center">
        <div className="container-narrow">
          <p className="section-heading-eyebrow">Zöld Sarok</p>
          <h1 className="mt-3 font-display text-5xl italic sm:text-6xl">Milyen volt nálunk?</h1>
          <p className="mx-auto mt-4 max-w-lg text-balance text-muted-foreground">
            Kedves {booking.guest_name.split(" ")[0]}! Örülnénk, ha megosztanád velünk a
            tapasztalataidat.
          </p>
        </div>
      </div>

      <div className="container-narrow max-w-lg py-16">
        <ReviewForm token={params.token} guestName={booking.guest_name} />
      </div>
    </div>
  );
}
