"use client";

import { useState, useTransition } from "react";
import { Search, CalendarDays, MapPin, Stethoscope, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { DateTimeStep, type SelectedSlot } from "./DateTimeStep";
import {
  lookupAppointmentAction,
  rescheduleAppointmentAction,
  cancelAppointmentAction,
  type AppointmentLookupResult,
} from "@/app/manage-appointment/actions";

export function ManageAppointmentClient({ initialCode }: { initialCode: string }) {
  const { push } = useToast();
  const [code, setCode] = useState(initialCode);
  const [email, setEmail] = useState("");
  const [appointment, setAppointment] = useState<AppointmentLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupPending, startLookup] = useTransition();

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<SelectedSlot | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionPending, startAction] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  function handleLookup() {
    setLookupError(null);
    startLookup(async () => {
      const result = await lookupAppointmentAction(code, email);
      if ("error" in result) setLookupError(result.error);
      else setAppointment(result.appointment);
    });
  }

  function handleReschedule() {
    if (!appointment || !newSlot) return;
    setActionError(null);
    startAction(async () => {
      const result = await rescheduleAppointmentAction(appointment.id, newSlot.startsAt);
      if ("error" in result) {
        setActionError(result.error);
      } else {
        setAppointment({ ...appointment, startsAt: newSlot.startsAt, endsAt: newSlot.endsAt, status: "CONFIRMED" });
        setRescheduleOpen(false);
        setNewSlot(null);
        push({ title: "Appointment rescheduled", tone: "success" });
      }
    });
  }

  function handleCancel() {
    if (!appointment) return;
    setActionError(null);
    startAction(async () => {
      const result = await cancelAppointmentAction(appointment.id, cancelReason);
      if ("error" in result) {
        setActionError(result.error);
      } else {
        setAppointment({ ...appointment, status: "CANCELLED", cancelReason });
        setCancelOpen(false);
        push({ title: "Appointment cancelled", tone: "success" });
      }
    });
  }

  const canModify = appointment && !["CANCELLED", "COMPLETED", "NO_SHOW"].includes(appointment.status);

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Manage Your Appointment</h1>
        <p className="mt-2 text-ink-500">Enter your confirmation code and email to reschedule or cancel.</p>
      </div>

      <div className="rounded-3xl border border-ink-200 bg-white p-6 sm:p-8 shadow-card">
        {!appointment ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Confirmation code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="MD-XXXXXX" />
            </div>
            <div>
              <Label htmlFor="lookupEmail">Email address</Label>
              <Input id="lookupEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            {lookupError && <FieldError>{lookupError}</FieldError>}
            <Button size="lg" className="w-full" onClick={handleLookup} loading={lookupPending}>
              <Search className="size-4.5" /> Find My Appointment
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono font-bold text-brand-700">{appointment.confirmationCode}</span>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <CalendarDays className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">{formatDate(appointment.startsAt)}</p>
                  <p className="text-sm text-ink-500">
                    {formatTime(appointment.startsAt)} – {formatTime(appointment.endsAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Stethoscope className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">
                    {appointment.serviceName} with {appointment.doctorName}
                  </p>
                  <p className="text-sm text-ink-500">
                    {appointment.servicePrice === 0 ? "Free consultation" : formatCurrency(appointment.servicePrice)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">{appointment.locationName}</p>
                  <p className="text-sm text-ink-500">{appointment.locationAddress}</p>
                </div>
              </div>
              {appointment.status === "CANCELLED" && appointment.cancelReason && (
                <div className="flex gap-3">
                  <XCircle className="size-4.5 text-danger-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-ink-500">Cancelled: {appointment.cancelReason}</p>
                </div>
              )}
            </div>

            {canModify && (
              <div className="grid sm:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setRescheduleOpen(true)}>
                  Reschedule
                </Button>
                <Button variant="danger" onClick={() => setCancelOpen(true)}>
                  Cancel Appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {appointment && (
        <Modal
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          title="Reschedule Appointment"
          description="Choose a new date and time for your visit."
        >
          <DateTimeStep
            doctorId={appointment.doctorId}
            locationId={appointment.locationId}
            serviceId={appointment.serviceId}
            value={newSlot}
            onChange={setNewSlot}
          />
          {actionError && <FieldError>{actionError}</FieldError>}
          <Button className="w-full mt-5" disabled={!newSlot} loading={actionPending} onClick={handleReschedule}>
            Confirm New Time
          </Button>
        </Modal>
      )}

      {appointment && (
        <Modal
          open={cancelOpen}
          onClose={() => setCancelOpen(false)}
          title="Cancel Appointment"
          description="We're sorry to see this one go — let us know why so we can improve."
        >
          <Label htmlFor="cancelReason">Reason for cancelling</Label>
          <Textarea id="cancelReason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
          {actionError && <FieldError>{actionError}</FieldError>}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="danger" loading={actionPending} onClick={handleCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
