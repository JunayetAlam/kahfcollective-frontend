"use client";

import { AssessmentScoreBars, MultiSubjectBars } from "@/components/Performance/Charts/AssessmentScoreBars";
import { ScoreRing } from "@/components/Performance/Charts/ScoreRing";
import { SemesterGroupedBar } from "@/components/Performance/Charts/SemesterGroupedBar";
import { SubjectCompareBoard } from "@/components/Performance/Charts/SubjectCompareBoard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazyCompareSubjectsQuery } from "@/redux/api/analyticsApi";
import { CoursePerfDetail } from "@/types";
import { ChevronLeft, GitCompareArrows } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  data: CoursePerfDetail;
  backHref: string;
  /** When set, subject compare runs for this student (instructor view) */
  compareUserId?: string;
};

export function CoursePerformanceView({ data, backHref, compareUserId }: Props) {
  const [chapterA, setChapterA] = useState<string>("");
  const [chapterB, setChapterB] = useState<string>("");
  const [triggerCompare, { data: compareData, isFetching }] =
    useLazyCompareSubjectsQuery();

  const allChapters = useMemo(
    () =>
      data.semesters.flatMap((s) =>
        s.chapters.map((c) => ({
          id: c.id,
          label: `${s.name} · ${c.name}`,
        })),
      ),
    [data.semesters],
  );

  const semesterChart = data.semesters.map((s) => ({
    metric: s.name,
    quiz: s.quizAvgPercent,
    completion: s.completionPercent,
  }));

  const chapterChart = data.semesters.flatMap((s) =>
    s.chapters.map((c) => ({
      name: c.name.length > 14 ? `${c.name.slice(0, 12)}…` : c.name,
      quiz: c.quizAvgPercent,
      completion: c.completionPercent,
    })),
  );

  const handleCompare = async () => {
    if (!chapterA || !chapterB) {
      toast.error("Select two subjects to compare");
      return;
    }
    if (chapterA === chapterB) {
      toast.error("Pick two different subjects");
      return;
    }
    try {
      await triggerCompare({
        chapterA,
        chapterB,
        userId: compareUserId,
      }).unwrap();
    } catch {
      toast.error("Could not compare subjects");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-[var(--perf-quiz)]">Course performance</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">{data.course.title}</h1>
            {data.rank != null && (
              <p className="mt-1 text-sm text-[var(--perf-2)] font-medium">
                Course rank #{data.rank}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-6">
            <ScoreRing value={data.quizAvgPercent} label="Quiz avg" color="var(--perf-quiz)" />
            <ScoreRing
              value={data.completionPercent}
              label="Completion"
              color="var(--perf-completion)"
            />
            <ScoreRing value={data.attemptRate} label="Attempt rate" color="var(--perf-5)" />
          </div>
        </div>
      </div>

      {semesterChart.length > 0 && (
        <section className="rounded-xl border border-border/70 p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            By semester
          </h2>
          <SemesterGroupedBar data={semesterChart} />
        </section>
      )}

      {chapterChart.length > 0 && (
        <section className="rounded-xl border border-border/70 p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            By subject (chapter)
          </h2>
          <MultiSubjectBars data={chapterChart} />
        </section>
      )}

      {data.assessments.length > 0 && (
        <section className="rounded-xl border border-border/70 p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Assessments
          </h2>
          <AssessmentScoreBars
            data={data.assessments.map((a) => ({
              name: a.title.length > 16 ? `${a.title.slice(0, 14)}…` : a.title,
              score: a.markPercent,
            }))}
          />
        </section>
      )}

      <section className="rounded-xl border border-border/70 p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-[var(--perf-subject-a)]" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Compare two subjects
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <Select value={chapterA} onValueChange={setChapterA}>
            <SelectTrigger>
              <SelectValue placeholder="Subject A" />
            </SelectTrigger>
            <SelectContent>
              {allChapters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={chapterB} onValueChange={setChapterB}>
            <SelectTrigger>
              <SelectValue placeholder="Subject B" />
            </SelectTrigger>
            <SelectContent>
              {allChapters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCompare} disabled={isFetching}>
            {isFetching ? "Comparing…" : "Compare"}
          </Button>
        </div>
        {compareData && <SubjectCompareBoard data={compareData} />}
      </section>

      <div className="space-y-4">
        {data.semesters.map((sem) => (
          <details
            key={sem.id}
            className="rounded-xl border border-border/70 open:bg-muted/20"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>{sem.name}</span>
                <span className="text-sm text-muted-foreground">
                  Quiz {sem.quizAvgPercent.toFixed(1)}% · Done{" "}
                  {sem.completionPercent.toFixed(1)}%
                </span>
              </div>
            </summary>
            <div className="space-y-3 border-t px-5 py-4">
              {sem.chapters.map((ch) => (
                <div
                  key={ch.id}
                  className="rounded-lg border border-border/50 bg-background px-4 py-3"
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-medium">{ch.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quiz {ch.quizAvgPercent.toFixed(1)}% · Done{" "}
                      {ch.completionPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              {sem.chapters.length === 0 && (
                <p className="text-sm text-muted-foreground">No subjects in this semester.</p>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
