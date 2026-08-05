"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCourseLeaderboardQuery } from "@/redux/api/analyticsApi";
import Link from "next/link";
import { useState } from "react";

export function StudentsTab({ courseId }: { courseId: string }) {
  const { data: students, isLoading } = useGetCourseLeaderboardQuery(courseId);
  const [compareA, setCompareA] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Enrolled students · Ranking</h3>
        {compareA && (
          <p className="text-sm text-muted-foreground">
            Student A selected — pick a second student to compare
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Quiz Avg</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Assessments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody colSpan={6}>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                Loading…
              </TableCell>
            </TableRow>
          ) : students?.length ? (
            students.map((student) => (
              <TableRow key={student.userId}>
                <TableCell className="font-semibold text-[var(--perf-2)]">
                  #{student.rank}
                </TableCell>
                <TableCell className="font-medium">
                  {student.user.fullName}
                  <div className="text-xs text-muted-foreground">{student.user.email}</div>
                </TableCell>
                <TableCell className="text-[var(--perf-quiz)]">
                  {student.quizAvgPercent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-[var(--perf-completion)]">
                  {student.completionPercent.toFixed(1)}%
                </TableCell>
                <TableCell>
                  {student.quizzesAttempted}/{student.quizzesTotal}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/students/${student.userId}?courseId=${courseId}`}>
                      Analysis
                    </Link>
                  </Button>
                  {compareA && compareA !== student.userId ? (
                    <Button asChild size="sm">
                      <Link
                        href={`/dashboard/compare?userA=${compareA}&userB=${student.userId}&courseId=${courseId}`}
                      >
                        Compare
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant={compareA === student.userId ? "secondary" : "ghost"}
                      onClick={() =>
                        setCompareA(
                          compareA === student.userId ? null : student.userId,
                        )
                      }
                    >
                      {compareA === student.userId ? "Selected" : "Compare"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                No enrolled students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
