"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "#2a78d6",
  PENDING: "#eda100",
  CHECKED_IN: "#1baf7a",
  COMPLETED: "#0ca30c",
  CANCELLED: "#d03b3b",
  NO_SHOW: "#ec835a",
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  CHECKED_IN: "Checked In",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

export function StatusBreakdownChart({ data }: { data: { status: string; count: number }[] }) {
  const chartData = data.map((d) => ({ ...d, label: STATUS_LABEL[d.status] ?? d.status }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={2}
          stroke="#ffffff"
        >
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLOR[entry.status] ?? "#94a3b8"} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
        <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12, color: "#334155" }} iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
