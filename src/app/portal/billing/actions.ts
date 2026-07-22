"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

function detectCardBrand(digits: string) {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

function luhnCheck(digits: string) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export async function payInvoiceAction(
  invoiceId: string,
  cardNumber: string
): Promise<{ error: string } | { success: true }> {
  const session = await getSession();
  if (!session?.patientId) return { error: "You must be logged in to make a payment." };

  const digits = cardNumber.replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(digits) || !luhnCheck(digits)) {
    return { error: "That card number doesn't look valid. This is a demo — try 4242 4242 4242 4242." };
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice || invoice.patientId !== session.patientId) return { error: "Invoice not found." };
  if (invoice.status === "PAID") return { error: "This invoice has already been paid." };

  const brand = detectCardBrand(digits);
  const last4 = digits.slice(-4);

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: invoice.total,
        method: `${brand} •••• ${last4}`,
        status: "SUCCEEDED",
      },
    }),
    prisma.invoice.update({ where: { id: invoice.id }, data: { status: "PAID" } }),
  ]);

  revalidatePath("/portal/billing");
  return { success: true };
}
