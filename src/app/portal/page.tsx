import Link from "next/link";
import { CalendarDays, Receipt, FolderOpen, Stethoscope, MapPin, ArrowRight, PlusCircle } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPatientAppointments, getPatientInvoices, getPatientDocuments } from "@/lib/queries/patient";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { AppointmentStatusBadge } from "@/components/booking/AppointmentStatusBadge";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export const metadata = { title: "My Dashboard" };

export default async function PortalOverviewPage() {
  const session = await getSession();
  const patientId = session!.patientId!;

  const [appointments, invoices, documents] = await Promise.all([
    getPatientAppointments(patientId),
    getPatientInvoices(patientId),
    getPatientDocuments(patientId),
  ]);

  const now = new Date();
  const upcoming = appointments
    .filter((a) => a.startsAt > now && a.status !== "CANCELLED")
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const nextAppointment = upcoming[0];
  const outstandingBalance = invoices
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Welcome back, {session!.firstName}</h1>
          <p className="text-ink-500 mt-1">Here&apos;s what&apos;s happening with your care.</p>
        </div>
        <Link href="/booking">
          <Button size="md">
            <PlusCircle className="size-4.5" /> Book New Appointment
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Upcoming Visits" value={String(upcoming.length)} icon={CalendarDays} tone="brand" />
        <StatCard
          label="Outstanding Balance"
          value={formatCurrency(outstandingBalance)}
          icon={Receipt}
          tone={outstandingBalance > 0 ? "warning" : "success"}
        />
        <StatCard label="Documents on File" value={String(documents.length)} icon={FolderOpen} tone="accent" />
        <StatCard label="Total Visits" value={String(appointments.filter((a) => a.status === "COMPLETED").length)} icon={Stethoscope} tone="brand" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-ink-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
            <h2 className="font-bold text-ink-900">Next Appointment</h2>
            <Link href="/portal/appointments" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {nextAppointment ? (
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xl font-extrabold text-ink-900">{formatDate(nextAppointment.startsAt)}</p>
                  <p className="text-ink-500 mt-0.5">
                    {formatTime(nextAppointment.startsAt)} – {formatTime(nextAppointment.endsAt)}
                  </p>
                </div>
                <AppointmentStatusBadge status={nextAppointment.status} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <Stethoscope className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink-900">{nextAppointment.service.name}</p>
                    <p className="text-sm text-ink-500">
                      Dr. {nextAppointment.doctor.firstName} {nextAppointment.doctor.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink-900">{nextAppointment.location.name}</p>
                    <p className="text-sm text-ink-500">{nextAppointment.location.addressLine}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-ink-100 flex gap-3">
                <Link href={`/manage-appointment?code=${nextAppointment.confirmationCode}`}>
                  <Button variant="outline" size="sm">
                    Reschedule or Cancel
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-ink-500 mb-4">You have no upcoming appointments.</p>
              <Link href="/booking">
                <Button>Book an Appointment</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link href="/portal/billing" className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink-50 transition-colors">
              <span className="text-sm font-semibold text-ink-700">View Billing</span>
              <ArrowRight className="size-4 text-ink-400" />
            </Link>
            <Link href="/portal/documents" className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink-50 transition-colors">
              <span className="text-sm font-semibold text-ink-700">Upload Documents</span>
              <ArrowRight className="size-4 text-ink-400" />
            </Link>
            <Link href="/portal/records" className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink-50 transition-colors">
              <span className="text-sm font-semibold text-ink-700">Visit History</span>
              <ArrowRight className="size-4 text-ink-400" />
            </Link>
            <Link href="/portal/profile" className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-ink-50 transition-colors">
              <span className="text-sm font-semibold text-ink-700">Edit Profile</span>
              <ArrowRight className="size-4 text-ink-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
