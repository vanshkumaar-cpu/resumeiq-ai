"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface ScorePoint {
  date: string;
  atsScore: number;
  matchScore: number;
}

const chartConfig: ChartConfig = {
  atsScore: { label: "ATS Score", color: "var(--brand)" },
  matchScore: { label: "Match %", color: "var(--brand-violet)" },
};

export function ScoreChart({ data }: { data: ScorePoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <AreaChart data={data} margin={{ left: -12, right: 12, top: 10 }}>
        <defs>
          <linearGradient id="fillAts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--brand)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillMatch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--brand-violet)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--brand-violet)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 5" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 100]}
          className="text-xs"
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="matchScore"
          type="monotone"
          fill="url(#fillMatch)"
          stroke="var(--brand-violet)"
          strokeWidth={2}
        />
        <Area
          dataKey="atsScore"
          type="monotone"
          fill="url(#fillAts)"
          stroke="var(--brand)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
