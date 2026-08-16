"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MyStats } from "@/lib/api/types";

/**
 * Three related series on one axis, distinguished by hue within the brand
 * family rather than by arbitrary colors. Stacked area would imply the metrics
 * sum, which they don't — so these are overlaid with low fill opacity.
 */
const SERIES = [
  { key: "views", label: "Views", color: "var(--color-violet)" },
  { key: "follows", label: "Follows", color: "var(--color-purple)" },
  { key: "likes", label: "Likes", color: "var(--color-lavender)" },
] as const;

export function StatsChart({ data }: { data: MyStats["series"] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid stroke="var(--color-line)" vertical={false} />

          <XAxis
            dataKey="day"
            tickFormatter={(day: string) => day.slice(5)}
            stroke="var(--color-ink-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--color-ink-subtle)"
            fontSize={11}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={40}
          />

          <Tooltip
            cursor={{ stroke: "var(--color-line-strong)" }}
            contentStyle={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-line)",
              borderRadius: 12,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-ink)", marginBottom: 4 }}
          />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "var(--color-ink-muted)", paddingTop: 8 }}
          />

          {SERIES.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#fill-${s.key})`}
              dot={false}
              activeDot={{ r: 3.5, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
