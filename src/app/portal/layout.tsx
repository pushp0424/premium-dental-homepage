import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPatientById, getPatientReminders, getUpcomingReminderCount } from "@/lib/queries/patient";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { NotificationList } from "@/components/portal/NotificationList";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.patientId) redirect("/login");

  const [patient, reminders, unreadCount] = await Promise.all([
    getPatientById(session.patientId),
    getPatientReminders(session.patientId),
    getUpcomingReminderCount(session.patientId),
  ]);
  if (!patient) redirect("/login");

  return (
    <DashboardShell
      variant="patient"
      brandLabel="Patient Portal"
      user={{ firstName: patient.firstName, lastName: patient.lastName, email: patient.user.email, color: patient.avatarColor }}
      notificationCount={unreadCount}
      notifications={<NotificationList reminders={reminders} />}
    >
      {children}
    </DashboardShell>
  );
}
