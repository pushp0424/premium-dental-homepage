"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Select, Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { AppointmentStatusBadge } from "@/components/booking/AppointmentStatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { formatTime, formatCurrency } from "@/lib/utils";
import { updateAppointmentStatusAction, type AppointmentStatusValue } from "@/app/admin/appointments/actions";

export interface AdminAppointmentRow {
  id: string;
  confirmationCode: string;
  status: string;
  startsAt: string;
  endsAt: string;
  patientFirstName: string;
  patientLastName: string;
  patientId: string;
  patientColor: string;
  doctorName: string;
  locationName: string;
  serviceName: string;
  servicePrice: number;
}

export function AdminAppointmentsTable({
  appointments: initial,
  locations,
  doctors,
  filters,
}: {
  appointments: AdminAppointmentRow[];
  locations: { id: string; name: string }[];
  doctors: { id: string; firstName: string; lastName: string }[];
  filters: { date: string; locationId: string; doctorId: string; status: string; search: string };
}) {
  const { push } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState(initial);
  const [search, setSearch] = useState(filters.search);
  const [cancelTarget, setCancelTarget] = useState<AdminAppointmentRow | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search);
  }

  function setStatus(id: string, status: AppointmentStatusValue, reason?: string) {
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(id, status, reason);
      if ("error" in result) {
        push({ title: "Couldn't update status", description: result.error, tone: "error" });
      } else {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
        push({ title: "Status updated", tone: "success" });
      }
    });
  }

  function confirmCancel() {
    if (!cancelTarget) return;
    if (!cancelReason.trim()) {
      setError("Please provide a reason.");
      return;
    }
    startTransition(async () => {
      const result = await updateAppointmentStatusAction(cancelTarget.id, "CANCELLED", cancelReason);
      if ("error" in result) {
        setError(result.error);
      } else {
        setAppointments((prev) => prev.map((a) => (a.id === cancelTarget.id ? { ...a, status: "CANCELLED" } : a)));
        setCancelTarget(null);
        setCancelReason("");
        push({ title: "Appointment cancelled", tone: "success" });
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Input type="date" value={filters.date} onChange={(e) => updateFilter("date", e.target.value)} className="w-auto" />
        <Select value={filters.locationId} onChange={(e) => updateFilter("locationId", e.target.value)} className="w-auto">
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
        <Select value={filters.doctorId} onChange={(e) => updateFilter("doctorId", e.target.value)} className="w-auto">
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              Dr. {d.firstName} {d.lastName}
            </option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(e) => updateFilter("status", e.target.value)} className="w-auto">
          <option value="">All Statuses</option>
          {["PENDING", "CONFIRMED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW"].map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </Select>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 ml-auto">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient…" className="w-48" />
          <Button type="submit" size="sm" variant="outline">
            <Search className="size-4" />
          </Button>
        </form>
      </div>

      {appointments.length === 0 ? (
        <EmptyState icon={Search} title="No appointments match these filters" />
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Patient</Th>
              <Th>Time</Th>
              <Th>Service</Th>
              <Th>Doctor</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {appointments.map((a) => (
              <Tr key={a.id}>
                <Td>
                  <a href={`/admin/patients/${a.patientId}`} className="flex items-center gap-2.5 hover:text-brand-600">
                    <Avatar firstName={a.patientFirstName} lastName={a.patientLastName} color={a.patientColor} size="sm" />
                    <span className="font-semibold text-ink-900">
                      {a.patientFirstName} {a.patientLastName}
                    </span>
                  </a>
                </Td>
                <Td>
                  {formatTime(a.startsAt)} – {formatTime(a.endsAt)}
                </Td>
                <Td>
                  <div>{a.serviceName}</div>
                  <div className="text-xs text-ink-400">{formatCurrency(a.servicePrice)}</div>
                </Td>
                <Td>{a.doctorName}</Td>
                <Td>{a.locationName}</Td>
                <Td>
                  <AppointmentStatusBadge status={a.status} />
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    {a.status === "PENDING" && (
                      <Button size="sm" variant="outline" disabled={pending} onClick={() => setStatus(a.id, "CONFIRMED")}>
                        Confirm
                      </Button>
                    )}
                    {a.status === "CONFIRMED" && (
                      <Button size="sm" variant="outline" disabled={pending} onClick={() => setStatus(a.id, "CHECKED_IN")}>
                        Check In
                      </Button>
                    )}
                    {a.status === "CHECKED_IN" && (
                      <>
                        <Button size="sm" variant="outline" disabled={pending} onClick={() => setStatus(a.id, "COMPLETED")}>
                          Complete
                        </Button>
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setStatus(a.id, "NO_SHOW")}>
                          No-Show
                        </Button>
                      </>
                    )}
                    {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger-600 hover:bg-danger-50"
                        disabled={pending}
                        onClick={() => {
                          setCancelTarget(a);
                          setCancelReason("");
                          setError(null);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Appointment">
        <Label htmlFor="adminCancelReason">Reason</Label>
        <Textarea id="adminCancelReason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
        {error && <FieldError>{error}</FieldError>}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setCancelTarget(null)}>
            Back
          </Button>
          <Button variant="danger" loading={pending} onClick={confirmCancel}>
            Confirm Cancellation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
