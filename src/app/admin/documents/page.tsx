import Link from "next/link";
import { FileText, Search, Download } from "lucide-react";
import { getAllDocumentsForAdmin } from "@/lib/queries/admin";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateShort } from "@/lib/utils";

export const metadata = { title: "Documents" };
export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  INSURANCE: "Insurance",
  XRAY: "X-Ray",
  LAB_RESULT: "Lab Result",
  CONSENT_FORM: "Consent Form",
  ID_CARD: "ID Card",
  OTHER: "Other",
};

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const documents = await getAllDocumentsForAdmin(params.category, params.q);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Documents</h1>
        <p className="text-ink-500 mt-1">All patient documents on file across the practice.</p>
      </div>

      <form action="/admin/documents" method="GET" className="flex flex-wrap gap-3">
        <Input name="q" defaultValue={params.q} placeholder="Search by patient name…" className="w-64" />
        <Select name="category" defaultValue={params.category ?? ""} className="w-auto">
          <option value="">All Categories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          <Search className="size-4" /> Filter
        </Button>
      </form>

      {documents.length === 0 ? (
        <EmptyState icon={FileText} title="No documents match these filters" />
      ) : (
        <div className="rounded-2xl border border-ink-200 bg-white divide-y divide-ink-100">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4">
              <Link href={`/admin/patients/${doc.patientId}`}>
                <Avatar firstName={doc.patient.firstName} lastName={doc.patient.lastName} color={doc.patient.avatarColor} size="sm" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900 truncate">{doc.fileName}</p>
                <p className="text-xs text-ink-500">
                  <Link href={`/admin/patients/${doc.patientId}`} className="hover:text-brand-600">
                    {doc.patient.firstName} {doc.patient.lastName}
                  </Link>{" "}
                  · {categoryLabels[doc.category] ?? doc.category} · {formatDateShort(doc.uploadedAt)}
                </p>
              </div>
              <a href={`/api/documents/${doc.id}`} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-brand-600 p-2">
                <Download className="size-4.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
