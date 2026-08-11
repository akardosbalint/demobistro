import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Asztalfoglalás",
  description: "Foglalj asztalt a Zöld Sarok Vegan Bistróban pár kattintással.",
};

export default function BookingPage() {
  return (
    <div className="pt-20">
      <div className="border-b border-border/60 bg-leaf-texture py-16 text-center">
        <div className="container-narrow">
          <p className="section-heading-eyebrow">Zöld Sarok</p>
          <h1 className="mt-3 font-display text-5xl italic sm:text-6xl">Asztalfoglalás</h1>
          <p className="mx-auto mt-4 max-w-lg text-balance text-muted-foreground">
            Néhány lépésben lefoglalhatod az asztalod — mi pedig gondoskodunk a többiről.
          </p>
        </div>
      </div>

      <div className="container-narrow py-16">
        <BookingWizard />
      </div>
    </div>
  );
}
