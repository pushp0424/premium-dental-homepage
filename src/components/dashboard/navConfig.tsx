import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  FolderOpen,
  CreditCard,
  UserCog,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import type { DashboardNavItem } from "./DashboardShell";

export const patientNavItems: DashboardNavItem[] = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/portal/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/portal/records", label: "Records", icon: FileText },
  { href: "/portal/documents", label: "Documents", icon: FolderOpen },
  { href: "/portal/billing", label: "Billing", icon: CreditCard },
  { href: "/portal/profile", label: "Profile", icon: UserCog },
];

export const adminNavItems: DashboardNavItem[] = [
  { href: "/admin", label: "Overview", icon: BarChart3, exact: true },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/documents", label: "Documents", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
