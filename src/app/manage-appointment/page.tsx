import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { MotionRoot } from "@/components/MotionRoot";
import { ManageAppointmentClient } from "@/components/booking/ManageAppointmentClient";

export const metadata = { title: "Manage Your Appointment" };

export default async function ManageAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;

  return (
    <MotionRoot>
      <Navbar />
      <main id="main-content" className="flex-1 bg-ink-50/50 pt-32 pb-14 px-6">
        <ManageAppointmentClient initialCode={params.code ?? ""} />
      </main>
      <Footer />
    </MotionRoot>
  );
}
