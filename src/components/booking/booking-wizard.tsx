"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/booking/progress-bar";
import { StepDateTime } from "@/components/booking/steps/step-date-time";
import { StepParty } from "@/components/booking/steps/step-party";
import { StepContact } from "@/components/booking/steps/step-contact";
import { StepSummary } from "@/components/booking/steps/step-summary";
import { SuccessScreen } from "@/components/booking/success-screen";
import { bookingFormSchema, type BookingFormSchema } from "@/lib/validations/booking";
import type { Booking } from "@/types";

const STEP_FIELDS: (keyof BookingFormSchema)[][] = [
  ["bookingDate", "bookingTime"],
  ["guestCount", "tableType"],
  ["guestName", "guestEmail", "guestPhone", "dietaryRestrictions", "specialRequests"],
  [],
];

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
    defaultValues: {
      bookingDate: "",
      bookingTime: "",
      guestCount: 2,
      tableType: "standard",
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      dietaryRestrictions: [],
      specialRequests: "",
      depositAccepted: false,
    },
  });

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (values: BookingFormSchema) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Ismeretlen hiba történt.");
      }
      setConfirmedBooking(data.booking as Booking);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Ismeretlen hiba történt.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return <SuccessScreen booking={confirmedBooking} />;
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div>
      <ProgressBar currentStep={step} />

      <div className="relative mt-12 min-h-[420px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 && <StepDateTime form={form} />}
            {step === 1 && <StepParty form={form} />}
            {step === 2 && <StepContact form={form} />}
            {step === 3 && <StepSummary form={form} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <p className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Vissza
        </Button>

        {step < 3 ? (
          <Button type="button" onClick={goNext} className="gap-2">
            Tovább
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={submitting}
            className="gap-2"
            size="lg"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Foglalás megerősítése
          </Button>
        )}
      </div>
    </div>
  );
}
