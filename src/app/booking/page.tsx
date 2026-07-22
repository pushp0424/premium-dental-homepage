import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { MotionRoot } from "@/components/MotionRoot";
import { BookingWizard } from "@/components/booking/BookingWizard";
import type { BookingDoctor } from "@/lib/types/booking";

export const metadata = { title: "Book an Appointment" };

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; location?: string; doctor?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  const [services, locations, doctorsRaw] = await Promise.all([
    prisma.service.findMany({ orderBy: { category: "asc" } }),
    prisma.location.findMany(),
    prisma.doctor.findMany({
      include: { workingHours: { select: { locationId: true } } },
      orderBy: { lastName: "asc" },
    }),
  ]);

  const doctors: BookingDoctor[] = doctorsRaw.map((d) => ({
    id: d.id,
    firstName: d.firstName,
    lastName: d.lastName,
    credentials: d.credentials,
    specialty: d.specialty,
    bio: d.bio,
    photoColor: d.photoColor,
    yearsExperience: d.yearsExperience,
    locationIds: Array.from(new Set(d.workingHours.map((w) => w.locationId))),
  }));

  const patient = session?.patientId
    ? { patientId: session.patientId, firstName: session.firstName ?? "", lastName: session.lastName ?? "", email: session.email }
    : null;

  return (
    <MotionRoot>
      <Navbar />
      <main id="main-content" className="flex-1 bg-ink-50/50">
        <BookingWizard
          services={services}
          locations={locations}
          doctors={doctors}
          patient={patient}
          preselect={{
            serviceId: params.service,
            locationId: params.location,
            doctorId: params.doctor,
          }}
        />
      </main>
      <Footer />
    </MotionRoot>
  );
}
