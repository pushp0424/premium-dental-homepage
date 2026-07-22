import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral" | "accent";

const toneStyles: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-600/20",
  success: "bg-success-50 text-success-600 ring-success-500/20",
  warning: "bg-warning-50 text-warning-600 ring-warning-500/20",
  danger: "bg-danger-50 text-danger-600 ring-danger-500/20",
  neutral: "bg-ink-100 text-ink-600 ring-ink-500/10",
  accent: "bg-accent-50 text-accent-600 ring-accent-500/20",
};

export function Badge({
  className,
  tone = "neutral",
  dot,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            tone === "brand" && "bg-brand-500",
            tone === "success" && "bg-success-500",
            tone === "warning" && "bg-warning-500",
            tone === "danger" && "bg-danger-500",
            tone === "neutral" && "bg-ink-400",
            tone === "accent" && "bg-accent-500"
          )}
        />
      )}
      {props.children}
    </span>
  );
}
