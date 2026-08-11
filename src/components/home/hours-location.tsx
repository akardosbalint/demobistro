"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function HoursLocation() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.address
  )}`;

  return (
    <section className="container py-24 sm:py-32">
      <div className="grid gap-10 overflow-hidden rounded-[2.5rem] border border-border/60 bg-card shadow-sm lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center gap-8 p-10 sm:p-14"
        >
          <div>
            <p className="section-heading-eyebrow">Látogass el hozzánk</p>
            <h2 className="mt-3 font-display text-4xl italic">Nyitvatartás &amp; elérhetőség</h2>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <ul className="space-y-1.5 text-sm">
              {siteConfig.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-8">
                  <span className="text-foreground/80">{h.day}</span>
                  <span className="font-medium">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{siteConfig.address}</span>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <a href={`tel:${siteConfig.phone}`} className="hover:text-primary">
              {siteConfig.phone}
            </a>
          </div>

          <Button asChild variant="outline" className="w-fit gap-2">
            <a href={mapsHref} target="_blank" rel="noreferrer">
              <Navigation className="h-4 w-4" />
              Útvonaltervezés
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[320px] bg-gradient-to-br from-avocado-800 via-avocado-700 to-clay-700"
        >
          <div className="absolute -left-16 top-10 h-64 w-64 rounded-organic bg-gold-400/20 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-organic bg-cream-100/10 blur-3xl" />
          <div className="relative flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
            <MapPin className="h-10 w-10 text-gold-300" />
            <p className="font-display text-2xl italic text-cream-50">{siteConfig.address}</p>
            <p className="text-sm text-cream-100/70">Budapest belvárosának szívében</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
