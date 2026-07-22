"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [hovering, setHovering] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.25), transparent 60%)`
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseEnter() {
    if (canHover) setHovering(true);
  }

  function handleMouseLeave() {
    px.set(0.5);
    py.set(0.5);
    setHovering(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("relative", className)}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
            hovering && "opacity-100"
          )}
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
