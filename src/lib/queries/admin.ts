import "server-only";
import { prisma } from "@/lib/db";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getOverviewStats() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const lastMonthStart = new Date(monthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const [
    appointmentsThisMonth,
    appointmentsLastMonth,
    revenueAgg,
    revenueLastMonthAgg,
    newPatientsThisMonth,
    newPatientsLastMonth,
    pastAppointments,
    noShowCount,
  ] = await Promise.all([
    prisma.appointment.count({ where: { startsAt: { gte: monthStart, lte: now } } }),
    prisma.appointment.count({ where: { startsAt: { gte: lastMonthStart, lt: monthStart } } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: monthStart, lte: now }, status: "SUCCEEDED" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: lastMonthStart, lt: monthStart }, status: "SUCCEEDED" } }),
    prisma.patient.count({ where: { createdAt: { gte: monthStart, lte: now } } }),
    prisma.patient.count({ where: { createdAt: { gte: lastMonthStart, lt: monthStart } } }),
    prisma.appointment.count({ where: { startsAt: { lt: now }, status: { in: ["COMPLETED", "NO_SHOW"] } } }),
    prisma.appointment.count({ where: { startsAt: { lt: now }, status: "NO_SHOW" } }),
  ]);

  const revenue = revenueAgg._sum.amount ?? 0;
  const revenueLastMonth = revenueLastMonthAgg._sum.amount ?? 0;
  const noShowRate = pastAppointments > 0 ? (noShowCount / pastAppointments) * 100 : 0;

  function pctChange(curr: number, prev: number) {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  }

  return {
    appointmentsThisMonth,
    appointmentsTrend: pctChange(appointmentsThisMonth, appointmentsLastMonth),
    revenue,
    revenueTrend: pctChange(revenue, revenueLastMonth),
    newPatientsThisMonth,
    newPatientsTrend: pctChange(newPatientsThisMonth, newPatientsLastMonth),
    noShowRate: Math.round(noShowRate * 10) / 10,
  };
}

export async function getAppointmentsTrend(days = 30) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const appointments = await prisma.appointment.findMany({
    where: { startsAt: { gte: start, lte: end } },
    select: { startsAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }
  for (const a of appointments) {
    const key = a.startsAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count,
  }));
}

export async function getRevenueTrend(months = 6) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const payments = await prisma.payment.findMany({
    where: { createdAt: { gte: start }, status: "SUCCEEDED" },
    select: { createdAt: true, amount: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    buckets.set(key, 0);
  }
  for (const p of payments) {
    const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + p.amount);
  }

  return Array.from(buckets.entries()).map(([key, total]) => {
    const [year, month] = key.split("-").map(Number);
    return {
      month: new Date(year, month, 1).toLocaleDateString("en-US", { month: "short" }),
      total: Math.round(total),
    };
  });
}

export async function getStatusBreakdown() {
  const grouped = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  return grouped.map((g) => ({ status: g.status, count: g._count.status }));
}

export interface AdminAppointmentFilters {
  date?: string;
  locationId?: string;
  doctorId?: string;
  status?: string;
  search?: string;
}

export async function getAppointmentsForAdmin(filters: AdminAppointmentFilters) {
  const where: import("@/generated/prisma/client").Prisma.AppointmentWhereInput = {};

  if (filters.date) {
    const day = new Date(filters.date);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    where.startsAt = { gte: day, lt: nextDay };
  }
  if (filters.locationId) where.locationId = filters.locationId;
  if (filters.doctorId) where.doctorId = filters.doctorId;
  if (filters.status) where.status = filters.status as never;
  if (filters.search) {
    where.patient = {
      OR: [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
      ],
    };
  }

  return prisma.appointment.findMany({
    where,
    include: { patient: true, doctor: true, location: true, service: true },
    orderBy: { startsAt: "asc" },
    take: 200,
  });
}

export async function getFilterOptions() {
  const [locations, doctors] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ orderBy: { lastName: "asc" } }),
  ]);
  return { locations, doctors };
}

export async function getPatientsForAdmin(search: string, page = 1, pageSize = 20) {
  const where: import("@/generated/prisma/client").Prisma.PatientWhereInput = search
    ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { user: { email: { contains: search } } },
        ],
      }
    : {};

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: {
        user: true,
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.patient.count({ where }),
  ]);

  return { patients, total, pageSize };
}

export async function getPatientDetail(patientId: string) {
  const [patient, appointments, invoices, documents] = await Promise.all([
    prisma.patient.findUnique({ where: { id: patientId }, include: { user: true } }),
    prisma.appointment.findMany({
      where: { patientId },
      include: { doctor: true, location: true, service: true },
      orderBy: { startsAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { patientId },
      include: { items: true, payments: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.document.findMany({ where: { patientId }, orderBy: { uploadedAt: "desc" } }),
  ]);

  return { patient, appointments, invoices, documents };
}

export async function getBillingOverview(status?: string) {
  const where: import("@/generated/prisma/client").Prisma.InvoiceWhereInput = status ? { status: status as never } : {};

  const [invoices, totals] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { patient: true, appointment: { include: { service: true } }, payments: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.invoice.groupBy({ by: ["status"], _sum: { total: true }, _count: { status: true } }),
  ]);

  return { invoices, totals };
}

export async function getAllDocumentsForAdmin(category?: string, search?: string) {
  const where: import("@/generated/prisma/client").Prisma.DocumentWhereInput = {};
  if (category) where.category = category as never;
  if (search) {
    where.patient = {
      OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }],
    };
  }

  return prisma.document.findMany({
    where,
    include: { patient: true },
    orderBy: { uploadedAt: "desc" },
    take: 200,
  });
}

export async function getDoctorUtilization() {
  const doctors = await prisma.doctor.findMany({
    include: { _count: { select: { appointments: true } } },
    orderBy: { lastName: "asc" },
  });
  return doctors.map((d) => ({
    name: `Dr. ${d.lastName}`,
    count: d._count.appointments,
  }));
}
