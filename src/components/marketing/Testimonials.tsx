"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/content/marketing";

export function Testimonials() {
  return (
    <section id="reviews" className="bg-ink-50 border-y border-ink-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Patient Reviews</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900">
            Don&apos;t just take our word for it
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="rounded-2xl border border-ink-200 bg-white p-7"
            >
              <div className="flex gap-0.5 text-warning-500 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-[15px] leading-relaxed text-ink-700 mb-5">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>
                <p className="font-bold text-ink-900 text-sm">{t.name}</p>
                <p className="text-xs text-ink-500">{t.since}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
