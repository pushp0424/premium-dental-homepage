"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

export type UploadState = { error: string } | { success: true } | undefined;

export async function uploadDocumentAction(_prevState: UploadState, formData: FormData): Promise<UploadState> {
  const session = await getSession();
  if (!session?.patientId) return { error: "You must be logged in to upload documents." };

  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "OTHER";
  if (!file || file.size === 0) return { error: "Please choose a file to upload." };
  if (file.size > MAX_SIZE) return { error: "File is too large. Max size is 10MB." };
  if (!ALLOWED_TYPES.has(file.type)) return { error: "Unsupported file type. Please upload a PDF, image, or text file." };

  const content = Buffer.from(await file.arrayBuffer());

  await prisma.document.create({
    data: {
      patientId: session.patientId,
      fileName: file.name,
      content,
      fileType: file.type,
      fileSize: file.size,
      category: category as never,
      uploadedByRole: "PATIENT",
    },
  });

  revalidatePath("/portal/documents");
  return { success: true };
}

export async function deleteDocumentAction(documentId: string) {
  const session = await getSession();
  if (!session?.patientId) return { error: "Not authenticated." };

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc || doc.patientId !== session.patientId) return { error: "Document not found." };

  await prisma.document.delete({ where: { id: documentId } });

  revalidatePath("/portal/documents");
  return { success: true };
}
