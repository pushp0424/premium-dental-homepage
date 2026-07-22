"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className,
}: {
  tabs: { id: string; label: string; count?: number }[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-1 border-b border-ink-200 overflow-x-auto scrollbar-thin", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => select(tab.id)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
            active === tab.id ? "text-brand-600" : "text-ink-500 hover:text-ink-800"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-bold",
                active === tab.id ? "bg-brand-50 text-brand-600" : "bg-ink-100 text-ink-500"
              )}
            >
              {tab.count}
            </span>
          )}
          {active === tab.id && (
            <span className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand-600" />
          )}
        </button>
      ))}
    </div>
  );
}
