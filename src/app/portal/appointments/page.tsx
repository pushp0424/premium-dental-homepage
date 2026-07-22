import { getSession } from "@/lib/auth";
import { getPatientAppointments } from "@/lib/queries/patient";
import { AppointmentsListClient } from "@/components/portal/AppointmentsListClient";

export const metadata = { title: "Appointments" };

export default async function PortalAppointmentsPage() {
  const session = await getSession();
  const appointments = await getPatientAppointments(session!.patientId!);

  const serialized = appointments.map((a) => ({
    id: a.id,
    confirmationCode: a.confirmationCode,
    status: a.status,
    startsAt: a.startsAt.toISOString(),
    endsAt: a.endsAt.toISOString(),
    reasonNote: a.reasonNote,
    cancelReason: a.cancelReason,
    serviceId: a.serviceId,
    serviceName: a.service.name,
    servicePrice: a.service.price,
    doctorId: a.doctorId,
    doctorName: `Dr. ${a.doctor.firstName} ${a.doctor.lastName}`,
    locationId: a.locationId,
    locationName: a.location.name,
    locationAddress: `${a.location.addressLine}, ${a.location.city}, ${a.location.state} ${a.location.zip}`,
  }));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Appointments</h1>
        <p className="text-ink-500 mt-1">View, reschedule, or cancel your visits.</p>
      </div>
      <AppointmentsListClient appointments={serialized} />
    </div>
  );
}
