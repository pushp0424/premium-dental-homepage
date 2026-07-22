import { getAppointmentsForAdmin, getFilterOptions } from "@/lib/queries/admin";
import { AdminAppointmentsTable } from "@/components/admin/AdminAppointmentsTable";

export const metadata = { title: "Appointments" };
export const dynamic = "force-dynamic";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; locationId?: string; doctorId?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const filters = {
    date: params.date ?? todayISO(),
    locationId: params.locationId ?? "",
    doctorId: params.doctorId ?? "",
    status: params.status ?? "",
    search: params.search ?? "",
  };

  const [appointments, { locations, doctors }] = await Promise.all([
    getAppointmentsForAdmin(filters),
    getFilterOptions(),
  ]);

  const rows = appointments.map((a) => ({
    id: a.id,
    confirmationCode: a.confirmationCode,
    status: a.status,
    startsAt: a.startsAt.toISOString(),
    endsAt: a.endsAt.toISOString(),
    patientFirstName: a.patient.firstName,
    patientLastName: a.patient.lastName,
    patientId: a.patientId,
    patientColor: a.patient.avatarColor,
    doctorName: `Dr. ${a.doctor.firstName} ${a.doctor.lastName}`,
    locationName: a.location.name,
    serviceName: a.service.name,
    servicePrice: a.service.price,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Appointments</h1>
        <p className="text-ink-500 mt-1">Manage the day-to-day schedule across every location.</p>
      </div>
      <AdminAppointmentsTable appointments={rows} locations={locations} doctors={doctors} filters={filters} />
    </div>
  );
}
