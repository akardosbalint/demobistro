"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  accent?: "avocado" | "gold" | "clay";
}

const accentClasses: Record<string, string> = {
  avocado: "bg-avocado-100 text-avocado-700",
  gold: "bg-gold-50 text-gold-500",
  clay: "bg-clay-100 text-clay-700",
};

export function StatCard({ icon, label, value, suffix = "", decimals = 0, accent = "avocado" }: StatCardProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 22, stiffness: 100 });
  const display = useTransform(spring, (latest) =>
    decimals > 0
      ? latest.toFixed(decimals)
      : new Intl.NumberFormat("hu-HU").format(Math.round(latest))
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentClasses[accent]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-3xl">
            <motion.span>{display}</motion.span>
            {suffix}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
