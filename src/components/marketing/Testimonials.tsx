"use client";

import { Star } from "lucide-react";
import { testimonials } from "@/lib/content/marketing";

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...testimonials, ...testimonials];
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex gap-6 shrink-0 pr-6 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
      >
        {items.map((t, i) => (
          <figure key={i} className="w-88 sm:w-96 shrink-0 rounded-2xl border border-ink-200 bg-white p-6">
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
          </figure>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="bg-ink-50 border-y border-ink-200 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Patient Reviews</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900">
            Don&apos;t just take our word for it
          </h2>
        </div>
      </div>
      <div className="space-y-6">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
