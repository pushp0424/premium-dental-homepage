"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { formatCurrency } from "@/lib/utils";
import { DragCarousel } from "@/components/ui/DragCarousel";
import { TiltCard } from "@/components/ui/TiltCard";

export interface ServiceCardData {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  icon: string;
}

export function ServicesGrid({ services }: { services: ServiceCardData[] }) {
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Services</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900 max-w-lg">
            Comprehensive care, all under one roof
          </h2>
        </motion.div>
        <Link href="/booking" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 shrink-0">
          View all services & book <ArrowRight className="size-4" />
        </Link>
      </div>

      <DragCarousel itemCount={services.length}>
        {services.map((svc, i) => {
          const Icon = getIcon(svc.icon);
          return (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] as const }}
              className="shrink-0 w-72 sm:w-80 group select-none"
            >
              <TiltCard maxTilt={5} className="h-full rounded-3xl border border-ink-200 bg-white overflow-hidden hover:shadow-lift transition-shadow duration-300">
                <div className="aspect-4/3 bg-linear-to-br from-brand-50 via-white to-ink-50 border-b border-ink-200 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute -top-8 -right-8 size-32 rounded-full bg-brand-200/40 blur-2xl transition-transform duration-500 group-hover:scale-125"
                    aria-hidden="true"
                  />
                  <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white shadow-soft text-brand-600 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="size-7" />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-2">{svc.category}</p>
                  <h3 className="font-bold text-lg text-ink-900 mb-2">{svc.name}</h3>
                  <p className="text-sm leading-relaxed text-ink-500 mb-4 line-clamp-2">{svc.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink-900">
                      {svc.price === 0 ? "Free consult" : `From ${formatCurrency(svc.price)}`}
                    </span>
                    <Link
                      href={`/booking?service=${svc.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-1.5 transition-all"
                    >
                      Book <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </DragCarousel>
    </section>
  );
}
