"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/types";

interface CategoryNavProps {
  categories: MenuCategory[];
}

const HEADER_OFFSET = 152; // sticky site header + sticky category nav magassága

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const navScrollRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`category-${c.slug}`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const slug = visible[0].target.id.replace("category-", "");
          setActive(slug);
        }
      },
      { rootMargin: `-${HEADER_OFFSET}px 0px -55% 0px`, threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const pill = pillRefs.current[active];
    pill?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const handleClick = (slug: string) => {
    isClickScrolling.current = true;
    setActive(slug);
    const el = document.getElementById(`category-${slug}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 1;
      window.scrollTo({ top, behavior: "smooth" });
    }
    window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  return (
    <div className="sticky top-20 z-30 border-b border-border/60 bg-cream-50/95 backdrop-blur-md">
      <div
        ref={navScrollRef}
        className="no-scrollbar container flex gap-2 overflow-x-auto py-4"
      >
        {categories.map((category) => {
          const isActive = active === category.slug;
          return (
            <button
              key={category.id}
              ref={(el) => {
                pillRefs.current[category.slug] = el;
              }}
              onClick={() => handleClick(category.slug)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors",
                isActive ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
              )}
              aria-current={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="category-pill-bg"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
