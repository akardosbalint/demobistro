"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateHu } from "@/lib/utils";
import type { Booking } from "@/types";

export function SuccessScreen({ booking }: { booking: Booking }) {
  useEffect(() => {
    const colors = ["#49632c", "#c19a4b", "#a86a3c", "#f8f3e9"];
    const duration = 1600;
    const end = Date.now() + duration;

    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-lg text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-avocado-100"
      >
        <CheckCircle2 className="h-10 w-10 text-avocado-700" />
      </motion.div>

      <h2 className="mt-6 font-display text-3xl italic">Foglalásod megerősítve!</h2>
      <p className="mt-3 text-muted-foreground">
        Visszaigazolást küldtünk a(z) <strong>{booking.guest_email}</strong> címre és
        telefonszámodra.
      </p>

      <div className="mt-8 grid gap-2 rounded-3xl border border-border/60 bg-card p-6 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dátum</span>
          <span className="font-medium">{formatDateHu(booking.booking_date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Időpont</span>
          <span className="font-medium">{booking.booking_time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Létszám</span>
          <span className="font-medium">{booking.guest_count} fő</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Visszaigazoló kód</span>
          <span className="font-mono text-xs">{booking.confirmation_token.slice(0, 8)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">Vissza a főoldalra</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/menu">Étlap böngészése</Link>
        </Button>
      </div>
    </motion.div>
  );
}
