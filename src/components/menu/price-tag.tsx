"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

interface PriceTagProps {
  value: number;
  className?: string;
}

// Az ár 0-ról a végleges összegre "pörög fel", amikor a kártya láthatóvá válik.
export function PriceTag({ value, className }: PriceTagProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 24, stiffness: 90 });
  const display = useTransform(spring, (latest) =>
    new Intl.NumberFormat("hu-HU").format(Math.round(latest))
  );

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span> Ft
    </span>
  );
}
