"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icon-map";
import { whyChooseUs } from "@/lib/content/marketing";

export function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="text-center max-w-xl mx-auto mb-14">
        <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Why Patients Choose Us</p>
        <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900">
          Care that feels different from the moment you walk in
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {whyChooseUs.map((card, i) => {
          const Icon = getIcon(card.icon);
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="rounded-2xl border border-ink-200 bg-white p-7 hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex size-13 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-5">
                <Icon className="size-6" />
              </div>
              <h3 className="font-bold text-[17px] text-ink-900 mb-2">{card.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-ink-500">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
