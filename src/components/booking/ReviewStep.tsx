"use client";

import { Pencil, MapPin, Stethoscope, CalendarDays, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { BookingService, BookingLocation, BookingDoctor, PatientSummary } from "@/lib/types/booking";
import type { SelectedSlot } from "./DateTimeStep";
import type { GuestInfo } from "./DetailsStep";

export function ReviewStep({
  service,
  location,
  doctor,
  slot,
  patient,
  guestInfo,
  reasonNote,
  onEditStep,
  onConfirm,
  pending,
  error,
}: {
  service: BookingService;
  location: BookingLocation;
  doctor: BookingDoctor;
  slot: SelectedSlot;
  patient: PatientSummary | null;
  guestInfo: GuestInfo;
  reasonNote: string;
  onEditStep: (step: number) => void;
  onConfirm: () => void;
  pending: boolean;
  error: string | null;
}) {
  const rows = [
    {
      icon: Stethoscope,
      label: "Service",
      value: `${service.name} · ${service.durationMinutes} min`,
      meta: service.price === 0 ? "Free" : formatCurrency(service.price),
      step: 0,
    },
    {
      icon: MapPin,
      label: "Location",
      value: location.name,
      meta: `${location.addressLine}, ${location.city}`,
      step: 1,
    },
    {
      icon: Stethoscope,
      label: "Doctor",
      value: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      meta: doctor.specialty,
      step: 2,
    },
    {
      icon: CalendarDays,
      label: "Date & Time",
      value: formatDate(slot.startsAt),
      meta: formatTime(slot.startsAt),
      step: 3,
    },
  ];

  const contactName = patient ? `${patient.firstName} ${patient.lastName}` : `${guestInfo.firstName} ${guestInfo.lastName}`;
  const contactEmail = patient ? patient.email : guestInfo.email;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Review &amp; confirm</h2>
        <p className="text-sm text-ink-500 mt-1">Double check the details below before booking.</p>
      </div>

      <div className="rounded-2xl border border-ink-200 divide-y divide-ink-100 overflow-hidden">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
              <row.icon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{row.label}</p>
              <p className="font-semibold text-ink-900 truncate">{row.value}</p>
              <p className="text-xs text-ink-500">{row.meta}</p>
            </div>
            <button
              onClick={() => onEditStep(row.step)}
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              <Pencil className="size-3" /> Edit
            </button>
          </div>
        ))}
        <div className="flex items-center gap-4 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
            <Clock className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Contact</p>
            <p className="font-semibold text-ink-900 truncate">{contactName}</p>
            <p className="text-xs text-ink-500 truncate">{contactEmail}</p>
          </div>
          <button
            onClick={() => onEditStep(4)}
            className="shrink-0 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <Pencil className="size-3" /> Edit
          </button>
        </div>
        {reasonNote && (
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1">Note</p>
            <p className="text-sm text-ink-700">{reasonNote}</p>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-brand-50 border border-brand-100 p-4 text-sm text-brand-800">
        <Info className="size-4 shrink-0 mt-0.5" />
        <p>This is a demo booking system. No real appointment will be created and no real payment or SMS/email is sent.</p>
      </div>

      {error && <p className="text-sm font-medium text-danger-600" role="alert">{error}</p>}

      <Button size="lg" className="w-full" onClick={onConfirm} loading={pending}>
        Confirm Booking
      </Button>
    </div>
  );
}
