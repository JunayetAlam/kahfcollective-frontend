"use client";

import Loading from "@/components/Global/Loading";
import { CoursePerformanceView } from "@/components/Performance/CoursePerformanceView";
import { PerformanceOverview } from "@/components/Performance/PerformanceOverview";
import {
  useGetStudentCoursePerformanceQuery,
  useGetStudentPerformanceQuery,
} from "@/redux/api/analyticsApi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function InstructorStudentPerformancePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const summary = useGetStudentPerformanceQuery(userId, { skip: !!courseId });
  const courseDetail = useGetStudentCoursePerformanceQuery(
    { userId, courseId: courseId || "" },
    { skip: !courseId },
  );

  if (courseId) {
    if (courseDetail.isLoading) return <Loading />;
    if (courseDetail.isError || !courseDetail.data) {
      return (
        <p className="p-8 text-sm text-muted-foreground">
          Could not load course performance.
        </p>
      );
    }
    return (
      <div className="p-6 lg:p-8">
        <CoursePerformanceView
          data={courseDetail.data}
          backHref={`/dashboard/students/${userId}`}
          compareUserId={userId}
        />
      </div>
    );
  }

  if (summary.isLoading) return <Loading />;
  if (summary.isError || !summary.data) {
    return (
      <p className="p-8 text-sm text-muted-foreground">
        Could not load student performance.
      </p>
    );
  }

  return (
    <div className="space-y-4 p-6 lg:p-8">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/dashboard/my-courses"
          className="text-muted-foreground hover:text-foreground"
        >
          ← Courses
        </Link>
        <Link
          href={`/dashboard/compare?userA=${userId}`}
          className="font-medium text-[var(--perf-3)] hover:underline"
        >
          Compare with another student
        </Link>
      </div>
      <PerformanceOverview
        data={summary.data}
        courseHref={(id) => `/dashboard/students/${userId}?courseId=${id}`}
      />
    </div>
  );
}
