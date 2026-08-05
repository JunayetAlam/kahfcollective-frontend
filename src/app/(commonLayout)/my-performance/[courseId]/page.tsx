"use client";

import Container from "@/components/Global/Container";
import Loading from "@/components/Global/Loading";
import { CoursePerformanceView } from "@/components/Performance/CoursePerformanceView";
import { useGetMyCoursePerformanceQuery } from "@/redux/api/analyticsApi";
import { use } from "react";

export default function MyCoursePerformancePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { data, isLoading, isError } = useGetMyCoursePerformanceQuery(courseId);

  if (isLoading) return <Loading />;

  return (
    <Container className="pb-20 pt-32">
      {isError || !data ? (
        <p className="text-center text-sm text-muted-foreground">
          Could not load course performance.
        </p>
      ) : (
        <CoursePerformanceView data={data} backHref="/my-performance" />
      )}
    </Container>
  );
}
