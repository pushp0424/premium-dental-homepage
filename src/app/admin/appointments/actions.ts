"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type AppointmentStatusValue = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AppointmentStatusValue,
  cancelReason?: string
): Promise<{ error: string } | { success: true }> {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) return { error: "Appointment not found." };

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status,
      cancelReason: status === "CANCELLED" ? cancelReason ?? "Cancelled by staff" : appointment.cancelReason,
    },
  });

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  return { success: true };
}
