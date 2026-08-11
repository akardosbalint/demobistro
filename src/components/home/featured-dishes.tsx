"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DishPlaceholder } from "@/components/menu/dish-placeholder";
import { BlurImage } from "@/components/menu/blur-image";
import { PriceTag } from "@/components/menu/price-tag";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/types";

interface FeaturedDishesProps {
  items: MenuItem[];
}

export function FeaturedDishes({ items }: FeaturedDishesProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <p className="section-heading-eyebrow">Ajánljuk</p>
          <h2 className="mt-3 text-balance font-display text-4xl italic sm:text-5xl">
            A séf kedvencei
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <Link
                href="/menu"
                className="group block overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.image_url ? (
                    <BlurImage
                      src={item.image_url}
                      alt={item.name}
                      fill
                      sizes="(min-width: 640px) 33vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                      <DishPlaceholder seed={item.id} name={item.name} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 p-6">
                  <div>
                    <h3 className="font-display text-xl">{item.name}</h3>
                    <PriceTag value={item.price} className="mt-1 block text-sm text-muted-foreground" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/menu">Teljes étlap megtekintése</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
