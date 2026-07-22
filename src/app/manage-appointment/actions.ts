"use server";

import { prisma } from "@/lib/db";
import { getAvailableSlots } from "@/lib/availability";
import { getSession } from "@/lib/auth";
import { lookupAppointmentSchema } from "@/lib/validations";

async function assertOwnership(patientId: string) {
  const session = await getSession();
  if (session?.patientId && session.patientId !== patientId) {
    return "You don't have permission to modify this appointment.";
  }
  return null;
}

export interface AppointmentLookupResult {
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
  patientFirstName: string;
}

export async function lookupAppointmentAction(
  code: string,
  email: string
): Promise<{ error: string } | { appointment: AppointmentLookupResult }> {
  const parsed = lookupAppointmentSchema.safeParse({ confirmationCode: code, email });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { confirmationCode: parsed.data.confirmationCode.trim().toUpperCase() },
    include: { service: true, doctor: true, location: true, patient: { include: { user: true } } },
  });

  if (!appointment || appointment.patient.user.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return { error: "We couldn't find a matching appointment. Double check your confirmation code and email." };
  }

  return {
    appointment: {
      id: appointment.id,
      confirmationCode: appointment.confirmationCode,
      status: appointment.status,
      startsAt: appointment.startsAt.toISOString(),
      endsAt: appointment.endsAt.toISOString(),
      reasonNote: appointment.reasonNote,
      cancelReason: appointment.cancelReason,
      serviceId: appointment.serviceId,
      serviceName: appointment.service.name,
      servicePrice: appointment.service.price,
      doctorId: appointment.doctorId,
      doctorName: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      locationId: appointment.locationId,
      locationName: appointment.location.name,
      locationAddress: `${appointment.location.addressLine}, ${appointment.location.city}, ${appointment.location.state} ${appointment.location.zip}`,
      patientFirstName: appointment.patient.firstName,
    },
  };
}

export async function rescheduleAppointmentAction(
  appointmentId: string,
  newStartsAtISO: string
): Promise<{ error: string } | { success: true }> {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId }, include: { service: true } });
  if (!appointment) return { error: "Appointment not found." };
  const ownershipError = await assertOwnership(appointment.patientId);
  if (ownershipError) return { error: ownershipError };
  if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
    return { error: "This appointment can no longer be rescheduled." };
  }

  const newStart = new Date(newStartsAtISO);
  const slots = await getAvailableSlots({
    doctorId: appointment.doctorId,
    locationId: appointment.locationId,
    serviceId: appointment.serviceId,
    date: newStart,
  });
  const isAvailable = slots.some((s) => s.startsAt.getTime() === newStart.getTime());
  if (!isAvailable) return { error: "That time is no longer available. Please choose another." };

  const newEnd = new Date(newStart.getTime() + appointment.service.durationMinutes * 60000);

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { startsAt: newStart, endsAt: newEnd, status: "CONFIRMED" },
  });

  return { success: true };
}

export async function cancelAppointmentAction(
  appointmentId: string,
  cancelReason: string
): Promise<{ error: string } | { success: true }> {
  if (!cancelReason.trim()) return { error: "Please tell us why you're cancelling." };

  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) return { error: "Appointment not found." };
  const ownershipError = await assertOwnership(appointment.patientId);
  if (ownershipError) return { error: ownershipError };
  if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
    return { error: "This appointment can no longer be cancelled." };
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED", cancelReason },
  });

  return { success: true };
}
