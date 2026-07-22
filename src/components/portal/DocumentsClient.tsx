"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { FileText, Image as ImageIcon, File, UploadCloud, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select, Label, FieldError } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatDateShort } from "@/lib/utils";
import { uploadDocumentAction, deleteDocumentAction, type UploadState } from "@/app/portal/documents/actions";

export interface DocItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  uploadedAt: string;
  uploadedByRole: string;
}

const categoryLabels: Record<string, string> = {
  INSURANCE: "Insurance",
  XRAY: "X-Ray",
  LAB_RESULT: "Lab Result",
  CONSENT_FORM: "Consent Form",
  ID_CARD: "ID Card",
  OTHER: "Other",
};

function iconFor(fileType: string) {
  if (fileType.startsWith("image/")) return ImageIcon;
  if (fileType === "application/pdf") return FileText;
  return File;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsClient({ documents: initial }: { documents: DocItem[] }) {
  const { push } = useToast();
  const [documents, setDocuments] = useState(initial);
  const [state, formAction, pending] = useActionState<UploadState, FormData>(uploadDocumentAction, undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && state && "success" in state) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteDocumentAction(id);
      setDeletingId(null);
      if (result && "error" in result) {
        push({ title: "Couldn't delete document", description: result.error, tone: "error" });
      } else {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        push({ title: "Document deleted", tone: "success" });
      }
    });
  }

  return (
    <div className="space-y-6">
      <form ref={formRef} action={formAction} className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-bold text-ink-900 mb-4">Upload a Document</h2>
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file">File</Label>
              <input
                id="file"
                name="file"
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                className="w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" name="category" defaultValue="OTHER">
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <Button type="submit" loading={pending}>
            <UploadCloud className="size-4.5" /> Upload
          </Button>
        </div>
        {state && "error" in state && <FieldError>{state.error}</FieldError>}
      </form>

      {documents.length === 0 ? (
        <EmptyState icon={FileText} title="No documents uploaded yet" description="Insurance cards, X-rays, and forms will appear here." />
      ) : (
        <div className="rounded-2xl border border-ink-200 bg-white divide-y divide-ink-100">
          {documents.map((doc) => {
            const Icon = iconFor(doc.fileType);
            return (
              <div key={doc.id} className="flex items-center gap-4 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-ink-500">
                    {categoryLabels[doc.category] ?? doc.category} · {formatSize(doc.fileSize)} · {formatDateShort(doc.uploadedAt)}
                  </p>
                </div>
                <a href={`/api/documents/${doc.id}`} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-brand-600 p-2">
                  <Download className="size-4.5" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="text-ink-400 hover:text-danger-600 p-2 disabled:opacity-40"
                  aria-label={`Delete ${doc.fileName}`}
                >
                  <Trash2 className="size-4.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
