import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("block text-sm font-semibold text-ink-800 mb-1.5", className)} {...props} />
);

export const FieldError = ({ children }: { children?: string }) => {
  if (!children) return null;
  return (
    <p className="mt-1.5 text-sm text-danger-600" role="alert">
      {children}
    </p>
  );
};

export const FieldHint = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-ink-500">{children}</p>;
};

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full h-11 rounded-xl border bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-1",
        invalid ? "border-danger-500" : "border-ink-200 hover:border-ink-300",
        "disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-28 rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-1",
        invalid ? "border-danger-500" : "border-ink-200 hover:border-ink-300",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full h-11 rounded-xl border bg-white px-3.5 text-[15px] text-ink-900 transition-colors appearance-none",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_0.875rem_center] bg-[length:18px]",
        "focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-1",
        invalid ? "border-danger-500" : "border-ink-200 hover:border-ink-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-4.5 rounded-md border-ink-300 text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2 cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";
