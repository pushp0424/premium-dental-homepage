"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

const links = [
  { href: "#services", label: "Services" },
  { href: "#doctors", label: "Doctors" },
  { href: "#locations", label: "Locations" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastY.current;
    if (latest < 80) {
      setHidden(false);
    } else if (diff > 4) {
      setHidden(true);
      setOpen(false);
    } else if (diff < -4) {
      setHidden(false);
    }
    lastY.current = latest;
  });

  return (
    <motion.header
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "w-full max-w-6xl flex items-center justify-between gap-6 rounded-2xl border px-5 sm:px-6 h-16 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-ink-200/70 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)]"
            : "bg-white/90 backdrop-blur-xl border-white/60 shadow-[0_8px_30px_-16px_rgba(15,23,42,0.15)]"
        )}
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex size-8.5 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-sm shadow-[0_4px_14px_-2px_rgba(11,95,255,0.5)]">
            M
          </div>
          <span className="font-extrabold text-[17px] tracking-tight text-ink-900">Meridian Dental</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 text-[14.5px] font-medium text-ink-600">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-3.5 py-2 rounded-full hover:text-ink-900 hover:bg-ink-900/[0.04] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-[14.5px] font-semibold text-ink-700 hover:text-ink-900 px-2">
            Patient Login
          </Link>
          <Magnetic strength={0.3}>
            <Link href="/booking">
              <Button size="md">Book Appointment</Button>
            </Link>
          </Magnetic>
        </div>

        <button
          className="lg:hidden flex size-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-900/5"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5.5" /> : <Menu className="size-5.5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:hidden absolute top-[calc(100%+8px)] left-4 right-4 rounded-2xl border border-ink-200 bg-white/95 backdrop-blur-xl shadow-lift overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[15px] font-medium text-ink-700"
                >
                  {l.label}
                </a>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="py-2.5 text-[15px] font-semibold text-ink-900">
                Patient Login
              </Link>
              <Link href="/booking" onClick={() => setOpen(false)} className="mt-2">
                <Button size="md" className="w-full">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
