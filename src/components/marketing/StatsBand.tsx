"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, Star, Zap } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

const stats = [
  { icon: ShieldCheck, value: 12, suffix: "+", label: "Insurance Plans Accepted" },
  { icon: Clock, value: 15, suffix: "+", label: "Years of Combined Experience" },
  { icon: Star, value: 4.9, decimals: 1, label: "Average Google Rating" },
  { icon: Zap, value: 98, suffix: "%", label: "Same-Day Emergency Availability" },
];

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(155deg,#0F172A_0%,#0D2447_55%,#0A1E3D_100%)] grain-overlay">
      <div
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 left-1/4 size-96 rounded-full bg-brand-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-1/4 size-96 rounded-full bg-accent-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 text-brand-300 mb-4 mx-auto lg:mx-0">
                <stat.icon className="size-5" />
              </div>
              <div className="text-4xl lg:text-5xl font-extrabold text-white tabular-nums tracking-tight">
                <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="mt-2 text-sm text-white/60 max-w-40 mx-auto lg:mx-0">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
