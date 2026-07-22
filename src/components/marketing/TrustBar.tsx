import { ShieldCheck, Clock, Star, Zap } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Most Insurance Accepted" },
  { icon: Clock, label: "15+ Years of Experience" },
  { icon: Star, label: "4.9★ Google Rating" },
  { icon: Zap, label: "Same-Day Emergency Care" },
];

export function TrustBar() {
  return (
    <div className="bg-ink-50 border-y border-ink-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center lg:justify-start gap-2.5">
            <Icon className="size-4.5 text-brand-600 shrink-0" />
            <span className="text-sm font-bold text-ink-800 text-center lg:text-left">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
