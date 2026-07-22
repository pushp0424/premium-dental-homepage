import "server-only";
import { prisma } from "@/lib/db";

export async function getPatientById(patientId: string) {
  return prisma.patient.findUnique({ where: { id: patientId }, include: { user: true } });
}

export async function getPatientAppointments(patientId: string) {
  return prisma.appointment.findMany({
    where: { patientId },
    include: { doctor: true, location: true, service: true },
    orderBy: { startsAt: "desc" },
  });
}

export async function getPatientInvoices(patientId: string) {
  return prisma.invoice.findMany({
    where: { patientId },
    include: { items: true, payments: true, appointment: { include: { service: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPatientDocuments(patientId: string) {
  return prisma.document.findMany({ where: { patientId }, orderBy: { uploadedAt: "desc" } });
}

export async function getPatientReminders(patientId: string) {
  return prisma.reminder.findMany({
    where: { patientId },
    include: { appointment: { include: { service: true, doctor: true } } },
    orderBy: { scheduledFor: "desc" },
    take: 20,
  });
}

export async function getUpcomingReminderCount(patientId: string) {
  return prisma.reminder.count({
    where: { patientId, status: "SCHEDULED" },
  });
}
