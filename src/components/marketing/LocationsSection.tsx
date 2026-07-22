"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { haversineDistanceMiles } from "@/lib/geo";

export interface LocationCardData {
  id: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  hoursNote: string;
}

export function LocationsSection({ locations }: { locations: LocationCardData[] }) {
  const { status, coords, error, locate } = useGeolocation();
  const [expanded, setExpanded] = useState<string | null>(locations[0]?.id ?? null);

  const sorted = useMemo(() => {
    if (!coords) return locations.map((l) => ({ ...l, distance: null as number | null }));
    return [...locations]
      .map((l) => ({ ...l, distance: haversineDistanceMiles(coords, { lat: l.lat, lng: l.lng }) }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [locations, coords]);

  return (
    <section id="locations" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-sm font-bold text-brand-600 uppercase tracking-wide mb-3">Locations</p>
          <h2 className="text-3xl lg:text-[2.5rem] font-extrabold tracking-tight text-ink-900 max-w-lg">
            Three Austin locations, one standard of care
          </h2>
        </div>
        <Button variant="outline" onClick={locate} loading={status === "loading"} className="shrink-0">
          <Navigation className="size-4.5" />
          {status === "success" ? "Sorted by distance" : "Find nearest to me"}
        </Button>
      </div>

      {error && (
        <p className="mb-6 text-sm text-ink-500 bg-ink-50 border border-ink-200 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {sorted.map((loc, i) => {
          const isOpen = expanded === loc.id;
          return (
            <motion.div
              key={loc.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="rounded-2xl border border-ink-200 bg-white overflow-hidden hover:shadow-lift transition-shadow duration-300"
            >
              <button
                className="w-full aspect-16/10 relative overflow-hidden bg-ink-100"
                onClick={() => setExpanded(loc.id)}
                aria-label={`Preview map for ${loc.name}`}
              >
                {isOpen ? (
                  <iframe
                    title={`Map showing ${loc.name}`}
                    src={`https://www.google.com/maps?q=${loc.lat},${loc.lng}&z=14&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-ink-50 to-ink-100">
                    <MapPin className="size-8 text-ink-300" />
                  </div>
                )}
              </button>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg text-ink-900">{loc.name}</h3>
                  {loc.distance !== null && (
                    <span className="shrink-0 text-xs font-bold text-brand-700 bg-brand-50 rounded-full px-2.5 py-1">
                      {loc.distance < 1 ? "< 1 mi" : `${loc.distance.toFixed(1)} mi`}
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 text-sm text-ink-500">
                  <div className="flex gap-2.5">
                    <MapPin className="size-4 shrink-0 mt-0.5 text-ink-400" />
                    <span>
                      {loc.addressLine}, {loc.city}, {loc.state} {loc.zip}
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    <Phone className="size-4 shrink-0 mt-0.5 text-ink-400" />
                    <a href={`tel:${loc.phone.replace(/[^\d+]/g, "")}`} className="hover:text-brand-600">
                      {loc.phone}
                    </a>
                  </div>
                  <div className="flex gap-2.5">
                    <Clock className="size-4 shrink-0 mt-0.5 text-ink-400" />
                    <span>{loc.hoursNote}</span>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Get Directions <Navigation className="size-3.5" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
      {status === "loading" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
          <Loader2 className="size-4 animate-spin" /> Finding your location…
        </p>
      )}
    </section>
  );
}
