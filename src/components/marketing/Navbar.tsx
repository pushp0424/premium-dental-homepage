"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-ink-200" : "bg-white/0 border-b border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between" aria-label="Primary">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex size-8.5 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-sm">
            M
          </div>
          <span className="font-extrabold text-[17px] tracking-tight text-ink-900">Meridian Dental</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[14.5px] font-medium text-ink-600">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink-900 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-[14.5px] font-semibold text-ink-700 hover:text-ink-900 px-2">
            Patient Login
          </Link>
          <Link href="/booking">
            <Button size="md">Book Appointment</Button>
          </Link>
        </div>

        <button
          className="lg:hidden flex size-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100"
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:hidden overflow-hidden bg-white border-b border-ink-200"
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
    </header>
  );
}
