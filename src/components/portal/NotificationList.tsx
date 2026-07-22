import { BellRing, Mail, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ReminderItem {
  id: string;
  channel: string;
  message: string;
  scheduledFor: Date;
  status: string;
  appointment: { service: { name: string }; doctor: { firstName: string; lastName: string } } | null;
}

export function NotificationList({ reminders }: { reminders: ReminderItem[] }) {
  if (reminders.length === 0) {
    return (
      <div className="p-6 text-center">
        <BellRing className="size-6 text-ink-300 mx-auto mb-2" />
        <p className="text-sm text-ink-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-ink-100">
      <div className="px-4 py-3">
        <p className="text-sm font-bold text-ink-900">Notifications</p>
      </div>
      {reminders.map((r) => (
        <div key={r.id} className="flex gap-3 px-4 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 mt-0.5">
            {r.channel === "EMAIL" ? <Mail className="size-3.5" /> : <MessageSquare className="size-3.5" />}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-ink-800 leading-snug">{r.message}</p>
            {r.appointment && (
              <p className="text-xs text-ink-400 mt-1">
                {r.appointment.service.name} · Dr. {r.appointment.doctor.lastName}
              </p>
            )}
            <p className="text-xs text-ink-400 mt-0.5">{formatDate(r.scheduledFor, { weekday: undefined, year: undefined })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
