import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildAppointmentICS } from "@/lib/ics";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { confirmationCode: code },
    include: { service: true, doctor: true, location: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const ics = buildAppointmentICS({
    uid: appointment.id,
    title: `${appointment.service.name} — Meridian Dental`,
    description: `Appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} at ${appointment.location.name}. Confirmation code: ${appointment.confirmationCode}`,
    location: `${appointment.location.addressLine}, ${appointment.location.city}, ${appointment.location.state} ${appointment.location.zip}`,
    startsAt: appointment.startsAt,
    endsAt: appointment.endsAt,
  });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="meridian-dental-${appointment.confirmationCode}.ics"`,
    },
  });
}
