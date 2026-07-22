import { FileText, Stethoscope, MapPin } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPatientAppointments } from "@/lib/queries/patient";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Treatment Records" };

export default async function PortalRecordsPage() {
  const session = await getSession();
  const appointments = await getPatientAppointments(session!.patientId!);
  const completed = appointments
    .filter((a) => a.status === "COMPLETED")
    .sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Treatment Records</h1>
        <p className="text-ink-500 mt-1">A history of your completed visits at Meridian Dental.</p>
      </div>

      {completed.length === 0 ? (
        <EmptyState icon={FileText} title="No treatment records yet" description="Completed visits will show up here." />
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-ink-200" aria-hidden="true" />
          <div className="space-y-6">
            {completed.map((a) => (
              <div key={a.id} className="relative pl-14">
                <span className="absolute left-2.5 top-1 flex size-5 items-center justify-center rounded-full bg-brand-600 ring-4 ring-white">
                  <span className="size-1.5 rounded-full bg-white" />
                </span>
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mb-2">{formatDate(a.startsAt)}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex gap-2.5">
                      <Stethoscope className="size-4 text-ink-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink-900">{a.service.name}</p>
                        <p className="text-sm text-ink-500">
                          Dr. {a.doctor.firstName} {a.doctor.lastName} · {a.service.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <MapPin className="size-4 text-ink-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-ink-900">{a.location.name}</p>
                        <p className="text-sm text-ink-500">{formatCurrency(a.service.price)}</p>
                      </div>
                    </div>
                  </div>
                  {a.reasonNote && <p className="mt-3 text-sm text-ink-500 border-t border-ink-100 pt-3">Note: {a.reasonNote}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
