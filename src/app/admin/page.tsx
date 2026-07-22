import { CalendarDays, DollarSign, UserPlus, AlertTriangle } from "lucide-react";
import { getOverviewStats, getAppointmentsTrend, getRevenueTrend, getStatusBreakdown, getDoctorUtilization } from "@/lib/queries/admin";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentsTrendChart } from "@/components/charts/AppointmentsTrendChart";
import { RevenueTrendChart } from "@/components/charts/RevenueTrendChart";
import { StatusBreakdownChart } from "@/components/charts/StatusBreakdownChart";
import { DoctorUtilizationChart } from "@/components/charts/DoctorUtilizationChart";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, appointmentsTrend, revenueTrend, statusBreakdown, doctorUtilization] = await Promise.all([
    getOverviewStats(),
    getAppointmentsTrend(30),
    getRevenueTrend(6),
    getStatusBreakdown(),
    getDoctorUtilization(),
  ]);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Practice Overview</h1>
        <p className="text-ink-500 mt-1">Performance across all locations this month.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Appointments This Month"
          value={String(stats.appointmentsThisMonth)}
          icon={CalendarDays}
          trend={stats.appointmentsTrend}
          tone="brand"
        />
        <StatCard
          label="Revenue This Month"
          value={formatCurrency(stats.revenue)}
          icon={DollarSign}
          trend={stats.revenueTrend}
          tone="success"
        />
        <StatCard
          label="New Patients"
          value={String(stats.newPatientsThisMonth)}
          icon={UserPlus}
          trend={stats.newPatientsTrend}
          tone="accent"
        />
        <StatCard label="No-Show Rate" value={`${stats.noShowRate}%`} icon={AlertTriangle} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-1">Appointments — Last 30 Days</h2>
          <p className="text-sm text-ink-500 mb-4">Booked appointments per day across all locations.</p>
          <AppointmentsTrendChart data={appointmentsTrend} />
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-1">Revenue — Last 6 Months</h2>
          <p className="text-sm text-ink-500 mb-4">Collected payments by month.</p>
          <RevenueTrendChart data={revenueTrend} />
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-1">Appointment Status Breakdown</h2>
          <p className="text-sm text-ink-500 mb-4">All-time distribution across statuses.</p>
          <StatusBreakdownChart data={statusBreakdown} />
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-1">Doctor Utilization</h2>
          <p className="text-sm text-ink-500 mb-4">Total appointments handled per doctor.</p>
          <DoctorUtilizationChart data={doctorUtilization} />
        </div>
      </div>
    </div>
  );
}
