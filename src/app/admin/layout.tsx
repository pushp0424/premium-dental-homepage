import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const emailName = session.email.split("@")[0];
  const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

  return (
    <DashboardShell
      variant="admin"
      brandLabel="Staff Dashboard"
      user={{ firstName: displayName, lastName: "", email: session.email, color: "#0F172A" }}
    >
      {children}
    </DashboardShell>
  );
}
