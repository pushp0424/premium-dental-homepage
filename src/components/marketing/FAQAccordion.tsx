"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/content/marketing";
import { cn } from "@/lib/utils";

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="text-center mb-14">
        <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">FAQ</p>
        <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900">
          Questions? We&apos;ve got answers
        </h2>
      </div>
      <div className="divide-y divide-ink-200 border-y border-ink-200">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
              >
                <span className="font-semibold text-[15.5px] text-ink-900">{faq.q}</span>
                <Plus className={cn("size-5 shrink-0 text-ink-400 transition-transform duration-200", isOpen && "rotate-45")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-[14.5px] leading-relaxed text-ink-500">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
