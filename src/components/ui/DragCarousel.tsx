"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DragCarousel({
  children,
  itemCount,
  className,
}: {
  children: React.ReactNode;
  itemCount: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [constraint, setConstraint] = useState(0);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    if (containerRef.current && trackRef.current) {
      const diff = trackRef.current.scrollWidth - containerRef.current.clientWidth;
      setConstraint(diff > 0 ? diff : 0);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function scrollByStep(dir: 1 | -1) {
    if (!trackRef.current || !containerRef.current) return;
    const cardEl = trackRef.current.firstElementChild as HTMLElement | null;
    const step = cardEl ? cardEl.getBoundingClientRect().width + 20 : 340;
    const next = Math.min(Math.max(x.get() - dir * step, -constraint), 0);
    x.set(next);
    controls.start({ x: next, transition: { type: "spring", stiffness: 260, damping: 32 } });
    updateActive(next);
  }

  function updateActive(currentX: number) {
    if (!constraint) return setActive(0);
    const progress = Math.abs(currentX) / constraint;
    setActive(Math.round(progress * (itemCount - 1)));
  }

  return (
    <div className={cn("relative", className)}>
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex gap-5 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -constraint, right: 0 }}
          dragElastic={0.08}
          animate={controls}
          onDragEnd={() => updateActive(x.get())}
        >
          {children}
        </motion.div>
      </div>

      {constraint > 0 && (
        <>
          <button
            onClick={() => scrollByStep(-1)}
            aria-label="Previous"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 size-11 items-center justify-center rounded-full bg-white border border-ink-200 shadow-lift text-ink-700 hover:text-brand-600 hover:border-brand-300 transition-colors z-10"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => scrollByStep(1)}
            aria-label="Next"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 size-11 items-center justify-center rounded-full bg-white border border-ink-200 shadow-lift text-ink-700 hover:text-brand-600 hover:border-brand-300 transition-colors z-10"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-8">
            {Array.from({ length: itemCount }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-brand-600" : "w-1.5 bg-ink-200"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
