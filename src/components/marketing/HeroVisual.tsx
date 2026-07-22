"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => null,
});

export function HeroVisual({ yearsCount, patientsCount }: { yearsCount: number; patientsCount: string }) {
  const canRender3D = useMediaQuery("(min-width: 768px)");

  return (
    <div className="relative">
      <div className="relative w-full aspect-4/5 rounded-[28px] border border-ink-200 bg-linear-to-br from-brand-50 via-white to-ink-50 shadow-float overflow-hidden">
        {canRender3D ? (
          <Hero3D />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-40 rounded-full bg-linear-to-br from-brand-400 to-brand-700 blur-2xl opacity-40" />
          </div>
        )}
        <div className="absolute inset-0 flex items-end p-8 pointer-events-none">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mb-1.5">Meridian Dental</p>
            <p className="text-lg font-bold text-ink-900 leading-snug max-w-56">
              Downtown Austin flagship location
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute -bottom-6 -left-6 sm:-left-8 bg-white border border-ink-200 rounded-2xl px-5 py-4.5 shadow-lift flex gap-5"
      >
        <div>
          <div className="text-2xl font-extrabold text-ink-900">{yearsCount}+</div>
          <div className="text-xs font-medium text-ink-500">Years Experience</div>
        </div>
        <div className="w-px bg-ink-200" />
        <div>
          <div className="text-2xl font-extrabold text-ink-900">{patientsCount}+</div>
          <div className="text-xs font-medium text-ink-500">Happy Patients</div>
        </div>
      </motion.div>
    </div>
  );
}
