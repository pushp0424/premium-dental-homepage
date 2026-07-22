"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { LocationStep } from "@/components/booking/LocationStep";
import { DoctorStep } from "@/components/booking/DoctorStep";
import { DateTimeStep, type SelectedSlot } from "@/components/booking/DateTimeStep";
import { DetailsStep, type GuestInfo } from "@/components/booking/DetailsStep";
import { ReviewStep } from "@/components/booking/ReviewStep";
import { createBookingAction } from "@/app/booking/actions";
import type { BookingService, BookingLocation, BookingDoctor, PatientSummary } from "@/lib/types/booking";

const STEP_LABELS = ["Service", "Location", "Doctor", "Date & Time", "Your Info", "Review"];

export function BookingWizard({
  services,
  locations,
  doctors,
  patient,
  preselect,
}: {
  services: BookingService[];
  locations: BookingLocation[];
  doctors: BookingDoctor[];
  patient: PatientSummary | null;
  preselect: { serviceId?: string; locationId?: string; doctorId?: string };
}) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string | null>(
    services.find((s) => s.id === preselect.serviceId)?.id ?? null
  );
  const [locationId, setLocationId] = useState<string | null>(
    locations.find((l) => l.id === preselect.locationId)?.id ?? null
  );
  const [doctorId, setDoctorId] = useState<string | null>(
    doctors.find((d) => d.id === preselect.doctorId)?.id ?? null
  );
  const [slot, setSlot] = useState<SelectedSlot | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
  });
  const [reasonNote, setReasonNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? null, [services, serviceId]);
  const location = useMemo(() => locations.find((l) => l.id === locationId) ?? null, [locations, locationId]);
  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId) ?? null, [doctors, doctorId]);

  const canContinue = [
    !!serviceId,
    !!locationId,
    !!doctorId,
    !!slot,
    patient || (guestInfo.firstName && guestInfo.lastName && guestInfo.email && guestInfo.phone && guestInfo.dateOfBirth && guestInfo.password.length >= 8),
  ][step];

  function goNext() {
    if (step === 1 && doctorId && location && !doctor?.locationIds.includes(location.id)) {
      setDoctorId(null);
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleConfirm() {
    if (!service || !location || !doctor || !slot) return;
    setError(null);
    const fd = new FormData();
    fd.set("serviceId", service.id);
    fd.set("locationId", location.id);
    fd.set("doctorId", doctor.id);
    fd.set("startsAt", slot.startsAt);
    fd.set("reasonNote", reasonNote);
    if (!patient) {
      fd.set("firstName", guestInfo.firstName);
      fd.set("lastName", guestInfo.lastName);
      fd.set("email", guestInfo.email);
      fd.set("phone", guestInfo.phone);
      fd.set("dateOfBirth", guestInfo.dateOfBirth);
      fd.set("password", guestInfo.password);
    }
    startTransition(async () => {
      const result = await createBookingAction(undefined, fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-10 py-12">
      <div className="mb-10">
        <StepIndicator steps={STEP_LABELS} currentIndex={step} />
      </div>

      <div className="rounded-3xl border border-ink-200 bg-white p-6 sm:p-8 shadow-card">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16, position: "absolute" }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {step === 0 && <ServiceStep services={services} value={serviceId} onChange={setServiceId} />}
            {step === 1 && <LocationStep locations={locations} value={locationId} onChange={setLocationId} />}
            {step === 2 && <DoctorStep doctors={doctors} locationId={locationId} value={doctorId} onChange={setDoctorId} />}
            {step === 3 && (
              <DateTimeStep doctorId={doctorId} locationId={locationId} serviceId={serviceId} value={slot} onChange={setSlot} />
            )}
            {step === 4 && (
              <DetailsStep
                patient={patient}
                guestInfo={guestInfo}
                onGuestInfoChange={setGuestInfo}
                reasonNote={reasonNote}
                onReasonNoteChange={setReasonNote}
              />
            )}
            {step === 5 && service && location && doctor && slot && (
              <ReviewStep
                service={service}
                location={location}
                doctor={doctor}
                slot={slot}
                patient={patient}
                guestInfo={guestInfo}
                reasonNote={reasonNote}
                onEditStep={setStep}
                onConfirm={handleConfirm}
                pending={pending}
                error={error}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {step < 5 && (
          <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
            <Button variant="ghost" onClick={goBack} disabled={step === 0} className={step === 0 ? "invisible" : ""}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            <Button onClick={goNext} disabled={!canContinue}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
