"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CalendarX2, Loader2 } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { getAvailableSlotsAction } from "@/app/booking/actions";
import { EmptyState } from "@/components/ui/EmptyState";

export interface SelectedSlot {
  startsAt: string;
  endsAt: string;
}

function buildDays(count: number) {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export function DateTimeStep({
  doctorId,
  locationId,
  serviceId,
  value,
  onChange,
}: {
  doctorId: string | null;
  locationId: string | null;
  serviceId: string | null;
  value: SelectedSlot | null;
  onChange: (slot: SelectedSlot) => void;
}) {
  const days = useMemo(() => buildDays(28), []);
  const [selectedDate, setSelectedDate] = useState<Date>(days[0]);
  const [slots, setSlots] = useState<SelectedSlot[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!doctorId || !locationId || !serviceId) return;
    startTransition(async () => {
      const result = await getAvailableSlotsAction(doctorId, locationId, serviceId, selectedDate.toISOString());
      setSlots(result);
    });
  }, [doctorId, locationId, serviceId, selectedDate]);

  const groupedByPeriod = useMemo(() => {
    const groups: { label: string; items: SelectedSlot[] }[] = [
      { label: "Morning", items: [] },
      { label: "Afternoon", items: [] },
      { label: "Evening", items: [] },
    ];
    for (const slot of slots) {
      const hour = new Date(slot.startsAt).getHours();
      if (hour < 12) groups[0].items.push(slot);
      else if (hour < 17) groups[1].items.push(slot);
      else groups[2].items.push(slot);
    }
    return groups.filter((g) => g.items.length > 0);
  }, [slots]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Pick a date &amp; time</h2>
        <p className="text-sm text-ink-500 mt-1">Availability updates in real time based on the doctor&apos;s schedule.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-1 px-1" role="tablist" aria-label="Select date">
        {days.map((day) => {
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <button
              key={day.toISOString()}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center justify-center shrink-0 w-16 h-18 rounded-2xl border transition-colors",
                isSelected
                  ? "bg-brand-600 border-brand-600 text-white"
                  : "border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50"
              )}
            >
              <span className={cn("text-[11px] font-semibold uppercase", isSelected ? "text-brand-100" : "text-ink-400")}>
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-lg font-bold">{day.getDate()}</span>
              {isToday && (
                <span className={cn("text-[9px] font-bold uppercase", isSelected ? "text-brand-100" : "text-brand-600")}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-40">
        {pending ? (
          <div className="flex items-center justify-center gap-2 py-16 text-ink-500 text-sm">
            <Loader2 className="size-4 animate-spin" /> Loading availability…
          </div>
        ) : groupedByPeriod.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No openings this day"
            description="Try another date on the strip above — this doctor is fully booked or off on this day."
          />
        ) : (
          <div className="space-y-5">
            {groupedByPeriod.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-2.5">{group.label}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {group.items.map((slot) => {
                    const selected = value?.startsAt === slot.startsAt;
                    return (
                      <button
                        key={slot.startsAt}
                        onClick={() => onChange(slot)}
                        className={cn(
                          "rounded-xl border py-2.5 text-sm font-semibold transition-colors",
                          selected
                            ? "bg-brand-600 border-brand-600 text-white"
                            : "border-ink-200 text-ink-800 hover:border-brand-300 hover:bg-brand-50"
                        )}
                      >
                        {formatTime(slot.startsAt)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
