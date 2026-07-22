import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const guestPatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  locationId: z.string().min(1),
  doctorId: z.string().min(1),
  startsAt: z.string().min(1),
  reasonNote: z.string().max(500).optional(),
});

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().min(1),
  cancelReason: z.string().min(1, "Please let us know why you're cancelling"),
});

export const lookupAppointmentSchema = z.object({
  confirmationCode: z.string().min(1, "Enter your confirmation code"),
  email: z.string().email("Enter the email used to book"),
});
