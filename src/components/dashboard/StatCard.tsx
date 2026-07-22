import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  tone = "brand",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  tone?: "brand" | "success" | "warning" | "accent";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    accent: "bg-accent-50 text-accent-600",
  };

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between mb-4">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="size-5" />
        </span>
        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-bold",
              trend >= 0 ? "text-success-600" : "text-danger-600"
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-ink-900 tracking-tight">{value}</p>
      <p className="text-sm text-ink-500 mt-1">{label}</p>
      {trendLabel && <p className="text-xs text-ink-400 mt-2">{trendLabel}</p>}
    </div>
  );
}
