"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewsCarouselProps {
  reviews: Review[];
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="bg-avocado-950 py-24 text-cream-50 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <p className="section-heading-eyebrow text-gold-400">Vendégvélemények</p>
          <h2 className="mt-3 text-balance font-display text-4xl italic sm:text-5xl">
            Amit rólunk mondanak
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review) => (
                <div key={review.id} className="min-w-0 flex-[0_0_100%] px-4 sm:flex-[0_0_60%] lg:flex-[0_0_42%]">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex h-full flex-col gap-4 rounded-3xl border border-cream-100/10 bg-avocado-900/60 p-8"
                  >
                    <Quote className="h-7 w-7 text-gold-400" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < review.rating ? "fill-gold-400 text-gold-400" : "text-cream-100/20"
                          )}
                        />
                      ))}
                    </div>
                    <p className="flex-1 text-balance leading-relaxed text-cream-100/85">
                      &bdquo;{review.comment}&rdquo;
                    </p>
                    <p className="font-display text-lg italic text-cream-50">{review.guest_name}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              aria-label="Előző vélemény"
              onClick={() => emblaApi?.scrollPrev()}
              className="rounded-full border border-cream-100/20 p-2.5 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((review, i) => (
                <button
                  key={review.id}
                  aria-label={`Ugrás a(z) ${i + 1}. véleményre`}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === selectedIndex ? "w-6 bg-gold-400" : "w-1.5 bg-cream-100/30"
                  )}
                />
              ))}
            </div>
            <button
              aria-label="Következő vélemény"
              onClick={() => emblaApi?.scrollNext()}
              className="rounded-full border border-cream-100/20 p-2.5 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
