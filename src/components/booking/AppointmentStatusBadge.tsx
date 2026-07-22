import { Badge } from "@/components/ui/Badge";

const toneMap: Record<string, "brand" | "success" | "warning" | "danger" | "neutral" | "accent"> = {
  PENDING: "warning",
  CONFIRMED: "brand",
  CHECKED_IN: "accent",
  COMPLETED: "success",
  CANCELLED: "danger",
  NO_SHOW: "neutral",
};

const labelMap: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CHECKED_IN: "Checked In",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

export function AppointmentStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={toneMap[status] ?? "neutral"} dot>
      {labelMap[status] ?? status}
    </Badge>
  );
}
