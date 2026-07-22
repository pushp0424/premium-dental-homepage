"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="grain-overlay relative rounded-[32px] bg-[linear-gradient(135deg,#0A4FD6_0%,#0a40ab_45%,#0F172A_100%)] px-8 py-16 lg:px-16 lg:py-24 text-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div
          className="absolute -top-20 -left-20 size-72 rounded-full bg-accent-400/25 blur-3xl animate-blob-drift"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-16 size-80 rounded-full bg-brand-300/20 blur-3xl animate-blob-drift-slow"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white max-w-xl mx-auto">
            Your best smile starts with one appointment
          </h2>
          <p className="mt-4 text-brand-100 text-lg max-w-md mx-auto">
            Real-time availability, three convenient locations, and a team that actually has time for you.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Magnetic strength={0.25}>
              <Link href="/booking">
                <Button size="lg" variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.35)]">
                  Book Appointment
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href="tel:+15125550142">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10">
                  (512) 555-0142
                </Button>
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
