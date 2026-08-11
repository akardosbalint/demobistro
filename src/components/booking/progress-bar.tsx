"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Időpont", "Létszám", "Adatok", "Összegzés"];

export function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
        <motion.div
          className="absolute left-0 top-4 h-0.5 bg-primary"
          initial={false}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        {steps.map((label, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isDone || isActive ? "hsl(var(--primary))" : "hsl(var(--card))",
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  isDone || isActive ? "border-primary text-primary-foreground" : "border-border text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </motion.div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
