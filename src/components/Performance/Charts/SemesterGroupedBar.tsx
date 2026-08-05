"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

type MetricRow = {
  metric: string;
  quiz: number;
  completion: number;
};

type Props = {
  data: MetricRow[];
  className?: string;
};

const config: ChartConfig = {
  quiz: { label: "Quiz Avg", color: "var(--perf-quiz)" },
  completion: { label: "Completion", color: "var(--perf-completion)" },
};

export function SemesterGroupedBar({ data, className }: Props) {
  return (
    <ChartContainer config={config} className={className ?? "aspect-[16/9] w-full"}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="metric" tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
        <Bar dataKey="quiz" fill="var(--color-quiz)" radius={[6, 6, 0, 0]} />
        <Bar
          dataKey="completion"
          fill="var(--color-completion)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
