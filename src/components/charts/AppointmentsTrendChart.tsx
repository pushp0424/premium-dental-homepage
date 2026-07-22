"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const INK_MUTED = "#898781";
const GRID = "#e1e0d9";
const SERIES = "#0b5fff";

export function AppointmentsTrendChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: INK_MUTED }}
          axisLine={{ stroke: GRID }}
          tickLine={false}
          interval={Math.ceil(data.length / 7)}
        />
        <YAxis tick={{ fontSize: 11, fill: INK_MUTED }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
          labelStyle={{ fontWeight: 600, color: "#0f172a" }}
          formatter={(value) => [value, "Appointments"]}
        />
        <Line type="monotone" dataKey="count" stroke={SERIES} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
