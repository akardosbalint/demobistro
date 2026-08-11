import type { Metadata } from "next";
import { BookingsManager } from "@/components/admin/bookings-manager";

export const metadata: Metadata = { title: "Foglalások" };

export default function AdminBookingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="section-heading-eyebrow">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Foglalások kezelése</h1>
      </div>
      <BookingsManager />
    </div>
  );
}
