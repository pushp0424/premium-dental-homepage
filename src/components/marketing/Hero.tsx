"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-20 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-16 items-center">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2 bg-ink-50 border border-ink-200 px-3.5 py-1.5 rounded-full text-[13.5px] font-semibold text-brand-700 mb-6"
        >
          <span className="size-1.5 rounded-full bg-success-500" />
          Now accepting new patients
        </motion.div>
        <motion.h1
          variants={item}
          className="text-[2.75rem] leading-[1.06] sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-ink-900"
        >
          Exceptional dental care, designed around you
        </motion.h1>
        <motion.p variants={item} className="mt-5 text-lg leading-relaxed text-ink-500 max-w-md">
          Modern technology, compassionate specialists, and same-day emergency care — trusted by thousands of
          patients across Austin.
        </motion.p>
        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3.5">
          <Link href="/booking">
            <Button size="lg">Book Appointment</Button>
          </Link>
          <a href="tel:+15125550142">
            <Button size="lg" variant="outline">
              <Phone className="size-4.5" />
              Call Now
            </Button>
          </a>
        </motion.div>
        <motion.div variants={item} className="mt-8 flex items-center gap-3">
          <div className="flex gap-0.5 text-warning-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4.5 fill-current" />
            ))}
          </div>
          <span className="font-bold text-ink-900 text-[15px]">4.9</span>
          <span className="text-sm text-ink-500">from 500+ patient reviews</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
      >
        <HeroVisual yearsCount={15} patientsCount="12,000" />
      </motion.div>
    </section>
  );
}
