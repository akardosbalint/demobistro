"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type BlurImageProps = Omit<ImageProps, "onLoad"> & { containerClassName?: string };

// Blur-up / shimmer skeleton, amíg a kép be nem töltődik.
export function BlurImage({ className, containerClassName, alt, ...props }: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-secondary", containerClassName)}>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer" />}
      <Image
        {...props}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-all duration-700 ease-out",
          loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md",
          className
        )}
      />
    </div>
  );
}
