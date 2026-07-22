"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, MapPin, Stethoscope, CalendarX } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Label, FieldError, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { AppointmentStatusBadge } from "@/components/booking/AppointmentStatusBadge";
import { DateTimeStep, type SelectedSlot } from "@/components/booking/DateTimeStep";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { rescheduleAppointmentAction, cancelAppointmentAction } from "@/app/manage-appointment/actions";

export interface PortalAppointment {
  id: string;
  confirmationCode: string;
  status: string;
  startsAt: string;
  endsAt: string;
  reasonNote: string | null;
  cancelReason: string | null;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  doctorId: string;
  doctorName: string;
  locationId: string;
  locationName: string;
  locationAddress: string;
}

export function AppointmentsListClient({ appointments: initial }: { appointments: PortalAppointment[] }) {
  const { push } = useToast();
  const [appointments, setAppointments] = useState(initial);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [target, setTarget] = useState<PortalAppointment | null>(null);
  const [modal, setModal] = useState<"reschedule" | "cancel" | null>(null);
  const [newSlot, setNewSlot] = useState<SelectedSlot | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const now = new Date();
  const { upcoming, past } = useMemo(() => {
    const up: PortalAppointment[] = [];
    const pa: PortalAppointment[] = [];
    for (const a of appointments) {
      if (new Date(a.startsAt) > now && a.status !== "CANCELLED" && a.status !== "COMPLETED") up.push(a);
      else pa.push(a);
    }
    up.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    pa.sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());
    return { upcoming: up, past: pa };
  }, [appointments]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = tab === "upcoming" ? upcoming : past;

  function openReschedule(a: PortalAppointment) {
    setTarget(a);
    setModal("reschedule");
    setNewSlot(null);
    setError(null);
  }
  function openCancel(a: PortalAppointment) {
    setTarget(a);
    setModal("cancel");
    setCancelReason("");
    setError(null);
  }

  function handleReschedule() {
    if (!target || !newSlot) return;
    setError(null);
    startTransition(async () => {
      const result = await rescheduleAppointmentAction(target.id, newSlot.startsAt);
      if ("error" in result) {
        setError(result.error);
      } else {
        setAppointments((prev) =>
          prev.map((a) => (a.id === target.id ? { ...a, startsAt: newSlot.startsAt, endsAt: newSlot.endsAt, status: "CONFIRMED" } : a))
        );
        setModal(null);
        push({ title: "Appointment rescheduled", tone: "success" });
      }
    });
  }

  function handleCancel() {
    if (!target) return;
    setError(null);
    startTransition(async () => {
      const result = await cancelAppointmentAction(target.id, cancelReason);
      if ("error" in result) {
        setError(result.error);
      } else {
        setAppointments((prev) => prev.map((a) => (a.id === target.id ? { ...a, status: "CANCELLED", cancelReason } : a)));
        setModal(null);
        push({ title: "Appointment cancelled", tone: "success" });
      }
    });
  }

  return (
    <div>
      <Tabs
        tabs={[
          { id: "upcoming", label: "Upcoming", count: upcoming.length },
          { id: "past", label: "Past & Cancelled", count: past.length },
        ]}
        onChange={(id) => setTab(id as "upcoming" | "past")}
      />

      <div className="mt-6 space-y-4">
        {list.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            description={tab === "upcoming" ? "Book your next visit whenever you're ready." : undefined}
          />
        ) : (
          list.map((a) => {
            const canModify = a.status !== "CANCELLED" && a.status !== "COMPLETED" && a.status !== "NO_SHOW";
            return (
              <div key={a.id} className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
                      <CalendarDays className="size-5" />
                    </span>
                    <div>
                      <p className="font-bold text-ink-900">{formatDate(a.startsAt)}</p>
                      <p className="text-sm text-ink-500">
                        {formatTime(a.startsAt)} – {formatTime(a.endsAt)}
                      </p>
                    </div>
                  </div>
                  <AppointmentStatusBadge status={a.status} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex gap-2.5">
                    <Stethoscope className="size-4 text-ink-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-ink-800">{a.serviceName}</p>
                      <p className="text-ink-500">{a.doctorName} · {formatCurrency(a.servicePrice)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <MapPin className="size-4 text-ink-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-ink-800">{a.locationName}</p>
                      <p className="text-ink-500">{a.locationAddress}</p>
                    </div>
                  </div>
                </div>
                {a.cancelReason && <p className="text-sm text-ink-500 mb-3">Cancelled: {a.cancelReason}</p>}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-ink-400">{a.confirmationCode}</span>
                  {canModify && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openReschedule(a)}>
                        Reschedule
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => openCancel(a)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal open={modal === "reschedule"} onClose={() => setModal(null)} title="Reschedule Appointment">
        {target && (
          <>
            <DateTimeStep doctorId={target.doctorId} locationId={target.locationId} serviceId={target.serviceId} value={newSlot} onChange={setNewSlot} />
            {error && <FieldError>{error}</FieldError>}
            <Button className="w-full mt-5" disabled={!newSlot} loading={pending} onClick={handleReschedule}>
              Confirm New Time
            </Button>
          </>
        )}
      </Modal>

      <Modal open={modal === "cancel"} onClose={() => setModal(null)} title="Cancel Appointment">
        <Label htmlFor="cancelReason">Reason for cancelling</Label>
        <Textarea id="cancelReason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
        {error && <FieldError>{error}</FieldError>}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setModal(null)}>
            Keep Appointment
          </Button>
          <Button variant="danger" loading={pending} onClick={handleCancel}>
            Confirm Cancellation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
