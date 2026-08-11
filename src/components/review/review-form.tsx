"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ReviewForm({ token, guestName }: { token: string; guestName: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Adj meg egy értékelést.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating, comment }),
      });
      if (!response.ok) throw new Error("Nem sikerült elküldeni a véleményt.");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ismeretlen hiba.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-card p-10 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-avocado-600" />
        <h2 className="font-display text-2xl">Köszönjük a visszajelzést!</h2>
        <p className="text-sm text-muted-foreground">
          Örülünk, hogy időt szántál ránk, {guestName.split(" ")[0]}.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-8">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(value)}
            aria-label={`${value} csillag`}
            className="p-1"
          >
            <Star
              className={cn(
                "h-9 w-9 transition-colors",
                (hoverRating || rating) >= value ? "fill-gold-400 text-gold-400" : "text-border"
              )}
            />
          </button>
        ))}
      </div>

      <Textarea
        className="mt-6"
        placeholder="Meséld el, milyen élményed volt nálunk…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={5}
      />

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <Button onClick={handleSubmit} disabled={submitting} size="lg" className="mt-6 w-full gap-2">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Vélemény elküldése
      </Button>
    </div>
  );
}
