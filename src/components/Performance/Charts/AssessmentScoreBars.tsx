"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const PERF_HUES = [
  "var(--perf-1)",
  "var(--perf-2)",
  "var(--perf-3)",
  "var(--perf-4)",
  "var(--perf-5)",
  "var(--perf-6)",
];

type Props = {
  data: { name: string; score: number }[];
  color?: string;
  className?: string;
};

export function AssessmentScoreBars({ data, color, className }: Props) {
  const config: ChartConfig = {
    score: { label: "Score", color: color ?? "var(--perf-quiz)" },
  };

  return (
    <ChartContainer config={config} className={className ?? "aspect-[16/7] w-full"}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
          tick={{ fontSize: 11 }}
        />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="var(--color-score)" />
      </BarChart>
    </ChartContainer>
  );
}

export function MultiSubjectBars({
  data,
  className,
}: {
  data: { name: string; quiz: number; completion: number }[];
  className?: string;
}) {
  const config: ChartConfig = {
    quiz: { label: "Quiz", color: "var(--perf-quiz)" },
    completion: { label: "Completion", color: "var(--perf-completion)" },
  };

  return (
    <ChartContainer config={config} className={className ?? "aspect-[16/8] w-full"}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={48}
          tick={{ fontSize: 11 }}
        />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="quiz" fill="var(--color-quiz)" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="completion"
          fill="var(--color-completion)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

export { PERF_HUES };
