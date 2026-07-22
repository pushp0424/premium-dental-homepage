"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAvailableSlots, generateConfirmationCode } from "@/lib/availability";
import { getSession, hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { createBookingSchema, guestPatientSchema } from "@/lib/validations";

export async function getAvailableSlotsAction(
  doctorId: string,
  locationId: string,
  serviceId: string,
  dateISO: string
) {
  const slots = await getAvailableSlots({
    doctorId,
    locationId,
    serviceId,
    date: new Date(dateISO),
  });
  return slots.map((s) => ({ startsAt: s.startsAt.toISOString(), endsAt: s.endsAt.toISOString() }));
}

export type BookingState =
  | { error: string; fieldErrors?: Record<string, string> }
  | undefined;

export async function createBookingAction(_prevState: BookingState, formData: FormData): Promise<BookingState> {
  const parsed = createBookingSchema.safeParse({
    serviceId: formData.get("serviceId"),
    locationId: formData.get("locationId"),
    doctorId: formData.get("doctorId"),
    startsAt: formData.get("startsAt"),
    reasonNote: formData.get("reasonNote") || undefined,
  });
  if (!parsed.success) {
    return { error: "Please complete every step before confirming your booking." };
  }
  const { serviceId, locationId, doctorId, startsAt, reasonNote } = parsed.data;

  const session = await getSession();
  let patientId = session?.patientId;

  if (!patientId) {
    const guestParsed = guestPatientSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      password: formData.get("password"),
    });
    if (!guestParsed.success) {
      return { error: guestParsed.error.issues[0]?.message ?? "Please fill in your contact details." };
    }
    const { firstName, lastName, email, phone, dateOfBirth, password } = guestParsed.data;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return {
        error: "An account with that email already exists. Please log in first, then book your appointment.",
      };
    }

    const passwordHash = await hashPassword(password);
    const avatarColors = ["#0B5FFF", "#1E88E5", "#7C3AED", "#F59E0B", "#0EA5A4", "#EC4899"];
    const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: "PATIENT",
        patient: {
          create: { firstName, lastName, phone, dateOfBirth: new Date(dateOfBirth), avatarColor },
        },
      },
      include: { patient: true },
    });
    patientId = user.patient!.id;

    const token = await createSessionToken({
      userId: user.id,
      role: "PATIENT",
      email: user.email,
      patientId: user.patient!.id,
      firstName: user.patient!.firstName,
      lastName: user.patient!.lastName,
    });
    await setSessionCookie(token);
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return { error: "That service is no longer available. Please start over." };

  const startDate = new Date(startsAt);
  const endDate = new Date(startDate.getTime() + service.durationMinutes * 60000);

  const slots = await getAvailableSlots({ doctorId, locationId, serviceId, date: startDate });
  const stillAvailable = slots.some((s) => s.startsAt.getTime() === startDate.getTime());
  if (!stillAvailable) {
    return { error: "That time slot was just booked by someone else. Please choose another time." };
  }

  let confirmationCode = generateConfirmationCode();
  for (let attempts = 0; attempts < 5; attempts++) {
    const clash = await prisma.appointment.findUnique({ where: { confirmationCode } });
    if (!clash) break;
    confirmationCode = generateConfirmationCode();
  }

  const appointment = await prisma.appointment.create({
    data: {
      confirmationCode,
      patientId,
      doctorId,
      locationId,
      serviceId,
      startsAt: startDate,
      endsAt: endDate,
      status: "CONFIRMED",
      reasonNote,
    },
  });

  const reminderTime = new Date(startDate);
  reminderTime.setDate(reminderTime.getDate() - 1);
  if (reminderTime > new Date()) {
    await prisma.reminder.create({
      data: {
        patientId,
        appointmentId: appointment.id,
        channel: "EMAIL",
        message: `Reminder: your appointment is coming up on ${startDate.toDateString()}.`,
        scheduledFor: reminderTime,
        status: "SCHEDULED",
      },
    });
  }

  redirect(`/booking/confirmation/${confirmationCode}`);
}
