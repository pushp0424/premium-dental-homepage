"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginState = { error?: string } | undefined;

async function signInAndRedirect(email: string, password: string, callbackUrl?: string | null) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { patient: true },
  });
  if (!user) return { error: "We couldn't find an account with that email." };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { error: "Incorrect password. Please try again." };

  const token = await createSessionToken({
    userId: user.id,
    role: user.role as "PATIENT" | "ADMIN" | "DOCTOR",
    email: user.email,
    patientId: user.patient?.id,
    firstName: user.patient?.firstName,
    lastName: user.patient?.lastName,
  });
  await setSessionCookie(token);

  if (callbackUrl && callbackUrl.startsWith("/")) redirect(callbackUrl);
  redirect(user.role === "ADMIN" ? "/admin" : "/portal");
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your details and try again." };
  }
  const callbackUrl = formData.get("callbackUrl") as string | null;
  const result = await signInAndRedirect(parsed.data.email, parsed.data.password, callbackUrl);
  return result;
}

export async function quickLoginPatientAction() {
  await signInAndRedirect("sarah.patient@demo.com", "Demo1234!");
}

export async function quickLoginAdminAction() {
  await signInAndRedirect("admin@meridiandental.com", "Demo1234!");
}
