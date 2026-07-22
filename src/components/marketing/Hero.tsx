"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { CountUp } from "@/components/ui/CountUp";
import { HeroVisual } from "./HeroVisual";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" aria-hidden="true" />
      <div
        className="absolute -top-40 -left-32 size-100 rounded-full bg-brand-400/25 blur-3xl animate-blob-drift"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 -right-24 size-88 rounded-full bg-accent-400/20 blur-3xl animate-blob-drift-slow"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,#0F172A_1px,transparent_0)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-20 lg:pt-44 lg:pb-28 grid lg:grid-cols-12 gap-16 items-center">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-7">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-ink-200/70 px-3.5 py-1.5 rounded-full text-[13.5px] font-semibold text-brand-700 mb-7 shadow-soft"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full size-1.5 bg-success-500" />
            </span>
            Now accepting new patients
          </motion.div>

          <motion.h1
            variants={item}
            className="text-[3.4rem] leading-[0.98] sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-ink-900"
          >
            Dental care
            <br />
            <span className="text-gradient-brand">worth smiling</span>
            <br />
            about.
          </motion.h1>

          <motion.p variants={item} className="mt-7 text-lg sm:text-xl leading-relaxed text-ink-500 max-w-lg">
            Modern technology, compassionate specialists, and same-day emergency care —
            trusted by thousands of patients across Austin.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3.5">
            <Magnetic strength={0.25}>
              <Link href="/booking">
                <Button size="lg" className="shadow-[0_16px_32px_-8px_rgba(11,95,255,0.45)]">
                  Book Appointment
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href="tel:+15125550142">
                <Button size="lg" variant="outline" className="bg-white/70 backdrop-blur-sm">
                  <Phone className="size-4.5" />
                  Call Now
                </Button>
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={item} className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5 text-warning-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-ink-900 text-[15px]">4.9</span>
              <span className="text-sm text-ink-500">500+ reviews</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-ink-200" />
            <div className="flex items-center gap-8">
              <div>
                <div className="text-2xl font-extrabold text-ink-900 tabular-nums">
                  <CountUp value={15} suffix="+" />
                </div>
                <div className="text-xs font-medium text-ink-500">Years</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink-900 tabular-nums">
                  <CountUp value={12000} suffix="+" />
                </div>
                <div className="text-xs font-medium text-ink-500">Patients</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-ink-900 tabular-nums">
                  <CountUp value={3} />
                </div>
                <div className="text-xs font-medium text-ink-500">Locations</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="lg:col-span-5"
        >
          <HeroVisual yearsCount={15} patientsCount="12,000" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="relative hidden sm:flex justify-center pb-8"
      >
        <div className="flex flex-col items-center gap-1 text-ink-400 animate-bounce-y">
          <span className="text-[11px] font-semibold uppercase tracking-widest">Scroll</span>
          <ChevronDown className="size-4" />
        </div>
      </motion.div>
    </section>
  );
}
