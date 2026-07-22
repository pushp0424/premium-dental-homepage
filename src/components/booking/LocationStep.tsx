"use client";

import { useMemo } from "react";
import { Navigation } from "lucide-react";
import { RadioCard } from "@/components/ui/RadioCard";
import { Button } from "@/components/ui/Button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { haversineDistanceMiles } from "@/lib/geo";
import type { BookingLocation } from "@/lib/types/booking";

export function LocationStep({
  locations,
  value,
  onChange,
}: {
  locations: BookingLocation[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  const { status, coords, locate } = useGeolocation();

  const sorted = useMemo(() => {
    if (!coords) return locations.map((l) => ({ ...l, distance: null as number | null }));
    return [...locations]
      .map((l) => ({ ...l, distance: haversineDistanceMiles(coords, { lat: l.lat, lng: l.lng }) }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [locations, coords]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Choose a location</h2>
          <p className="text-sm text-ink-500 mt-1">Pick whichever Meridian Dental office works best for you.</p>
        </div>
        <Button variant="outline" size="sm" onClick={locate} loading={status === "loading"} className="shrink-0">
          <Navigation className="size-4" />
          Nearest to me
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {sorted.map((loc) => (
          <RadioCard
            key={loc.id}
            selected={value === loc.id}
            onSelect={() => onChange(loc.id)}
            title={loc.name}
            subtitle={`${loc.addressLine}, ${loc.city}`}
            meta={loc.distance !== null ? `${loc.distance < 1 ? "< 1" : loc.distance.toFixed(1)} mi` : undefined}
          />
        ))}
      </div>
    </div>
  );
}
