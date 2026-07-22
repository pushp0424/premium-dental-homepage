import { MapPin, Phone, Clock, Stethoscope, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { getIcon } from "@/lib/icon-map";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [locations, doctors, services] = await Promise.all([
    prisma.location.findMany(),
    prisma.doctor.findMany({ orderBy: { lastName: "asc" } }),
    prisma.service.findMany({ orderBy: { category: "asc" } }),
  ]);

  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Practice Settings</h1>
        <p className="text-ink-500 mt-1">Locations, doctors, and services configured for Meridian Dental.</p>
      </div>

      <section>
        <h2 className="font-bold text-ink-900 mb-4 flex items-center gap-2">
          <MapPin className="size-4.5" /> Locations
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="rounded-2xl border border-ink-200 bg-white p-5">
              <p className="font-bold text-ink-900">{loc.name}</p>
              <p className="text-sm text-ink-500 mt-1">
                {loc.addressLine}, {loc.city}, {loc.state} {loc.zip}
              </p>
              <div className="mt-3 space-y-1.5 text-sm text-ink-500">
                <p className="flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {loc.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {loc.hoursNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-ink-900 mb-4 flex items-center gap-2">
          <Stethoscope className="size-4.5" /> Doctors
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-ink-200 bg-white p-5 flex gap-3">
              <Avatar firstName={doc.firstName} lastName={doc.lastName} color={doc.photoColor} size="lg" />
              <div className="min-w-0">
                <p className="font-bold text-ink-900 truncate">
                  Dr. {doc.firstName} {doc.lastName}
                </p>
                <p className="text-xs font-semibold text-brand-600">{doc.credentials}</p>
                <p className="text-xs text-ink-500 mt-1">{doc.specialty}</p>
                <p className="text-xs text-ink-400 mt-1">{doc.yearsExperience}+ yrs · {doc.languages}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-bold text-ink-900 mb-4 flex items-center gap-2">
          <Sparkles className="size-4.5" /> Services
        </h2>
        <div className="rounded-2xl border border-ink-200 bg-white divide-y divide-ink-100">
          {services.map((svc) => {
            const Icon = getIcon(svc.icon);
            return (
              <div key={svc.id} className="flex items-center gap-4 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink-900">{svc.name}</p>
                  <p className="text-xs text-ink-500">{svc.durationMinutes} min</p>
                </div>
                <Badge tone="neutral">{svc.category}</Badge>
                <span className="w-20 text-right font-semibold text-ink-900 text-sm">
                  {svc.price === 0 ? "Free" : formatCurrency(svc.price)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
