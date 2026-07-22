"use client";

import { motion } from "framer-motion";
import { Sparkles, CalendarCheck, ShieldCheck, HeartHandshake, ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

export function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Why Patients Choose Us</p>
        <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900">
          Care that feels different from the moment you walk in
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Feature card — large, spans 2 rows */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
          className="md:col-span-7 md:row-span-2 group"
        >
          <TiltCard className="h-full rounded-3xl border border-ink-200 bg-linear-to-br from-white to-brand-50/50 p-8 lg:p-10 overflow-hidden relative">
            <div
              className="absolute -bottom-16 -right-16 size-56 rounded-full bg-brand-200/30 blur-2xl transition-transform duration-500 group-hover:scale-110"
              aria-hidden="true"
            />
            <div className="relative flex flex-col h-full">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-[0_12px_24px_-8px_rgba(11,95,255,0.5)] mb-7">
                <Sparkles className="size-7" />
              </div>
              <h3 className="font-bold text-2xl lg:text-[1.75rem] text-ink-900 mb-3 max-w-sm">
                Modern, gentle technology
              </h3>
              <p className="text-[15px] leading-relaxed text-ink-500 max-w-sm mb-8">
                Digital X-rays, intraoral scanning, and laser dentistry mean faster visits with far less
                discomfort — and a clearer picture of your care from day one.
              </p>
              <div className="mt-auto flex flex-wrap gap-2.5">
                {["Digital X-Rays", "3D Scanning", "Laser Dentistry"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white border border-ink-200 px-3.5 py-1.5 text-xs font-semibold text-ink-700 shadow-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Book in under a minute */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="md:col-span-5 group"
        >
          <TiltCard className="h-full rounded-3xl border border-ink-200 bg-white p-7 flex flex-col justify-between min-h-52">
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <CalendarCheck className="size-6" />
              </div>
              <ArrowUpRight className="size-4 text-ink-300 transition-all duration-300 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-ink-900 mb-2">Book in under a minute</h3>
              <p className="text-sm leading-relaxed text-ink-500">
                Real-time availability across every doctor and location — manage your visit anytime online.
              </p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Insurance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
          className="md:col-span-5 group"
        >
          <TiltCard className="h-full rounded-3xl border border-ink-200 bg-white p-7 flex flex-col justify-between min-h-52">
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-warning-50 text-warning-600">
                <ShieldCheck className="size-6" />
              </div>
              <ArrowUpRight className="size-4 text-ink-300 transition-all duration-300 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-ink-900 mb-2">Most insurance accepted</h3>
              <p className="text-sm leading-relaxed text-ink-500">
                Delta Dental, Cigna, MetLife, Aetna, Guardian, and most major PPO plans.
              </p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Personal care — full width strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.26, ease: [0.16, 1, 0.3, 1] as const }}
          className="md:col-span-12 group"
        >
          <TiltCard maxTilt={3} className="rounded-3xl border border-ink-200 bg-ink-900 p-8 lg:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:24px_24px]"
              aria-hidden="true"
            />
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <HeartHandshake className="size-7" />
            </div>
            <div className="relative flex-1">
              <h3 className="font-bold text-xl text-white mb-1.5">Care that feels personal</h3>
              <p className="text-[15px] leading-relaxed text-white/60 max-w-xl">
                Small patient panels per doctor mean real relationships, not rushed six-minute appointments.
              </p>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
