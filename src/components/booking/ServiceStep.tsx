"use client";

import { useMemo } from "react";
import { RadioCard } from "@/components/ui/RadioCard";
import { getIcon } from "@/lib/icon-map";
import { formatCurrency } from "@/lib/utils";
import type { BookingService } from "@/lib/types/booking";

export function ServiceStep({
  services,
  value,
  onChange,
}: {
  services: BookingService[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, BookingService[]>();
    for (const s of services) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return Array.from(map.entries());
  }, [services]);

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-ink-900">What brings you in?</h2>
        <p className="text-sm text-ink-500 mt-1">Choose the service you&apos;d like to book.</p>
      </div>
      <div className="space-y-6">
        {grouped.map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-3">{category}</p>
            <div className="grid gap-3">
              {items.map((svc) => {
                const Icon = getIcon(svc.icon);
                return (
                  <RadioCard
                    key={svc.id}
                    selected={value === svc.id}
                    onSelect={() => onChange(svc.id)}
                    title={svc.name}
                    subtitle={`${svc.durationMinutes} min`}
                    meta={svc.price === 0 ? "Free" : formatCurrency(svc.price)}
                    icon={<Icon className="size-5" />}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
