import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:bg-brand-800 disabled:bg-ink-300",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-700 disabled:bg-ink-300",
  outline:
    "bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 active:bg-ink-100",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200",
  danger: "bg-danger-500 text-white hover:bg-danger-600 active:bg-red-700 disabled:bg-ink-300",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[15px] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 cursor-pointer disabled:cursor-not-allowed select-none whitespace-nowrap",
          "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
