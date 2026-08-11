"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-avocado-950">
      {/* Parallax generatív háttér — organikus formák, mert valódi fotó helyett márkahű illusztráció */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 scale-110">
        <div className="absolute inset-0 bg-gradient-to-b from-avocado-950 via-avocado-900 to-avocado-950" />
        <div className="absolute -left-32 top-1/4 h-[36rem] w-[36rem] rounded-organic bg-avocado-700/40 blur-3xl" />
        <div className="absolute -right-24 top-0 h-[30rem] w-[30rem] rounded-organic bg-gold-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-organic bg-clay-400/20 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern id="leaf-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.4" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#leaf-grid)" />
        </svg>
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 flex items-center gap-2 text-gold-300"
        >
          <Leaf className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-[0.35em]">
            Prémium növényi konyha
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-3xl text-balance font-display text-6xl italic leading-[1.05] text-cream-50 sm:text-7xl md:text-8xl"
        >
          {siteConfig.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-xl text-balance text-lg text-cream-100/80"
        >
          {siteConfig.tagline} — szezonális alapanyagokból, kézműves technikákkal, meleg
          atmoszférában.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg" variant="accent">
            <Link href="/booking">Asztalfoglalás</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-cream-100/40 text-cream-50 hover:bg-cream-50/10"
          >
            <Link href="/menu">Étlap megtekintése</Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-cream-100/70"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.div>
    </div>
  );
}
