"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CalendarCheck2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => null,
});

export function HeroVisual({ yearsCount, patientsCount }: { yearsCount: number; patientsCount: string }) {
  const canRender3D = useMediaQuery("(min-width: 768px)");

  return (
    <div className="relative">
      <div className="relative w-full aspect-4/5 rounded-[32px] border border-ink-200 bg-linear-to-br from-brand-50 via-white to-ink-50 shadow-float overflow-hidden">
        {canRender3D ? (
          <Hero3D />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-40 rounded-full bg-linear-to-br from-brand-400 to-brand-700 blur-2xl opacity-40" />
          </div>
        )}
        <div className="absolute top-6 left-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white/60 px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-soft">
            <span className="size-1.5 rounded-full bg-success-500" />
            Downtown Austin
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/85 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4.5 shadow-lift flex items-center gap-3.5 max-w-64"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <CalendarCheck2 className="size-5" />
        </span>
        <div>
          <div className="text-sm font-bold text-ink-900 leading-tight">Next opening today</div>
          <div className="text-xs text-ink-500">2:30 PM · Dr. Chen</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute -top-5 -right-4 sm:-right-6 bg-white/85 backdrop-blur-xl border border-white/60 rounded-2xl px-4.5 py-3.5 shadow-lift flex gap-4"
      >
        <div>
          <div className="text-xl font-extrabold text-ink-900">{yearsCount}+</div>
          <div className="text-[11px] font-medium text-ink-500">Years</div>
        </div>
        <div className="w-px bg-ink-200" />
        <div>
          <div className="text-xl font-extrabold text-ink-900">{patientsCount}+</div>
          <div className="text-[11px] font-medium text-ink-500">Patients</div>
        </div>
      </motion.div>
    </div>
  );
}
