"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type ProfileState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(_prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await getSession();
  if (!session?.patientId) return { error: "Not authenticated." };

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const addressLine = formData.get("addressLine") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const insuranceProvider = formData.get("insuranceProvider") as string;
  const insuranceMemberId = formData.get("insuranceMemberId") as string;
  const emergencyContactName = formData.get("emergencyContactName") as string;
  const emergencyContactPhone = formData.get("emergencyContactPhone") as string;

  if (!firstName?.trim() || !lastName?.trim() || !phone?.trim()) {
    return { error: "Name and phone are required." };
  }

  await prisma.patient.update({
    where: { id: session.patientId },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      addressLine: addressLine?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      zip: zip?.trim() || null,
      insuranceProvider: insuranceProvider?.trim() || null,
      insuranceMemberId: insuranceMemberId?.trim() || null,
      emergencyContactName: emergencyContactName?.trim() || null,
      emergencyContactPhone: emergencyContactPhone?.trim() || null,
    },
  });

  revalidatePath("/portal/profile");
  revalidatePath("/portal");
  return { success: true };
}
