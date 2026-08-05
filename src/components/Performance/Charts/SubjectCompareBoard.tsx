"use client";

import { SubjectCompareResult } from "@/types";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ScoreRing } from "./ScoreRing";
import { SubjectRadar } from "./SubjectRadar";

type Props = {
  data: SubjectCompareResult;
  className?: string;
};

function DeltaBadge({ value, label }: { value: number; label: string }) {
  const positive = value >= 0;
  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium",
        positive
          ? "bg-[color-mix(in_srgb,var(--perf-1)_18%,transparent)] text-[var(--perf-1)]"
          : "bg-[color-mix(in_srgb,var(--perf-4)_18%,transparent)] text-[var(--perf-4)]",
      )}
    >
      <span className="text-muted-foreground mr-1">{label}</span>
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </div>
  );
}

export function SubjectCompareBoard({ data, className }: Props) {
  const { subjectA, subjectB, deltas } = data;

  const radarData = [
    { axis: "Quiz", subjectA: subjectA.quizAvgPercent, subjectB: subjectB.quizAvgPercent },
    {
      axis: "Completion",
      subjectA: subjectA.completionPercent,
      subjectB: subjectB.completionPercent,
    },
    {
      axis: "Attempt rate",
      subjectA: subjectA.attemptRate,
      subjectB: subjectB.attemptRate,
    },
    {
      axis: "Contents",
      subjectA:
        subjectA.contentsTotal > 0
          ? (subjectA.contentsCompleted / subjectA.contentsTotal) * 100
          : 0,
      subjectB:
        subjectB.contentsTotal > 0
          ? (subjectB.contentsCompleted / subjectB.contentsTotal) * 100
          : 0,
    },
  ];

  const grouped = [
    {
      metric: "Quiz Avg",
      a: subjectA.quizAvgPercent,
      b: subjectB.quizAvgPercent,
    },
    {
      metric: "Completion",
      a: subjectA.completionPercent,
      b: subjectB.completionPercent,
    },
    {
      metric: "Attempt",
      a: subjectA.attemptRate,
      b: subjectB.attemptRate,
    },
  ];

  const barConfig: ChartConfig = {
    a: { label: subjectA.name, color: "var(--perf-subject-a)" },
    b: { label: subjectB.name, color: "var(--perf-subject-b)" },
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "color-mix(in srgb, var(--perf-subject-a) 40%, transparent)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--perf-subject-a)]">
            Subject A
          </p>
          <h3 className="mt-1 text-lg font-semibold">{subjectA.name}</h3>
          <p className="text-sm text-muted-foreground">
            {subjectA.courseTitle} · {subjectA.semesterName}
          </p>
        </div>
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "color-mix(in srgb, var(--perf-subject-b) 40%, transparent)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--perf-subject-b)]">
            Subject B
          </p>
          <h3 className="mt-1 text-lg font-semibold">{subjectB.name}</h3>
          <p className="text-sm text-muted-foreground">
            {subjectB.courseTitle} · {subjectB.semesterName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10">
        <ScoreRing
          value={subjectA.quizAvgPercent}
          label={`${subjectA.name} Quiz`}
          color="var(--perf-subject-a)"
        />
        <ScoreRing
          value={subjectB.quizAvgPercent}
          label={`${subjectB.name} Quiz`}
          color="var(--perf-subject-b)"
        />
        <ScoreRing
          value={subjectA.completionPercent}
          label={`${subjectA.name} Done`}
          color="var(--perf-completion)"
        />
        <ScoreRing
          value={subjectB.completionPercent}
          label={`${subjectB.name} Done`}
          color="var(--perf-2)"
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <DeltaBadge value={deltas.quizAvg} label="Quiz Δ" />
        <DeltaBadge value={deltas.completion} label="Completion Δ" />
        <DeltaBadge value={deltas.attemptRate} label="Attempt Δ" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-background p-4">
          <h4 className="mb-3 text-sm font-semibold">Radar overview</h4>
          <SubjectRadar
            data={radarData}
            seriesALabel={subjectA.name}
            seriesBLabel={subjectB.name}
          />
        </div>
        <div className="rounded-xl border border-border/70 bg-background p-4">
          <h4 className="mb-3 text-sm font-semibold">Side-by-side metrics</h4>
          <ChartContainer config={barConfig} className="aspect-[16/10] w-full">
            <BarChart data={grouped}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="metric" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="a" fill="var(--color-a)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="b" fill="var(--color-b)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
