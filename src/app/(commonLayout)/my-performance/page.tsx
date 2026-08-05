"use client";

import Container from "@/components/Global/Container";
import Loading from "@/components/Global/Loading";
import { PerformanceOverview } from "@/components/Performance/PerformanceOverview";
import { useGetMyPerformanceQuery } from "@/redux/api/analyticsApi";

export default function MyPerformancePage() {
  const { data, isLoading, isError } = useGetMyPerformanceQuery(undefined);

  if (isLoading) return <Loading />;

  return (
    <Container className="pb-20 pt-32">
      {isError || !data ? (
        <p className="text-center text-sm text-muted-foreground">
          Could not load performance data.
        </p>
      ) : (
        <PerformanceOverview
          data={data}
          courseHref={(id) => `/my-performance/${id}`}
        />
      )}
    </Container>
  );
}
