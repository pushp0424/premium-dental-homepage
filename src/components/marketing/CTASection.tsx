import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
      <div className="relative rounded-[28px] bg-linear-to-br from-brand-600 via-brand-700 to-ink-900 px-8 py-16 lg:px-16 lg:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-white max-w-xl mx-auto">
            Your best smile starts with one appointment
          </h2>
          <p className="mt-4 text-brand-100 text-lg max-w-md mx-auto">
            Real-time availability, three convenient locations, and a team that actually has time for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50">
                Book Appointment
              </Button>
            </Link>
            <a href="tel:+15125550142">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10">
                (512) 555-0142
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
