"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/session-actions";
import { patientNavItems, adminNavItems } from "./navConfig";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

function isNavItemActive(item: DashboardNavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
}

function NavLinks({
  navItems,
  pathname,
  onNavigate,
}: {
  navItems: DashboardNavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = isNavItemActive(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className="size-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({
  variant,
  brandLabel,
  user,
  notificationCount = 0,
  notifications,
  children,
}: {
  variant: "patient" | "admin";
  brandLabel: string;
  user: { firstName: string; lastName: string; email: string; color?: string };
  notificationCount?: number;
  notifications?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems = variant === "patient" ? patientNavItems : adminNavItems;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-ink-50/40">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-ink-200">
          <div className="flex size-8.5 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-sm">
            M
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-[15px] leading-tight text-ink-900 truncate">Meridian Dental</p>
            <p className="text-xs text-ink-400 leading-tight">{brandLabel}</p>
          </div>
        </div>
        <div className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          <NavLinks navItems={navItems} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </div>
        <div className="p-3 border-t border-ink-200">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors"
            >
              <LogOut className="size-4.5" /> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-ink-200">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8.5 items-center justify-center rounded-[10px] bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-sm">
                  M
                </div>
                <p className="font-extrabold text-[15px] text-ink-900">Meridian Dental</p>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="size-5 text-ink-500" />
              </button>
            </div>
            <div className="flex-1 py-4 overflow-y-auto">
              <NavLinks navItems={navItems} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="p-3 border-t border-ink-200">
              <form action={logoutAction}>
                <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500">
                  <LogOut className="size-4.5" /> Log Out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-ink-200 bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden flex size-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {notifications && (
              <div className="relative">
                <button
                  className="relative flex size-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100"
                  onClick={() => setNotifOpen((v) => !v)}
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                >
                  <Bell className="size-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto scrollbar-thin rounded-2xl border border-ink-200 bg-white shadow-lift z-50">
                      {notifications}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center gap-2.5 pl-2 border-l border-ink-200">
              <Avatar firstName={user.firstName} lastName={user.lastName} color={user.color} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-ink-900 leading-tight">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-ink-400 leading-tight truncate max-w-40">{user.email}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
