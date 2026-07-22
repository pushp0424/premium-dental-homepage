import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Services", href: "#services" },
      { label: "Doctors", href: "#doctors" },
      { label: "Locations", href: "#locations" },
      { label: "Reviews", href: "#reviews" },
    ],
  },
  {
    title: "Patients",
    links: [
      { label: "Book Appointment", href: "/booking" },
      { label: "Patient Login", href: "/login" },
      { label: "Manage Appointment", href: "/manage-appointment" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex size-8.5 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-sm">
              M
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-ink-900">Meridian Dental</span>
          </div>
          <p className="text-sm text-ink-500 max-w-xs leading-relaxed mb-5">
            Modern, compassionate dental care across three Austin locations. Same-day emergency visits available.
          </p>
          <div className="flex gap-3">
            {[Globe, Mail, MessageCircle].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                aria-label="Social media link"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-bold text-sm text-ink-900 mb-4">{col.title}</h3>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-500 hover:text-brand-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400">
          <p>© {new Date().getFullYear()} Meridian Dental. All rights reserved.</p>
          <p>Demo product built for illustrative purposes — not a real medical practice.</p>
        </div>
      </div>
    </footer>
  );
}
