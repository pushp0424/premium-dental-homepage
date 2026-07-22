import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = session.patientId === doc.patientId;
  const isStaff = session.role === "ADMIN";
  if (!isOwner && !isStaff) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const contentType = doc.fileType === "text/plain" ? "text/plain; charset=utf-8" : doc.fileType;

  return new NextResponse(new Uint8Array(doc.content), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${doc.fileName}"`,
    },
  });
}
