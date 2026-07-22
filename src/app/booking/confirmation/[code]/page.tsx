import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck2, MapPin, Phone, Download, Stethoscope } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default async function ConfirmationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const session = await getSession();

  const appointment = await prisma.appointment.findUnique({
    where: { confirmationCode: code },
    include: { service: true, doctor: true, location: true, patient: true },
  });

  if (!appointment) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 bg-ink-50/50 py-14 px-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-success-50 text-success-600 mb-5">
              <CalendarCheck2 className="size-8" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">You&apos;re all set, {appointment.patient.firstName}!</h1>
            <p className="mt-2 text-ink-500">A confirmation has been sent for your records.</p>
          </div>

          <div className="rounded-3xl border border-ink-200 bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between pb-5 border-b border-ink-100 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Confirmation Code</span>
              <span className="font-mono font-bold text-brand-700 tracking-wide">{appointment.confirmationCode}</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <CalendarCheck2 className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">{formatDate(appointment.startsAt)}</p>
                  <p className="text-sm text-ink-500">
                    {formatTime(appointment.startsAt)} – {formatTime(appointment.endsAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Stethoscope className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">
                    {appointment.service.name} with Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </p>
                  <p className="text-sm text-ink-500">
                    {appointment.service.price === 0 ? "Free consultation" : formatCurrency(appointment.service.price)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink-900">{appointment.location.name}</p>
                  <p className="text-sm text-ink-500">
                    {appointment.location.addressLine}, {appointment.location.city}, {appointment.location.state}{" "}
                    {appointment.location.zip}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="size-4.5 text-ink-400 mt-0.5 shrink-0" />
                <p className="text-sm text-ink-500">{appointment.location.phone}</p>
              </div>
            </div>

            <div className="mt-7 grid sm:grid-cols-2 gap-3">
              <a href={`/api/ics/${appointment.confirmationCode}`} download>
                <Button variant="outline" className="w-full">
                  <Download className="size-4" /> Add to Calendar
                </Button>
              </a>
              <Link href={`/manage-appointment?code=${appointment.confirmationCode}`}>
                <Button variant="outline" className="w-full">
                  Reschedule or Cancel
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            {session ? (
              <Link href="/portal">
                <Button size="lg">Go to My Portal</Button>
              </Link>
            ) : (
              <Link href="/">
                <Button size="lg">Back to Home</Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
