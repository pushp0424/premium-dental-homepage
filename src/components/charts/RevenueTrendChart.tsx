"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

const INK_MUTED = "#898781";
const GRID = "#e1e0d9";
const SERIES = "#0b5fff";

export function RevenueTrendChart({ data }: { data: { month: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: INK_MUTED }} axisLine={{ stroke: GRID }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: INK_MUTED }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
          labelStyle={{ fontWeight: 600, color: "#0f172a" }}
          formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
        />
        <Bar dataKey="total" fill={SERIES} radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
