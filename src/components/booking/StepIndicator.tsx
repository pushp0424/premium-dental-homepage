import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <ol className="flex items-center w-full" aria-label="Booking progress">
      {steps.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
        return (
          <li key={step} className={cn("flex items-center", i !== steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  state === "done" && "bg-brand-600 text-white",
                  state === "current" && "bg-brand-600 text-white ring-4 ring-brand-100",
                  state === "upcoming" && "bg-ink-100 text-ink-400"
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "done" ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden sm:block text-xs font-semibold text-center max-w-20",
                  state === "upcoming" ? "text-ink-400" : "text-ink-800"
                )}
              >
                {step}
              </span>
            </div>
            {i !== steps.length - 1 && (
              <div className={cn("h-0.5 flex-1 mx-2 rounded-full transition-colors", state === "done" ? "bg-brand-600" : "bg-ink-100")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
