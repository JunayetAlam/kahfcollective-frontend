"use client";

import { ScoreRing } from "@/components/Performance/Charts/ScoreRing";
import { MultiSubjectBars } from "@/components/Performance/Charts/AssessmentScoreBars";
import { Button } from "@/components/ui/button";
import { StudentPerfSummary } from "@/types";
import Link from "next/link";
import { Trophy } from "lucide-react";

type Props = {
  data: StudentPerfSummary;
  courseHref: (courseId: string) => string;
};

export function PerformanceOverview({ data, courseHref }: Props) {
  const subjectRows = data.courses.map((c) => ({
    name: c.title.length > 18 ? `${c.title.slice(0, 16)}…` : c.title,
    quiz: c.quizAvgPercent,
    completion: c.completionPercent,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--perf-quiz)]">Performance</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {data.user.fullName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.overall.courseCount} course
            {data.overall.courseCount === 1 ? "" : "s"} · Roll {data.user.roll}
          </p>
        </div>
        <div className="flex flex-wrap gap-8">
          <ScoreRing
            value={data.overall.quizAvgPercent}
            label="Overall Quiz"
            color="var(--perf-quiz)"
          />
          <ScoreRing
            value={data.overall.completionPercent}
            label="Overall Completion"
            color="var(--perf-completion)"
          />
        </div>
      </div>

      {subjectRows.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-background p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Courses at a glance
          </h2>
          <MultiSubjectBars data={subjectRows} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.courses.map((course) => (
          <Link
            key={course.id}
            href={courseHref(course.id)}
            className="group rounded-xl border border-border/70 bg-background p-5 transition hover:border-[var(--perf-quiz)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold leading-snug group-hover:text-[var(--perf-quiz)]">
                {course.title}
              </h3>
              {course.rank != null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--perf-2)_18%,transparent)] px-2 py-0.5 text-xs font-semibold text-[var(--perf-2)]">
                  <Trophy className="h-3 w-3" />#{course.rank}
                </span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Quiz avg</p>
                <p className="text-lg font-semibold text-[var(--perf-quiz)]">
                  {course.quizAvgPercent.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Completion</p>
                <p className="text-lg font-semibold text-[var(--perf-completion)]">
                  {course.completionPercent.toFixed(1)}%
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              View details
            </Button>
          </Link>
        ))}
      </div>

      {data.courses.length === 0 && (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No enrolled courses yet.
        </p>
      )}
    </div>
  );
}
