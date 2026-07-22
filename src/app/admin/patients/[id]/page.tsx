import { notFound } from "next/navigation";
import { FileText, Mail, Phone, MapPin, ShieldCheck, Download, Receipt } from "lucide-react";
import { getPatientDetail } from "@/lib/queries/admin";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppointmentStatusBadge } from "@/components/booking/AppointmentStatusBadge";
import { formatCurrency, formatDate, formatDateShort, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { patient, appointments, invoices, documents } = await getPatientDetail(id);
  if (!patient) notFound();

  const outstanding = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 flex flex-col sm:flex-row gap-6 sm:items-center">
        <Avatar firstName={patient.firstName} lastName={patient.lastName} color={patient.avatarColor} size="xl" />
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" /> {patient.user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5" /> {patient.phone}
            </span>
            {patient.addressLine && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {patient.addressLine}, {patient.city}, {patient.state} {patient.zip}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="neutral">Patient since {formatDateShort(patient.createdAt)}</Badge>
            <Badge tone="neutral">DOB {formatDateShort(patient.dateOfBirth)}</Badge>
            {patient.insuranceProvider && (
              <Badge tone="brand">
                <ShieldCheck className="size-3" /> {patient.insuranceProvider}
              </Badge>
            )}
            {outstanding > 0 && <Badge tone="warning">{formatCurrency(outstanding)} outstanding</Badge>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-4">Appointment History ({appointments.length})</h2>
          {appointments.length === 0 ? (
            <EmptyState icon={FileText} title="No appointments yet" />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
              {appointments.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-ink-100 p-3">
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{a.service.name}</p>
                    <p className="text-xs text-ink-500">
                      {formatDate(a.startsAt, { weekday: undefined })} · {formatTime(a.startsAt)}
                    </p>
                    <p className="text-xs text-ink-400">
                      Dr. {a.doctor.firstName} {a.doctor.lastName} · {a.location.name}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-ink-200 bg-white p-6">
          <h2 className="font-bold text-ink-900 mb-4">Billing ({invoices.length})</h2>
          {invoices.length === 0 ? (
            <EmptyState icon={Receipt} title="No invoices yet" />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3">
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{inv.invoiceNumber}</p>
                    <p className="text-xs text-ink-500">{formatCurrency(inv.total)} · Due {formatDateShort(inv.dueDate)}</p>
                  </div>
                  <Badge tone={inv.status === "PAID" ? "success" : inv.status === "OVERDUE" ? "danger" : "warning"} dot>
                    {inv.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-bold text-ink-900 mb-4">Documents ({documents.length})</h2>
        {documents.length === 0 ? (
          <EmptyState icon={FileText} title="No documents uploaded" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {documents.map((doc) => (
              <a
                key={doc.id}
                href={`/api/documents/${doc.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-ink-100 p-3 hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900 truncate">{doc.fileName}</p>
                  <p className="text-xs text-ink-400">{doc.category} · {formatDateShort(doc.uploadedAt)}</p>
                </div>
                <Download className="size-4 text-ink-400 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
