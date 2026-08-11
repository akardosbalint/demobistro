"use client";

import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn, formatDateHu } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []))
      .finally(() => setLoading(false));
  }, []);

  const togglePublished = async (review: Review, value: boolean) => {
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, is_published: value } : r)));
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: value }),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-3xl border border-dashed border-border p-16 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Vélemények betöltése…
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-border p-16 text-center text-muted-foreground">
        Még nincs beérkezett vélemény.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{review.guest_name}</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3.5 w-3.5", i < review.rating ? "fill-gold-400 text-gold-400" : "text-border")}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{formatDateHu(review.created_at)}</span>
            </div>
            {review.comment && <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>}
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm">
            Publikus
            <Switch
              checked={review.is_published}
              onCheckedChange={(value) => togglePublished(review, value)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
