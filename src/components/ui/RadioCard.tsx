import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function RadioCard({
  selected,
  onSelect,
  title,
  subtitle,
  meta,
  icon,
  disabled,
  className,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500"
          : "border-ink-200 hover:border-ink-300 hover:bg-ink-50",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "hidden sm:flex size-11 shrink-0 items-center justify-center rounded-xl",
            selected ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-500"
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-ink-900 leading-snug">{title}</span>
        {subtitle && <span className="block text-sm text-ink-500 mt-0.5">{subtitle}</span>}
        {meta && <span className="block sm:hidden text-sm font-semibold text-ink-600 mt-1">{meta}</span>}
      </span>
      {meta && <span className="hidden sm:block shrink-0 text-sm font-semibold text-ink-600 mt-0.5">{meta}</span>}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-0.5",
          selected ? "border-brand-600 bg-brand-600" : "border-ink-300 group-hover:border-ink-400"
        )}
      >
        {selected && <Check className="size-3 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}
