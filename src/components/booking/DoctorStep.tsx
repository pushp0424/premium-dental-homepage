"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { UserRoundX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingDoctor } from "@/lib/types/booking";

export function DoctorStep({
  doctors,
  locationId,
  value,
  onChange,
}: {
  doctors: BookingDoctor[];
  locationId: string | null;
  value: string | null;
  onChange: (id: string) => void;
}) {
  const available = doctors.filter((d) => !locationId || d.locationIds.includes(locationId));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Choose your doctor</h2>
        <p className="text-sm text-ink-500 mt-1">All doctors at this location, filtered to who&apos;s available there.</p>
      </div>
      {available.length === 0 ? (
        <EmptyState icon={UserRoundX} title="No doctors at this location" description="Try choosing a different location in the previous step." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {available.map((doc) => {
            const selected = value === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(doc.id)}
                className={cn(
                  "flex items-start gap-4 rounded-2xl border p-4 text-left transition-all",
                  selected ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500" : "border-ink-200 hover:border-ink-300 hover:bg-ink-50"
                )}
              >
                <Avatar firstName={doc.firstName} lastName={doc.lastName} color={doc.photoColor} size="lg" />
                <div className="min-w-0">
                  <p className="font-bold text-ink-900 truncate">
                    Dr. {doc.firstName} {doc.lastName}
                  </p>
                  <p className="text-xs font-semibold text-brand-600 mb-1.5">{doc.credentials} · {doc.specialty}</p>
                  <p className="text-xs text-ink-500 line-clamp-2">{doc.bio}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
