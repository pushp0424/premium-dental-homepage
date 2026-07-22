"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export interface DoctorCardData {
  id: string;
  firstName: string;
  lastName: string;
  credentials: string;
  specialty: string;
  bio: string;
  photoColor: string;
  yearsExperience: number;
}

export function DoctorsGrid({ doctors }: { doctors: DoctorCardData[] }) {
  return (
    <section id="doctors" className="bg-ink-50 border-y border-ink-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Meet Our Doctors</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900">
            Specialists you can trust with your smile
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="rounded-2xl border border-ink-200 bg-white p-7 hover:shadow-lift transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <Avatar firstName={doc.firstName} lastName={doc.lastName} color={doc.photoColor} size="xl" />
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-ink-900 truncate">
                    Dr. {doc.firstName} {doc.lastName}
                  </h3>
                  <p className="text-sm font-semibold text-brand-600">{doc.credentials}</p>
                </div>
              </div>
              <Badge tone="neutral" className="mb-3">
                {doc.specialty}
              </Badge>
              <p className="text-sm leading-relaxed text-ink-500 mb-2">{doc.bio}</p>
              <p className="text-xs font-semibold text-ink-400 mb-5">{doc.yearsExperience}+ years experience</p>
              <Link
                href={`/booking?doctor=${doc.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Book with Dr. {doc.lastName} →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
