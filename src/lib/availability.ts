import "server-only";
import { prisma } from "@/lib/db";

const SLOT_GRANULARITY_MINUTES = 30;
const MIN_LEAD_TIME_MINUTES = 90;

export interface TimeSlot {
  startsAt: Date;
  endsAt: Date;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getAvailableSlots({
  doctorId,
  locationId,
  serviceId,
  date,
}: {
  doctorId: string;
  locationId: string;
  serviceId: string;
  date: Date;
}): Promise<TimeSlot[]> {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) return [];

  const dayStart = startOfDay(date);
  const dayOfWeek = dayStart.getDay();
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const workingHours = await prisma.workingHour.findMany({
    where: { doctorId, locationId, dayOfWeek },
  });
  if (workingHours.length === 0) return [];

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      startsAt: { gte: dayStart, lt: dayEnd },
      status: { notIn: ["CANCELLED"] },
    },
    select: { startsAt: true, endsAt: true },
  });

  const now = new Date();
  const earliestStart = new Date(now.getTime() + MIN_LEAD_TIME_MINUTES * 60000);

  const slots: TimeSlot[] = [];

  for (const block of workingHours) {
    let pointer = block.startMinute;
    while (pointer + service.durationMinutes <= block.endMinute) {
      const start = new Date(dayStart);
      start.setMinutes(pointer);
      const end = new Date(start.getTime() + service.durationMinutes * 60000);

      const overlaps = existingAppointments.some(
        (a) => start < a.endsAt && end > a.startsAt
      );
      const isFarEnoughAhead = start >= earliestStart;

      if (!overlaps && isFarEnoughAhead) {
        slots.push({ startsAt: start, endsAt: end });
      }
      pointer += SLOT_GRANULARITY_MINUTES;
    }
  }

  return slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export function generateConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "MD-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
