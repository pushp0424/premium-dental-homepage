"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export type RegisterState = { error?: string } | undefined;

export async function registerAction(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }
  const { firstName, lastName, email, phone, dateOfBirth, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in instead." };
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
        create: {
          firstName,
          lastName,
          phone,
          dateOfBirth: new Date(dateOfBirth),
          avatarColor,
        },
      },
    },
    include: { patient: true },
  });

  const token = await createSessionToken({
    userId: user.id,
    role: "PATIENT",
    email: user.email,
    patientId: user.patient!.id,
    firstName: user.patient!.firstName,
    lastName: user.patient!.lastName,
  });
  await setSessionCookie(token);

  const callbackUrl = formData.get("callbackUrl") as string | null;
  if (callbackUrl && callbackUrl.startsWith("/")) redirect(callbackUrl);
  redirect("/portal");
}
