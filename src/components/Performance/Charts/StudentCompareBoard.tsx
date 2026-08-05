"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { StudentCompareResult } from "@/types";
import { cn } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ScoreRing } from "./ScoreRing";
import { SubjectRadar } from "./SubjectRadar";

type Props = {
  data: StudentCompareResult;
  className?: string;
};

export function StudentCompareBoard({ data, className }: Props) {
  const { studentA, studentB, deltas } = data;

  const radarData = [
    { axis: "Quiz", subjectA: studentA.quizAvgPercent, subjectB: studentB.quizAvgPercent },
    {
      axis: "Completion",
      subjectA: studentA.completionPercent,
      subjectB: studentB.completionPercent,
    },
    {
      axis: "Attempt",
      subjectA: studentA.attemptRate,
      subjectB: studentB.attemptRate,
    },
  ];

  const grouped = [
    { metric: "Quiz Avg", a: studentA.quizAvgPercent, b: studentB.quizAvgPercent },
    {
      metric: "Completion",
      a: studentA.completionPercent,
      b: studentB.completionPercent,
    },
  ];

  const barConfig: ChartConfig = {
    a: { label: studentA.user.fullName, color: "var(--perf-3)" },
    b: { label: studentB.user.fullName, color: "var(--perf-5)" },
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--perf-3)_35%,transparent)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--perf-3)]">
            Student A{studentA.rank != null ? ` · Rank #${studentA.rank}` : ""}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{studentA.user.fullName}</h3>
          <p className="text-sm text-muted-foreground">{studentA.user.email}</p>
        </div>
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--perf-5)_35%,transparent)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--perf-5)]">
            Student B{studentB.rank != null ? ` · Rank #${studentB.rank}` : ""}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{studentB.user.fullName}</h3>
          <p className="text-sm text-muted-foreground">{studentB.user.email}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10">
        <ScoreRing
          value={studentA.quizAvgPercent}
          label={`${studentA.user.fullName.split(" ")[0]} Quiz`}
          color="var(--perf-3)"
        />
        <ScoreRing
          value={studentB.quizAvgPercent}
          label={`${studentB.user.fullName.split(" ")[0]} Quiz`}
          color="var(--perf-5)"
        />
        <ScoreRing
          value={studentA.completionPercent}
          label="A Completion"
          color="var(--perf-completion)"
        />
        <ScoreRing
          value={studentB.completionPercent}
          label="B Completion"
          color="var(--perf-2)"
        />
      </div>

      <div className="flex justify-center gap-3 text-sm">
        <span className="rounded-lg bg-muted px-3 py-2">
          Quiz Δ <strong>{deltas.quizAvg >= 0 ? "+" : ""}{deltas.quizAvg.toFixed(1)}%</strong>
        </span>
        <span className="rounded-lg bg-muted px-3 py-2">
          Completion Δ{" "}
          <strong>
            {deltas.completion >= 0 ? "+" : ""}
            {deltas.completion.toFixed(1)}%
          </strong>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 p-4">
          <h4 className="mb-3 text-sm font-semibold">Profile radar</h4>
          <SubjectRadar
            data={radarData}
            seriesALabel={studentA.user.fullName}
            seriesBLabel={studentB.user.fullName}
          />
        </div>
        <div className="rounded-xl border border-border/70 p-4">
          <h4 className="mb-3 text-sm font-semibold">Metric bars</h4>
          <ChartContainer config={barConfig} className="aspect-[16/10] w-full">
            <BarChart data={grouped}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="metric" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} width={36} tickLine={false} axisLine={false} />
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
