import { getSession } from "@/lib/auth";
import { getPatientDocuments } from "@/lib/queries/patient";
import { DocumentsClient } from "@/components/portal/DocumentsClient";

export const metadata = { title: "Documents" };

export default async function PortalDocumentsPage() {
  const session = await getSession();
  const documents = await getPatientDocuments(session!.patientId!);

  const serialized = documents.map((d) => ({
    id: d.id,
    fileName: d.fileName,
    fileType: d.fileType,
    fileSize: d.fileSize,
    category: d.category,
    uploadedAt: d.uploadedAt.toISOString(),
    uploadedByRole: d.uploadedByRole,
  }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Documents</h1>
        <p className="text-ink-500 mt-1">Upload insurance cards, forms, and other files for your care team.</p>
      </div>
      <DocumentsClient documents={serialized} />
    </div>
  );
}
